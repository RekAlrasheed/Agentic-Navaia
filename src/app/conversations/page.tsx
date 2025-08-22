'use client'

import { useState } from 'react'
import { 
  Phone, 
  MessageSquare, 
  Search, 
  Filter,
  Play,
  Pause,
  MoreVertical,
  User,
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  Home,
  Plus,
  Send,
  FileText
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function ConversationsPage() {
  const [activeTab, setActiveTab] = useState<'calls' | 'messages' | 'all'>('all')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { conversations, customers, setSelectedConversation } = useAppStore()

  const tabs = [
    { id: 'calls', label: 'المكالمات', icon: Phone, count: conversations.filter(c => c.type === 'صوت').length },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare, count: conversations.filter(c => c.type === 'رسالة').length },
    { id: 'all', label: 'الكل', icon: FileText, count: conversations.length }
  ]

  const filteredConversations = conversations.filter(conversation => {
    if (activeTab === 'calls' && conversation.type !== 'صوت') return false
    if (activeTab === 'messages' && conversation.type !== 'رسالة') return false
    
    if (searchQuery) {
      const customer = customers.find(c => c.id === conversation.customerId)
      return customer?.name.includes(searchQuery) || 
             customer?.phone.includes(searchQuery) ||
             conversation.summary.includes(searchQuery)
    }
    
    return true
  })

  const getCustomerById = (id: string) => customers.find(c => c.id === id)
  const getConversationById = (id: string) => conversations.find(c => c.id === id)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مفتوحة': return <Clock className="w-4 h-4 text-blue-500" />
      case 'مغلقة': return <CheckCircle className="w-4 h-4 text-success" />
      case 'محولة_للبشر': return <AlertCircle className="w-4 h-4 text-warning" />
      default: return <Clock className="w-4 h-4 text-slate-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مفتوحة': return 'text-blue-500'
      case 'مغلقة': return 'text-success'
      case 'محولة_للبشر': return 'text-warning'
      default: return 'text-slate-500'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'صوت' ? <Phone className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'إيجابي': return 'text-success'
      case 'سلبي': return 'text-destructive'
      default: return 'text-slate-500'
    }
  }

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            المحادثات
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            إدارة المكالمات والرسائل مع العملاء
          </p>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-2 mb-6 border border-white/20 dark:border-slate-700/20">
              <div className="flex space-x-1 space-x-reverse">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className="bg-white/20 dark:bg-slate-800/20 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="البحث في المحادثات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button className="flex items-center space-x-2 space-x-reverse px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-all duration-200">
                <Filter className="w-4 h-4" />
                <span>فلترة</span>
              </button>
            </div>

            {/* Conversations List */}
            <div className="space-y-3">
              {filteredConversations.map((conversation) => {
                const customer = getCustomerById(conversation.customerId)
                if (!customer) return null

                return (
                  <div
                    key={conversation.id}
                                         onClick={() => setSelectedConversationId(conversation.id)}
                     className={`p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                       selectedConversationId === conversation.id ? 'ring-2 ring-primary/50' : ''
                     }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center">
                          {getTypeIcon(conversation.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {customer.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {customer.phone}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            {getStatusIcon(conversation.status)}
                            <span className={`text-sm font-medium ${getStatusColor(conversation.status)}`}>
                              {conversation.status === 'محولة_للبشر' ? 'محولة للبشر' : conversation.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(conversation.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(conversation.sentiment)} bg-opacity-10`}>
                            {conversation.sentiment}
                          </span>
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {conversation.summary}
                      </p>
                    </div>

                    {/* Entities */}
                    {Object.keys(conversation.entities).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(conversation.entities).map(([key, value]) => (
                          <span key={key} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Sidebar - Conversation Detail */}
          {selectedConversationId && (
            <div className="w-96 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl p-6 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">تفاصيل المحادثة</h3>
                <button
                  onClick={() => setSelectedConversationId(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  ×
                </button>
              </div>

              {(() => {
                const conversation = getConversationById(selectedConversationId)
                const customer = conversation ? getCustomerById(conversation.customerId) : null
                
                if (!conversation || !customer) return null

                return (
                  <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="flex items-center space-x-3 space-x-reverse mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">{customer.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{customer.phone}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">تاريخ المحادثة</span>
                        </div>
                        <div className="text-slate-900 dark:text-slate-100">
                          {new Date(conversation.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">الحي المفضل</span>
                        </div>
                        <div className="text-slate-900 dark:text-slate-100">
                          {customer.neighborhoods[0]}
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">الميزانية</span>
                        </div>
                        <div className="text-slate-900 dark:text-slate-100">
                          {customer.budget?.toLocaleString()} ر.س
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">ملخص المحادثة</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                        {conversation.summary}
                      </p>
                    </div>

                    {/* Transcript */}
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">نص المحادثة</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {conversation.transcript.map((message, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-right'
                                : 'bg-slate-50 dark:bg-slate-800/50 text-right'
                            }`}
                          >
                            <div className="flex items-center space-x-2 space-x-reverse mb-1">
                              {message.role === 'user' ? (
                                <User className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Bot className="w-4 h-4 text-primary" />
                              )}
                              <span className="text-xs font-medium text-slate-500">
                                {message.role === 'user' ? 'العميل' : 'المساعد'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{message.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200">
                        <Plus className="w-4 h-4" />
                        <span>إنشاء حجز</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 bg-warning text-white rounded-xl hover:bg-warning/90 transition-all duration-200">
                        <FileText className="w-4 h-4" />
                        <span>فتح تذكرة</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 bg-info text-white rounded-xl hover:bg-info/90 transition-all duration-200">
                        <Send className="w-4 h-4" />
                        <span>إرسال واتساب</span>
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 