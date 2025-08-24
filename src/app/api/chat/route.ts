import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, agentType, conversationHistory } = await request.json()

    if (!message || !agentType) {
      return NextResponse.json({ error: 'Message and agentType are required' }, { status: 400 })
    }

    // For now, we'll use a simple implementation without OpenAI API
    // This can be enhanced later with actual OpenAI integration
    
    const responses = {
      support: {
        greetings: [
          'شكراً لتواصلك مع الدعم الفني. كيف يمكنني مساعدتك اليوم؟',
          'أهلاً وسهلاً! أنا هنا لحل أي مشاكل تقنية تواجهها.',
          'مرحباً! دعني أساعدك في حل المشكلة التي تواجهها.'
        ],
        problems: [
          'أفهم المشكلة التي تواجهها. دعني أجمع المزيد من المعلومات.',
          'سأقوم بفتح تذكرة صيانة لك فوراً. هل المشكلة عاجلة؟',
          'شكراً لتوضيح المشكلة. سأوجه طلبك للفريق المختص.'
        ],
        general: [
          'هل يمكنك وصف المشكلة بالتفصيل؟',
          'ما نوع المشكلة التي تواجهها؟ (كهرباء، سباكة، تكييف)',
          'هل هذه مشكلة طارئة أم يمكن التعامل معها لاحقاً؟'
        ]
      },
      sales: {
        greetings: [
          'أهلاً وسهلاً! أنا هنا لمساعدتك في العثور على العقار المثالي.',
          'مرحباً بك! ما نوع العقار الذي تبحث عنه؟',
          'أسعد لمساعدتك! دعني أعرف احتياجاتك لأعرض عليك أفضل الخيارات.'
        ],
        interest: [
          'ممتاز! دعني أفهم احتياجاتك أكثر لأعرض عليك أفضل الخيارات.',
          'رائع! هل تفضل شقة أم فيلا؟ وفي أي حي؟',
          'بالطبع يمكنني ترتيب موعد معاينة لك. ما هو الوقت المناسب؟'
        ],
        general: [
          'ما نوع العقار المطلوب؟ (شقة، فيلا، استوديو)',
          'كم عدد الغرف المطلوبة؟',
          'ما هي الميزانية الشهرية المتاحة؟',
          'هل لديك تفضيل لحي معين؟'
        ]
      }
    }

    // Simple keyword-based response selection
    let responseCategory = 'general'
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('أهلا') || lowerMessage.includes('السلام')) {
      responseCategory = 'greetings'
    } else if (agentType === 'support' && (lowerMessage.includes('مشكلة') || lowerMessage.includes('عطل') || lowerMessage.includes('خراب'))) {
      responseCategory = 'problems'
    } else if (agentType === 'sales' && (lowerMessage.includes('أريد') || lowerMessage.includes('أبحث') || lowerMessage.includes('اهتمام'))) {
      responseCategory = 'interest'
    }

    const agentResponses = responses[agentType as keyof typeof responses]
    let categoryResponses: string[]
    
    if (responseCategory === 'greetings') {
      categoryResponses = agentResponses.greetings
    } else if (responseCategory === 'problems' && agentType === 'support') {
      categoryResponses = (agentResponses as typeof responses.support).problems
    } else if (responseCategory === 'interest' && agentType === 'sales') {
      categoryResponses = (agentResponses as typeof responses.sales).interest
    } else {
      categoryResponses = agentResponses.general
    }
    
    const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)]

    // Extract entities for additional context
    const entities = extractEntities(message)

    return NextResponse.json({ 
      response,
      entities,
      agentType,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function extractEntities(message: string): Record<string, any> {
  const entities: Record<string, any> = {}
  
  // Extract common entities
  const neighborhoods = ['الملقا', 'القيروان', 'حطين', 'النرجس', 'الياسمين', 'الروضة', 'المحمدية']
  const propertyTypes = ['شقة', 'فيلا', 'استوديو', 'محل', 'مكتب', 'أرض']
  const issues = ['كهرباء', 'سباكة', 'تكييف', 'مصعد', 'أمن', 'تسريب', 'انقطاع']
  
  neighborhoods.forEach(neighborhood => {
    if (message.includes(neighborhood)) {
      entities.neighborhood = neighborhood
    }
  })
  
  propertyTypes.forEach(type => {
    if (message.includes(type)) {
      entities.propertyType = type
    }
  })
  
  issues.forEach(issue => {
    if (message.includes(issue)) {
      entities.issue = issue
    }
  })
  
  // Extract numbers
  const numbers = message.match(/\d+/g)
  if (numbers) {
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
