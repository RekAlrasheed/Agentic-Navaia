// Chat service for text-based conversations with AI agents
export interface ChatMessage {
  role: 'user' | 'agent' | 'system'
  content: string
  timestamp: Date
}

export interface AgentPersonality {
  name: string
  systemPrompt: string
  type: 'support' | 'sales'
}

const AGENT_PERSONALITIES: Record<string, AgentPersonality> = {
  support: {
    name: 'مساعد الدعم الفني',
    type: 'support',
    systemPrompt: `أنت مساعد دعم فني لشركة تأجير العقارات NAVAIA. مهمتك هي:

1. مساعدة العملاء في حل المشاكل التقنية والصيانة
2. استقبال طلبات الصيانة وفتح التذاكر
3. تقديم الدعم للعملاء الحاليين
4. جمع معلومات المشاكل وتصنيفها

كن مهذباً ومفيداً واطرح الأسئلة المناسبة لفهم المشكلة. 
أجب باللغة العربية دائماً.
إذا احتجت لفتح تذكرة صيانة، اطلب التفاصيل اللازمة مثل:
- نوع المشكلة (كهرباء، سباكة، تكييف، إلخ)
- مستوى الأولوية (عاجل، عادي، غير عاجل)
- وصف مفصل للمشكلة
- معلومات الاتصال والعقار`
  },
  sales: {
    name: 'مساعد المبيعات',
    type: 'sales',
    systemPrompt: `أنت مساعد مبيعات لشركة تأجير العقارات NAVAIA. مهمتك هي:

1. مساعدة العملاء في العثور على العقار المناسب
2. عرض الوحدات المتاحة حسب المتطلبات
3. ترتيب المواعيد لمعاينة العقارات
4. متابعة العملاء المحتملين

كن ودوداً ومقنعاً واطرح الأسئلة المناسبة لفهم احتياجات العميل.
أجب باللغة العربية دائماً.
اسأل عن:
- نوع العقار المطلوب (شقة، فيلا، محل تجاري)
- عدد الغرف والحمامات
- الحي المفضل
- الميزانية الشهرية
- التوقيت المطلوب للانتقال`
  }
}

export class ChatService {
  async sendMessage(
    message: string,
    agentType: 'support' | 'sales',
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          agentType,
          conversationHistory: conversationHistory.slice(-10) // Keep last 10 messages for context
        })
      })

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`)
      }

      const data = await response.json()
      return data.response || 'عذراً، لم أتمكن من الرد على استفسارك. يرجى المحاولة مرة أخرى.'

    } catch (error) {
      console.error('Chat service error:', error)
      
      // Fallback responses
      const fallbackResponses = {
        support: [
          'شكراً لتواصلك مع الدعم الفني. كيف يمكنني مساعدتك اليوم؟',
          'أفهم مشكلتك. دعني أجمع المزيد من المعلومات لمساعدتك بشكل أفضل.',
          'سأقوم بفتح تذكرة دعم لك. هل يمكنك وصف المشكلة بالتفصيل؟'
        ],
        sales: [
          'أهلاً وسهلاً! أنا هنا لمساعدتك في العثور على العقار المثالي.',
          'ممتاز! دعني أفهم احتياجاتك أكثر لأعرض عليك أفضل الخيارات.',
          'بالطبع يمكنني ترتيب موعد معاينة لك. ما هو الوقت المناسب؟'
        ]
      }
      
      const responses = fallbackResponses[agentType]
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  // Extract entities and intents from user message
  extractEntities(message: string): Record<string, any> {
    const entities: Record<string, any> = {}
    
    // Simple regex-based extraction (can be enhanced with NLP)
    const neighborhoods = ['الملقا', 'القيروان', 'حطين', 'النرجس', 'الياسمين']
    const propertyTypes = ['شقة', 'فيلا', 'استوديو', 'محل']
    const issues = ['كهرباء', 'سباكة', 'تكييف', 'مصعد', 'أمن']
    
    // Extract neighborhood
    neighborhoods.forEach(neighborhood => {
      if (message.includes(neighborhood)) {
        entities.neighborhood = neighborhood
      }
    })
    
    // Extract property type
    propertyTypes.forEach(type => {
      if (message.includes(type)) {
        entities.propertyType = type
      }
    })
    
    // Extract issues for support
    issues.forEach(issue => {
      if (message.includes(issue)) {
        entities.issue = issue
      }
    })
    
    // Extract numbers (could be bedrooms, budget, etc.)
    const numbers = message.match(/\d+/g)
    if (numbers) {
      // If it's a large number, likely budget
      numbers.forEach(num => {
        const value = parseInt(num)
        if (value > 1000) {
          entities.budget = value
        } else if (value <= 10) {
          entities.bedrooms = value
        }
      })
    }
    
    return entities
  }

  // Generate action items from conversation
  generateActionItems(messages: ChatMessage[], agentType: 'support' | 'sales'): string[] {
    const actions: string[] = []
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || ''
    
    if (agentType === 'support') {
      if (lastUserMessage.includes('مشكلة') || lastUserMessage.includes('عطل')) {
        actions.push('فتح تذكرة صيانة')
      }
      if (lastUserMessage.includes('عاجل') || lastUserMessage.includes('طارئ')) {
        actions.push('تصنيف كحالة طارئة')
      }
    } else if (agentType === 'sales') {
      if (lastUserMessage.includes('معاينة') || lastUserMessage.includes('موعد')) {
        actions.push('ترتيب موعد معاينة')
      }
      if (lastUserMessage.includes('اهتمام') || lastUserMessage.includes('أريد')) {
        actions.push('إضافة كعميل محتمل')
      }
    }
    
    return actions
  }
}

export const chatService = new ChatService()
