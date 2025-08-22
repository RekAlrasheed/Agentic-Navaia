'use client'

import { useState } from 'react'
import { 
  Bot, 
  Phone, 
  MessageSquare, 
  Play, 
  Pause, 
  Mic, 
  MicOff,
  Send,
  User,
  Settings,
  Volume2,
  VolumeX,
  Zap,
  Target,
  TrendingUp,
  MapPin,
  DollarSign,
  Calendar,
  Home,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useVoiceAgent } from '@/hooks/useVoiceAgent'

export default function PlaygroundPage() {
  const [selectedPersona, setSelectedPersona] = useState<'support' | 'sales'>('support')
  const [selectedMode, setSelectedMode] = useState<'voice' | 'chat'>('voice')
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'agent'; text: string; timestamp: Date }>>([])
  const [extractedEntities, setExtractedEntities] = useState<any>({})
  const [summary, setSummary] = useState('')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [chatWidgetLoaded, setChatWidgetLoaded] = useState(false)
  
  const { simulateInboundCall, simulateInboundMessage } = useAppStore()

  // Initialize voice agent
  const {
    isConnected,
    isListening,
    isSpeaking,
    status,
    currentSession,
    startVoiceSession,
    endVoiceSession,
    startListening,
    stopListening
  } = useVoiceAgent({
    onTranscript: (text, isFinal) => {
      setTranscript(text)
      if (isFinal) {
        addMessage('user', text)
        setTranscript('')
      }
    },
    onResponse: (text) => {
      addMessage('agent', text)
    },
    onError: (errorMsg) => {
      setError(errorMsg)
      setTimeout(() => setError(null), 5000)
    },
    onStatusChange: (newStatus) => {
      console.log('Voice status changed:', newStatus)
    }
  })

  const personas = [
    {
      id: 'support',
      name: 'دعم العملاء',
      description: 'مساعدة العملاء في حل المشاكل والاستفسارات',
      icon: '🛠️',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'sales',
      name: 'المبيعات',
      description: 'مساعدة العملاء في العثور على العقار المناسب',
      icon: '💰',
      color: 'from-emerald-500 to-teal-600'
    }
  ]

  const handleStartVoiceAgent = async () => {
    if (isConnected) {
      await endVoiceSession()
    } else {
      await startVoiceSession(selectedPersona)
    }
  }

  const handleMicrophoneToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const loadChatWidget = () => {
    if (chatWidgetLoaded) return

    // Remove existing script if any
    const existingScript = document.querySelector('script[src*="convai-widget-embed"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Remove existing widget if any
    const existingWidget = document.querySelector('elevenlabs-convai')
    if (existingWidget) {
      existingWidget.remove()
    }

    // Create new widget element
    const widgetElement = document.createElement('elevenlabs-convai')
    const agentId = selectedPersona === 'support' 
      ? 'agent_5701k2pjsar8f4gvz6ynd7ks5p5s' 
      : 'agent_9401k2pkqd9vfwz9p0p06eddj31f'
    
    widgetElement.setAttribute('agent-id', agentId)
    
    // Create script element
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
    script.async = true
    script.type = 'text/javascript'
    
    // Add to chat container
    const chatContainer = document.getElementById('chat-widget-container')
    if (chatContainer) {
      chatContainer.innerHTML = ''
      chatContainer.appendChild(widgetElement)
      document.head.appendChild(script)
      setChatWidgetLoaded(true)
    }
  }

  const switchChatAgent = () => {
    setChatWidgetLoaded(false)
    setTimeout(() => {
      loadChatWidget()
    }, 100)
  }

  const addMessage = (role: 'user' | 'agent', text: string) => {
    const newMessage = { role, text, timestamp: new Date() }
    setConversation(prev => [...prev, newMessage])
    
    // Simulate entity extraction and summary
    if (role === 'user') {
      setTimeout(() => {
        simulateEntityExtraction(text)
        simulateSummaryGeneration()
      }, 500)
    }
  }

  const simulateEntityExtraction = (text: string) => {
    const entities: any = {}
    
    if (text.includes('حي الملقا')) entities.neighborhood = 'حي الملقا'
    if (text.includes('حي القيروان')) entities.neighborhood = 'حي القيروان'
    if (text.includes('حي حطين')) entities.neighborhood = 'حي حطين'
    
    if (text.includes('شقة')) entities.propertyType = 'شقة'
    if (text.includes('فيلا')) entities.propertyType = 'فيلا'
    
    if (text.includes('غرفتين')) entities.bedrooms = 2
    if (text.includes('3 غرف')) entities.bedrooms = 3
    if (text.includes('4 غرف')) entities.bedrooms = 4
    
    if (text.includes('كهرباء')) entities.issue = 'كهرباء'
    if (text.includes('سباكة')) entities.issue = 'سباكة'
    if (text.includes('مفاتيح')) entities.issue = 'مفاتيح'
    
    if (text.includes('10,000') || text.includes('10000')) entities.budget = 10000
    if (text.includes('12,000') || text.includes('12000')) entities.budget = 12000
    if (text.includes('15,000') || text.includes('15000')) entities.budget = 15000
    
    setExtractedEntities(entities)
  }

  const simulateSummaryGeneration = () => {
    const summaries = [
      'عميل يبحث عن شقة في حي الملقا بميزانية 12,000 ريال شهرياً',
      'عميل يعاني من مشكلة في الكهرباء ويحتاج إلى فتح تذكرة صيانة',
      'عميلة تبحث عن شقة بغرفتين نوم مفروشة في حي حطين',
      'عميل مهتم بتجديد العقد الحالي'
    ]
    
    setSummary(summaries[Math.floor(Math.random() * summaries.length)])
  }

  const sendMessage = () => {
    if (message.trim()) {
      addMessage('user', message)
      setMessage('')
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          'شكراً لك على هذا السؤال. دعني أساعدك في ذلك.',
          'ممتاز! هذا ما أحتاجه لمساعدتك بشكل أفضل.',
          'أفهم طلبك. سأقوم بمعالجته الآن.',
          'هذا رائع! هل تود أن أعرض عليك خيارات إضافية؟'
        ]
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        addMessage('agent', randomResponse)
      }, 1000)
    }
  }

  const clearConversation = () => {
    setConversation([])
    setExtractedEntities({})
    setSummary('')
  }

  const createBooking = () => {
    // Simulate creating a booking
    alert('تم إنشاء الحجز بنجاح!')
  }

  const createTicket = () => {
    // Simulate creating a ticket
    alert('تم فتح التذكرة بنجاح!')
  }

  const sendWhatsApp = () => {
    // Simulate sending WhatsApp
    alert('تم إرسال رسالة الواتساب!')
  }

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            ساحة تجربة الوكيل
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            اختبر المساعد الصوتي الذكي مع شخصيات مختلفة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Mode and Persona Selection */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                اختر نوع التفاعل
              </h3>
              <div className="space-y-3">
                {[
                  {
                    id: 'voice',
                    name: 'المحادثة الصوتية',
                    description: 'تحدث مباشرة مع الوكيل الذكي',
                    icon: '🎤',
                  },
                  {
                    id: 'chat',
                    name: 'المحادثة النصية',
                    description: 'تحدث عبر الرسائل النصية',
                    icon: '💬',
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id as 'voice' | 'chat')}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      selectedMode === mode.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span className="text-2xl">{mode.icon}</span>
                      <div className="text-right">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {mode.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {mode.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Persona Selection */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                اختر الوكيل الذكي
              </h3>
              <div className="space-y-3">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      setSelectedPersona(persona.id as any)
                      if (selectedMode === 'chat') {
                        switchChatAgent()
                      }
                    }}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                      selectedPersona === persona.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span className="text-2xl">{persona.icon}</span>
                      <div className="text-right">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {persona.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {persona.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Controls - Only show when voice mode is selected */}
            {selectedMode === 'voice' && (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  التحكم الصوتي
                </h3>
                
                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {/* Status Display */}
                <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'connected' ? 'bg-green-500' :
                      status === 'connecting' ? 'bg-yellow-500' :
                      status === 'error' ? 'bg-red-500' :
                      'bg-slate-400'
                    }`} />
                    <span className="text-slate-700 dark:text-slate-300">
                      {status === 'idle' && 'غير متصل'}
                      {status === 'connecting' && 'جاري الاتصال...'}
                      {status === 'connected' && 'متصل'}
                      {status === 'listening' && 'استماع...'}
                      {status === 'speaking' && 'جاري الرد...'}
                      {status === 'error' && 'خطأ في الاتصال'}
                    </span>
                    {currentSession && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        • {currentSession.agent_type === 'support' ? 'دعم العملاء' : 'المبيعات'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Voice Agent Connection */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {isConnected ? 'قطع الاتصال' : 'بدء المحادثة'}
                    </span>
                    <button
                      onClick={handleStartVoiceAgent}
                      disabled={status === 'connecting'}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isConnected 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status === 'connecting' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isConnected ? (
                        <Phone className="w-5 h-5 rotate-45" />
                      ) : (
                        <Phone className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Microphone Control */}
                  {isConnected && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {isListening ? 'إيقاف الاستماع' : 'بدء الاستماع'}
                      </span>
                      <button
                        onClick={handleMicrophoneToggle}
                        disabled={!isConnected || isSpeaking}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isListening 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    </div>
                  )}

                  {/* Live Transcript */}
                  {transcript && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300 text-right">
                        {transcript}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">التشغيل</span>
                    <button
                      onClick={() => {/* Handle audio playback */}}
                      disabled={!isConnected}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isSpeaking 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">مستوى الصوت</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <VolumeX className="w-4 h-4 text-slate-400" />
                      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div className="w-3/4 h-2 bg-primary rounded-full"></div>
                      </div>
                      <Volume2 className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Widget - Only show when chat mode is selected */}
            {selectedMode === 'chat' && (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  المحادثة النصية
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      الوكيل النشط
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedPersona === 'support' ? '🛠️ دعم العملاء' : '💰 المبيعات'}
                    </span>
                  </div>
                  
                  <button
                    onClick={loadChatWidget}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {chatWidgetLoaded ? 'إعادة تحميل المحادثة' : 'بدء المحادثة النصية'}
                  </button>
                  
                  <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    سيتم تحميل واجهة المحادثة من ElevenLabs
                  </div>
                  
                  {/* Chat Widget Container */}
                  <div id="chat-widget-container" className="min-h-[300px] border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                    {!chatWidgetLoaded && (
                      <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                        اضغط على "بدء المحادثة النصية" لتحميل الوكيل
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                إجراءات سريعة
              </h3>
              <div className="space-y-3">
                <button
                  onClick={createBooking}
                  className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200"
                >
                  <Calendar className="w-4 h-4" />
                  <span>إنشاء حجز</span>
                </button>
                
                <button
                  onClick={createTicket}
                  className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 bg-warning text-white rounded-xl hover:bg-warning/90 transition-all duration-200"
                >
                  <Home className="w-4 h-4" />
                  <span>فتح تذكرة</span>
                </button>
                
                <button
                  onClick={sendWhatsApp}
                  className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 bg-info text-white rounded-xl hover:bg-info/90 transition-all duration-200"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>إرسال واتساب</span>
                </button>
              </div>
            </div>
          </div>

          {/* Center Panel - Conversation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode indicator and description */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-slate-700/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {selectedMode === 'voice' ? '🎤' : '💬'}
                  </span>
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedMode === 'voice' ? 'المحادثة الصوتية' : 'المحادثة النصية'}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedPersona === 'support' ? '🛠️ دعم العملاء' : '💰 المبيعات'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedMode === 'voice' ? 'صوت' : 'نص'} • {selectedPersona === 'support' ? 'دعم' : 'مبيعات'}
                </div>
              </div>
            </div>

            {/* Conversation Area - Only show for voice mode */}
            {selectedMode === 'voice' && (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    المحادثة الصوتية
                  </h3>
                  <button
                    onClick={clearConversation}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    مسح المحادثة
                  </button>
                </div>

              {/* Messages */}
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {conversation.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                    <p>ابدأ المحادثة بالضغط على زر التسجيل أو كتابة رسالة</p>
                  </div>
                ) : (
                  conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2 space-x-reverse mb-1">
                          {msg.role === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                          <span className="text-xs opacity-75">
                            {msg.role === 'user' ? 'أنت' : 'المساعد'}
                          </span>
                        </div>
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs opacity-75 mt-1 block">
                          {msg.timestamp.toLocaleTimeString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 p-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={sendMessage}
                  className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            )}

            {/* Chat Mode Instructions - Only show when chat mode is selected */}
            {selectedMode === 'chat' && (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <div className="text-center space-y-4">
                  <div className="text-6xl">💬</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    المحادثة النصية مع {selectedPersona === 'support' ? 'دعم العملاء' : 'وكيل المبيعات'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    استخدم اللوحة الجانبية لبدء محادثة نصية مباشرة مع وكيل ElevenLabs الذكي. 
                    الوكيل مدرب للتعامل مع {selectedPersona === 'support' ? 'استفسارات الدعم الفني ومشاكل العقارات' : 'استفسارات المبيعات والعقارات المتاحة'}.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>متاح 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>ذكي اصطناعي</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>يدعم العربية</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Analysis - Only show for voice mode */}
            {selectedMode === 'voice' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Summary */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  ملخص المحادثة
                </h3>
                {summary ? (
                  <p className="text-slate-600 dark:text-slate-400">{summary}</p>
                ) : (
                  <p className="text-slate-400 text-sm">سيظهر الملخص هنا بعد بدء المحادثة</p>
                )}
              </div>

              {/* Extracted Entities */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  الكيانات المستخرجة
                </h3>
                {Object.keys(extractedEntities).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(extractedEntities).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{key}</span>
                        <span className="text-sm text-slate-900 dark:text-slate-100">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">ستظهر الكيانات هنا بعد بدء المحادثة</p>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 