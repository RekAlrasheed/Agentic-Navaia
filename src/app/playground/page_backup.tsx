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

  const addMessage = (role: 'user' | 'agent', text: string) => {
    const newMessage = {
      role,
      text,
      timestamp: new Date()
    }
    setConversation(prev => [...prev, newMessage])
    
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
    alert('تم إنشاء الحجز بنجاح!')
  }

  const createTicket = () => {
    alert('تم فتح التذكرة بنجاح!')
  }

  const sendWhatsApp = () => {
    alert('تم إرسال رسالة الواتساب!')
  }

  const loadChatWidget = () => {
    const agentId = selectedPersona === 'support' ? 
      process.env.NEXT_PUBLIC_ELEVENLABS_SUPPORT_AGENT_ID : 
      process.env.NEXT_PUBLIC_ELEVENLABS_SALES_AGENT_ID

    if (!agentId) {
      setError('Agent ID not found')
      return
    }

    // Clear any existing widget
    const existingWidget = document.getElementById('elevenlabs-chat-widget')
    if (existingWidget) {
      existingWidget.remove()
    }

    // Create new script element
    const script = document.createElement('script')
    script.src = 'https://elevenlabs.io/convai-widget/index.js'
    script.id = 'elevenlabs-chat-widget'
    script.onload = () => {
      // Initialize the widget after script loads
      if (window.ElevenLabsConvAI) {
        window.ElevenLabsConvAI.init({
          agentId: agentId,
          onConnect: () => {
            console.log('ElevenLabs chat connected')
            setChatWidgetLoaded(true)
          },
          onDisconnect: () => {
            console.log('ElevenLabs chat disconnected')
          },
          onMessage: (message) => {
            console.log('ElevenLabs message:', message)
          },
          onError: (error) => {
            console.error('ElevenLabs chat error:', error)
            setError('Chat connection failed')
          }
        })
      }
    }
    
    document.head.appendChild(script)
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
                    description: 'اكتب رسائل مع الوكيل الذكي',
                    icon: '💬',
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id as 'voice' | 'chat')}
                    className={`w-full p-4 rounded-xl text-right transition-all duration-200 ${
                      selectedMode === mode.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mode.icon}</span>
                      <div>
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-sm opacity-80">{mode.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Persona Selection */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                اختر شخصية الوكيل
              </h3>
              <div className="space-y-3">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      setSelectedPersona(persona.id as 'support' | 'sales')
                      if (chatWidgetLoaded) {
                        setChatWidgetLoaded(false)
                      }
                    }}
                    className={`w-full p-4 rounded-xl text-right transition-all duration-200 ${
                      selectedPersona === persona.id
                        ? `bg-gradient-to-r ${persona.color} text-white shadow-lg`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{persona.icon}</span>
                      <div>
                        <div className="font-medium">{persona.name}</div>
                        <div className="text-sm opacity-80">{persona.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Panel - Voice/Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 h-full">
              {selectedMode === 'voice' ? (
                <div className="space-y-6">
                  {/* Voice Controls */}
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      المحادثة الصوتية
                    </h3>
                    
                    {/* Connection Status */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                      isConnected ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
                      }`} />
                      {isConnected ? 'متصل' : 'غير متصل'}
                    </div>

                    {/* Voice Connection Button */}
                    <div className="flex flex-col items-center gap-4">
                      <button
                        onClick={handleStartVoiceAgent}
                        disabled={status === 'connecting'}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isConnected 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        } ${status === 'connecting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {status === 'connecting' ? (
                          <Loader2 className="w-8 h-8 animate-spin" />
                        ) : isConnected ? (
                          <Phone className="w-8 h-8" />
                        ) : (
                          <Phone className="w-8 h-8" />
                        )}
                      </button>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {isConnected ? 'اضغط لإنهاء المكالمة' : 'اضغط للاتصال'}
                      </span>
                    </div>

                    {/* Microphone Controls */}
                    {isConnected && (
                      <div className="flex flex-col items-center gap-2 mt-6">
                        <button
                          onClick={handleMicrophoneToggle}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isListening 
                              ? 'bg-red-500 text-white animate-pulse' 
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                        </button>
                        <span className="text-xs text-slate-500">
                          {isListening ? 'يتم التسجيل...' : 'اضغط للتحدث'}
                        </span>
                      </div>
                    )}

                    {/* Speaking Indicator */}
                    {isSpeaking && (
                      <div className="flex items-center gap-2 justify-center">
                        <Volume2 className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-blue-600">الوكيل يتحدث...</span>
                      </div>
                    )}

                    {/* Voice Transcript */}
                    {transcript && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          "{transcript}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Chat Interface */}
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      المحادثة النصية
                    </h3>
                    
                    {!chatWidgetLoaded ? (
                      <button
                        onClick={loadChatWidget}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        بدء المحادثة النصية
                      </button>
                    ) : (
                      <div className="h-96 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div id="elevenlabs-convai-widget-container" className="w-full h-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={createBooking}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl transition-colors flex items-center gap-3"
          >
            <Calendar className="w-6 h-6" />
            إنشاء حجز
          </button>
          <button
            onClick={createTicket}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl transition-colors flex items-center gap-3"
          >
            <AlertCircle className="w-6 h-6" />
            فتح تذكرة
          </button>
          <button
            onClick={sendWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-colors flex items-center gap-3"
          >
            <MessageSquare className="w-6 h-6" />
            إرسال واتساب
          </button>
        </div>

        {/* Conversation History */}
        {conversation.length > 0 && (
          <div className="mt-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                سجل المحادثة
              </h3>
              <button
                onClick={clearConversation}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                مسح السجل
              </button>
            </div>

            {/* Messages */}
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
