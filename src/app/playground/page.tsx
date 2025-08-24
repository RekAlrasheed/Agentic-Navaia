'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Bot, 
  Phone, 
  MessageSquare, 
  Mic, 
  MicOff,
  Send,
  User,
  Settings,
  Volume2,
  VolumeX,
  Zap,
  Calendar,
  Loader2,
  AlertCircle,
  Headphones,
  Activity,
  PhoneOff,
  Wifi,
  WifiOff,
  Battery,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react'
import { useVoiceAgent } from '@/hooks/useVoiceAgent'

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
  audioUrl?: string
}

const agentTypes = [
  { 
    id: 'support', 
    name: 'دعم العملاء', 
    description: 'مساعد خدمة العملاء',
    color: 'from-blue-500 to-purple-600',
    icon: User
  },
  { 
    id: 'sales', 
    name: 'المبيعات', 
    description: 'مساعد المبيعات والتسويق',
    color: 'from-green-500 to-emerald-600', 
    icon: Zap
  }
]

export default function PlaygroundPage() {
  // States
  const [mode, setMode] = useState<'voice' | 'chat'>('voice')
  const [selectedAgent, setSelectedAgent] = useState(agentTypes[0])
  const [isMuted, setIsMuted] = useState(false)
  const [currentInput, setCurrentInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: 'مرحباً! أنا مساعدك الصوتي الذكي. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ])
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  // Initialize voice agent
  const {
    startVoiceSession,
    stopVoiceSession,
    isConnected: voiceConnected,
    isListening,
    isSpeaking,
    status
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

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      if (width < 768) setDeviceType('mobile')
      else if (width < 1024) setDeviceType('tablet')
      else setDeviceType('desktop')
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handlers
  const handleStartVoiceAgent = async () => {
    if (voiceConnected) {
      await stopVoiceSession()
    } else {
      await startVoiceSession(selectedAgent.id as 'support' | 'sales')
    }
  }

  const handleEndCall = async () => {
    try {
      await stopVoiceSession()
      // Add a brief success message
      setError(null)
    } catch (error: any) {
      setError('فشل في إنهاء المكالمة: ' + (error.message || 'خطأ غير معروف'))
    }
  }

  const addMessage = (role: 'user' | 'agent', text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: role,
      content: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = () => {
    if (!currentInput.trim()) return

    addMessage('user', currentInput)
    setCurrentInput('')

    // Simulate agent response
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

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return Smartphone
      case 'tablet': return Tablet
      default: return Monitor
    }
  }

  const DeviceIcon = getDeviceIcon()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-3 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Status Bar */}
        <div className="lg:hidden mb-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`w-3 h-3 rounded-full ${voiceConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {voiceConnected ? 'متصل' : 'غير متصل'}
              </span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <DeviceIcon className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500 capitalize">{deviceType}</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              {voiceConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <Battery className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            ساحة التجربة
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
            اختبر قدرات المساعد الصوتي الذكي بالذكاء الاصطناعي
          </p>
        </div>

        {/* Mobile Mode Switcher */}
        <div className="lg:hidden mb-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-700/20 shadow-lg">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('voice')}
                className={`flex items-center justify-center gap-3 p-4 rounded-xl font-medium transition-all duration-300 active:scale-95 touch-manipulation ${
                  mode === 'voice'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <Headphones className="w-5 h-5" />
                <span className="text-sm">صوتية</span>
              </button>
              <button
                onClick={() => setMode('chat')}
                className={`flex items-center justify-center gap-3 p-4 rounded-xl font-medium transition-all duration-300 active:scale-95 touch-manipulation ${
                  mode === 'chat'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">نصية</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Agent Switcher */}
        <div className="lg:hidden mb-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-700/20 shadow-lg">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              اختر نوع المساعد
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {agentTypes.map((agent) => {
                const IconComponent = agent.icon
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`flex items-center space-x-3 space-x-reverse p-4 rounded-xl transition-all duration-300 active:scale-95 touch-manipulation ${
                      selectedAgent.id === agent.id
                        ? `bg-gradient-to-r ${agent.color} text-white shadow-lg`
                        : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedAgent.id === agent.id
                        ? 'bg-white/20'
                        : 'bg-gray-100 dark:bg-slate-700'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="font-medium text-sm">{agent.name}</div>
                      <div className={`text-xs ${
                        selectedAgent.id === agent.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {agent.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Sidebar - Hidden on Mobile */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Mode Selector */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                نوع المحادثة
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setMode('voice')}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-4 rounded-xl transition-all duration-300 ${
                    mode === 'voice'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Headphones className="w-5 h-5" />
                  <span className="font-medium">المحادثة الصوتية</span>
                </button>
                <button
                  onClick={() => setMode('chat')}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-4 rounded-xl transition-all duration-300 ${
                    mode === 'chat'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                      : 'border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">المحادثة النصية</span>
                </button>
              </div>
            </div>

            {/* Agent Selector */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                نوع المساعد
              </h3>
              <div className="space-y-3">
                {agentTypes.map((agent) => {
                  const IconComponent = agent.icon
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className={`w-full flex items-center space-x-3 space-x-reverse p-4 rounded-xl transition-all duration-300 ${
                        selectedAgent.id === agent.id
                          ? `bg-gradient-to-r ${agent.color} text-white shadow-lg`
                          : 'border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedAgent.id === agent.id
                          ? 'bg-white/20'
                          : 'bg-gray-100 dark:bg-slate-700'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="font-medium">{agent.name}</div>
                        <div className={`text-sm ${
                          selectedAgent.id === agent.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {agent.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Connection Status */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                حالة الاتصال
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`w-3 h-3 rounded-full ${voiceConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {voiceConnected ? 'متصل بالخادم' : 'غير متصل'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Bot className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    AI جاهز للعمل
                  </span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <DeviceIcon className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                    {deviceType} Device
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Interface */}
          <div className="lg:col-span-3">
            {mode === 'voice' ? (
              // Voice Interface
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-slate-700/20 shadow-lg min-h-[500px] sm:min-h-[600px] flex flex-col">
                <div className="text-center mb-6 sm:mb-8">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 rounded-full bg-gradient-to-r ${selectedAgent.color} flex items-center justify-center shadow-lg`}>
                    <selectedAgent.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {selectedAgent.name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                    {selectedAgent.description}
                  </p>
                </div>

                {/* Voice Controls */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 lg:space-y-8">
                  <div className="relative">
                    <button
                      onClick={handleStartVoiceAgent}
                      disabled={status === 'connecting'}
                      className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-2xl transition-all duration-300 active:scale-90 focus:outline-none focus:ring-4 focus:ring-blue-500/30 touch-manipulation ${
                        voiceConnected
                          ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                          : status === 'connecting'
                            ? 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      }`}
                    >
                      {status === 'connecting' ? (
                        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-spin" />
                      ) : voiceConnected ? (
                        <PhoneOff className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                      ) : (
                        <Phone className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                      )}
                    </button>
                    
                    {voiceConnected && (
                      <div className="absolute -inset-4 border-2 border-red-500 rounded-full animate-ping" />
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300">
                      {status === 'connecting' ? 'جاري الاتصال...' :
                       voiceConnected ? 'المكالمة نشطة - انقر الزر الأحمر أدناه لإنهاء المكالمة' : 'انقر لبدء المكالمة'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {voiceConnected ? 'يمكنك التحدث الآن أو استخدام الأزرار أدناه للتحكم' : 'تأكد من تشغيل الميكروفون'}
                    </p>
                  </div>

                  {/* Voice Status Indicators */}
                  {voiceConnected && (
                    <div className="space-y-4 w-full max-w-md">
                      {isListening && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/30 rounded-2xl border border-red-200 dark:border-red-700">
                          <Mic className="w-6 h-6 text-red-500 animate-pulse" />
                          <div className="text-red-700 dark:text-red-300">
                            <p className="font-medium">يتم الاستماع</p>
                            <p className="text-sm opacity-75">تحدث الآن</p>
                          </div>
                        </div>
                      )}

                      {isSpeaking && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                          <Volume2 className="w-6 h-6 text-blue-500 animate-bounce" />
                          <div className="text-blue-700 dark:text-blue-300">
                            <p className="font-medium">الوكيل يتحدث</p>
                            <p className="text-sm opacity-75">استمع للرد</p>
                          </div>
                        </div>
                      )}

                      {transcript && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                          <div className="flex items-start gap-3">
                            <Mic className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                                يتم التحويل...
                              </p>
                              <p className="text-blue-800 dark:text-blue-200 leading-relaxed text-sm">
                                "{transcript}"
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Voice Action Buttons */}
                  {voiceConnected ? (
                    // Connected Call Controls
                    <div className="space-y-4 w-full max-w-lg">
                      {/* End Call Button - Prominent */}
                      <button
                        onClick={handleEndCall}
                        className="w-full p-4 rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation flex items-center justify-center gap-3"
                      >
                        <PhoneOff className="w-6 h-6" />
                        <span className="font-medium text-lg">إنهاء المكالمة</span>
                      </button>
                      
                      {/* Call Control Actions */}
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className={`p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation ${
                            isMuted 
                              ? 'bg-gradient-to-br from-red-400 to-red-500 text-white' 
                              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          }`}
                        >
                          {isMuted ? <VolumeX className="w-5 h-5 mx-auto" /> : <Volume2 className="w-5 h-5 mx-auto" />}
                          <span className="block text-xs mt-2">{isMuted ? 'إلغاء كتم' : 'كتم'}</span>
                        </button>

                        <button className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation">
                          <Settings className="w-5 h-5 mx-auto" />
                          <span className="block text-xs mt-2">إعدادات</span>
                        </button>

                        <button className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation">
                          <Activity className="w-5 h-5 mx-auto" />
                          <span className="block text-xs mt-2">تحليل</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Disconnected Default Actions
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-lg">
                      <button className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation">
                        <Calendar className="w-5 h-5 mx-auto" />
                        <span className="block text-xs mt-2">حجز</span>
                      </button>

                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5 mx-auto" /> : <Volume2 className="w-5 h-5 mx-auto" />}
                        <span className="block text-xs mt-2">{isMuted ? 'صوت' : 'كتم'}</span>
                      </button>

                      <button className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation">
                        <Settings className="w-5 h-5 mx-auto" />
                        <span className="block text-xs mt-2">إعدادات</span>
                      </button>

                      <button className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white transition-all duration-300 hover:shadow-lg active:scale-95 touch-manipulation">
                        <Activity className="w-5 h-5 mx-auto" />
                        <span className="block text-xs mt-2">تحليل</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Chat Interface
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-lg h-[500px] sm:h-[600px] lg:h-[700px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 sm:p-6 border-b border-white/20 dark:border-slate-700/20">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${selectedAgent.color} flex items-center justify-center shadow-lg`}>
                      <selectedAgent.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {selectedAgent.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        متصل الآن
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-600 dark:text-green-400">نشط</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] p-3 sm:p-4 rounded-2xl shadow-md ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white ml-2'
                            : 'bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-white mr-2'
                        }`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString('ar-SA', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 sm:p-6 border-t border-white/20 dark:border-slate-700/20">
                  <div className="flex space-x-3 space-x-reverse">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اكتب رسالتك هنا..."
                      className="flex-1 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 touch-manipulation"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 sm:px-6 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-medium">حدث خطأ</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
