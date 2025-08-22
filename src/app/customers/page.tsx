'use client'

import { useState } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  MoreVertical,
  Edit,
  Eye,
  MessageSquare,
  PhoneCall
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'جديد' | 'مؤهل' | 'حجز' | 'ربح'>('all')
  
  const { customers, conversations, tickets, bookings } = useAppStore()

  const tabs = [
    { id: 'all', label: 'الكل', count: customers.length },
    { id: 'جديد', label: 'جديد', count: customers.filter(c => c.stage === 'جديد').length },
    { id: 'مؤهل', label: 'مؤهل', count: customers.filter(c => c.stage === 'مؤهل').length },
    { id: 'حجز', label: 'حجز', count: customers.filter(c => c.stage === 'حجز').length },
    { id: 'ربح', label: 'ربح', count: customers.filter(c => c.stage === 'ربح').length }
  ]

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'جديد': return 'bg-blue-500 text-white'
      case 'مؤهل': return 'bg-warning text-white'
      case 'حجز': return 'bg-info text-white'
      case 'ربح': return 'bg-success text-white'
      case 'خسارة': return 'bg-destructive text-white'
      default: return 'bg-slate-500 text-white'
    }
  }

  const getCustomerInteractions = (customerId: string) => {
    const customerConversations = conversations.filter(c => c.customerId === customerId)
    const customerTickets = tickets.filter(t => t.customerId === customerId)
    const customerBookings = bookings.filter(b => b.customerId === customerId)
    
    return {
      conversations: customerConversations.length,
      tickets: customerTickets.length,
      bookings: customerBookings.length
    }
  }

  const filteredCustomers = customers.filter(customer => {
    if (activeTab !== 'all' && customer.stage !== activeTab) return false
    
    if (searchQuery) {
      return customer.name.includes(searchQuery) || 
             customer.phone.includes(searchQuery) ||
             customer.email?.includes(searchQuery) ||
             customer.neighborhoods.some(n => n.includes(searchQuery))
    }
    
    return true
  })

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              العملاء
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              إدارة قاعدة بيانات العملاء ومراحل المبيعات
            </p>
          </div>
          
          <button className="flex items-center space-x-2 space-x-reverse px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200">
            <Plus className="w-4 h-4" />
            <span>عميل جديد</span>
          </button>
        </div>

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
              placeholder="البحث في العملاء..."
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

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => {
            const interactions = getCustomerInteractions(customer.id)
            
            return (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomer(customer.id)}
                className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg"
              >
                {/* Customer Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStageColor(customer.stage)}`}>
                    {customer.stage}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="space-y-3 mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {customer.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  
                  {customer.email && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-slate-600 dark:text-slate-400">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.neighborhoods[0]}</span>
                  </div>
                  
                  {customer.budget && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-slate-600 dark:text-slate-400">
                      <DollarSign className="w-4 h-4" />
                      <span>{customer.budget.toLocaleString()} ر.س</span>
                    </div>
                  )}
                </div>

                {/* Interactions */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {interactions.conversations}
                    </div>
                    <div className="text-xs text-slate-500">محادثات</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {interactions.tickets}
                    </div>
                    <div className="text-xs text-slate-500">تذاكر</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {interactions.bookings}
                    </div>
                    <div className="text-xs text-slate-500">حجوزات</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200">
                    <PhoneCall className="w-4 h-4" />
                    <span className="text-sm">اتصال</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-2 bg-info text-white rounded-lg hover:bg-info/90 transition-all duration-200">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">رسالة</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">تفاصيل العميل</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  ×
                </button>
              </div>

              {(() => {
                const customer = customers.find(c => c.id === selectedCustomer)
                if (!customer) return null

                const interactions = getCustomerInteractions(customer.id)
                const customerConversations = conversations.filter(c => c.customerId === customer.id)
                const customerTickets = tickets.filter(t => t.customerId === customer.id)
                const customerBookings = bookings.filter(b => b.customerId === customer.id)

                return (
                  <div className="space-y-6">
                    {/* Customer Profile */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="flex items-center space-x-4 space-x-reverse mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{customer.name}</h4>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStageColor(customer.stage)}`}>
                            {customer.stage}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="text-slate-600 dark:text-slate-400">رقم الهاتف</label>
                          <p className="text-slate-900 dark:text-slate-100">{customer.phone}</p>
                        </div>
                        {customer.email && (
                          <div>
                            <label className="text-slate-600 dark:text-slate-400">البريد الإلكتروني</label>
                            <p className="text-slate-900 dark:text-slate-100">{customer.email}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-slate-600 dark:text-slate-400">الميزانية</label>
                          <p className="text-slate-900 dark:text-slate-100">
                            {customer.budget ? `${customer.budget.toLocaleString()} ر.س` : 'غير محدد'}
                          </p>
                        </div>
                        <div>
                          <label className="text-slate-600 dark:text-slate-400">الأحياء المفضلة</label>
                          <p className="text-slate-900 dark:text-slate-100">{customer.neighborhoods.join(', ')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">الجدول الزمني</h4>
                      <div className="space-y-4">
                        {/* Conversations */}
                        {customerConversations.map((conversation) => (
                          <div key={conversation.id} className="flex items-start space-x-3 space-x-reverse p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-900 dark:text-slate-100">
                                {conversation.type === 'صوت' ? 'مكالمة صوتية' : 'رسالة'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(conversation.createdAt).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Tickets */}
                        {customerTickets.map((ticket) => (
                          <div key={ticket.id} className="flex items-start space-x-3 space-x-reverse p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">🎫</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-900 dark:text-slate-100">
                                تذكرة {ticket.category} - {ticket.priority}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(ticket.createdAt).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Bookings */}
                        {customerBookings.map((booking) => (
                          <div key={booking.id} className="flex items-start space-x-3 space-x-reverse p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">📅</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-900 dark:text-slate-100">
                                حجز جديد - {booking.price.toLocaleString()} ر.س
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(booking.createdAt).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200">
                        <Edit className="w-4 h-4" />
                        <span>تعديل</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200">
                        <Eye className="w-4 h-4" />
                        <span>عرض</span>
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 