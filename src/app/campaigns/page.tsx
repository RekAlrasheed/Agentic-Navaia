'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter,
  Play,
  Pause,
  StopCircle,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  MoreVertical,
  Edit,
  Eye,
  Settings,
  Zap
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const { campaigns, runCampaign, stopCampaign } = useAppStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشطة': return 'bg-success text-white'
      case 'موقوفة': return 'bg-warning text-white'
      case 'مكتملة': return 'bg-info text-white'
      default: return 'bg-slate-500 text-white'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'صوتية' ? '📞' : '💬'
  }

  const getObjectiveColor = (objective: string) => {
    switch (objective) {
      case 'حجوزات': return 'bg-blue-500 text-white'
      case 'تجديدات': return 'bg-emerald-500 text-white'
      case 'ترويج': return 'bg-purple-500 text-white'
      default: return 'bg-slate-500 text-white'
    }
  }

  const getAttributionColor = (attribution: string) => {
    return attribution === 'AI' ? 'bg-primary text-white' : 'bg-slate-600 text-white'
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchQuery) {
      return campaign.name.includes(searchQuery) || 
             campaign.objective.includes(searchQuery) ||
             campaign.type.includes(searchQuery)
    }
    return true
  })

  const handleRunCampaign = (campaignId: string) => {
    runCampaign(campaignId)
  }

  const handleStopCampaign = (campaignId: string) => {
    stopCampaign(campaignId)
  }

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              الحملات التسويقية
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              إدارة الحملات التسويقية وتتبع الأداء
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>حملة جديدة</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="البحث في الحملات..."
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

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => setSelectedCampaign(campaign.id)}
              className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg"
            >
              {/* Campaign Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-2xl">{getTypeIcon(campaign.type)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </div>

              {/* Campaign Info */}
              <div className="space-y-3 mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {campaign.name}
                </h3>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className={`text-xs px-2 py-1 rounded-full ${getObjectiveColor(campaign.objective)}`}>
                    {campaign.objective}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getAttributionColor(campaign.attribution)}`}>
                    {campaign.attribution}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {campaign.audienceQuery}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {campaign.metrics.reached}
                  </div>
                  <div className="text-xs text-slate-500">تم الوصول</div>
                </div>
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {campaign.metrics.booked}
                  </div>
                  <div className="text-xs text-slate-500">حجوزات</div>
                </div>
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-sm font-semibold text-primary">
                    {campaign.metrics.roas.toFixed(1)}x
                  </div>
                  <div className="text-xs text-slate-500">ROAS</div>
                </div>
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-sm font-semibold text-emerald-600">
                    {campaign.metrics.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">ر.س</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {campaign.status === 'نشطة' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStopCampaign(campaign.id)
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-2 bg-warning text-white rounded-lg hover:bg-warning/90 transition-all duration-200"
                  >
                    <Pause className="w-4 h-4" />
                    <span className="text-sm">إيقاف</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRunCampaign(campaign.id)
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-2 bg-success text-white rounded-lg hover:bg-success/90 transition-all duration-200"
                  >
                    <Play className="w-4 h-4" />
                    <span className="text-sm">تشغيل</span>
                  </button>
                )}
                
                <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">عرض</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Campaign Detail Modal */}
        {selectedCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">تفاصيل الحملة</h3>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  ×
                </button>
              </div>

              {(() => {
                const campaign = campaigns.find(c => c.id === selectedCampaign)
                if (!campaign) return null

                return (
                  <div className="space-y-6">
                    {/* Campaign Info */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="flex items-center space-x-4 space-x-reverse mb-4">
                        <span className="text-4xl">{getTypeIcon(campaign.type)}</span>
                        <div>
                          <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{campaign.name}</h4>
                          <div className="flex items-center space-x-2 space-x-reverse mt-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getObjectiveColor(campaign.objective)}`}>
                              {campaign.objective}
                            </span>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getAttributionColor(campaign.attribution)}`}>
                              {campaign.attribution}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="text-slate-600 dark:text-slate-400">نوع الحملة</label>
                          <p className="text-slate-900 dark:text-slate-100">{campaign.type}</p>
                        </div>
                        <div>
                          <label className="text-slate-600 dark:text-slate-400">الجمهور المستهدف</label>
                          <p className="text-slate-900 dark:text-slate-100">{campaign.audienceQuery}</p>
                        </div>
                        <div>
                          <label className="text-slate-600 dark:text-slate-400">تاريخ الإنشاء</label>
                          <p className="text-slate-900 dark:text-slate-100">
                            {new Date(campaign.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        {campaign.scheduledAt && (
                          <div>
                            <label className="text-slate-600 dark:text-slate-400">تاريخ الجدولة</label>
                            <p className="text-slate-900 dark:text-slate-100">
                              {new Date(campaign.scheduledAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metrics Dashboard */}
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">مؤشرات الأداء</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                          <div className="text-2xl font-bold text-blue-600">{campaign.metrics.reached}</div>
                          <div className="text-sm text-blue-600">تم الوصول</div>
                        </div>
                        <div className="p-4 bg-warning/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-warning">{campaign.metrics.engaged}</div>
                          <div className="text-sm text-warning">تفاعل</div>
                        </div>
                        <div className="p-4 bg-info/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-info">{campaign.metrics.qualified}</div>
                          <div className="text-sm text-info">مؤهل</div>
                        </div>
                        <div className="p-4 bg-success/10 rounded-xl text-center">
                          <div className="text-2xl font-bold text-success">{campaign.metrics.booked}</div>
                          <div className="text-sm text-success">حجز</div>
                        </div>
                      </div>
                    </div>

                    {/* Revenue and ROAS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                          {campaign.metrics.revenue.toLocaleString()} ر.س
                        </div>
                        <div className="text-sm text-emerald-600">الإيرادات</div>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-xl text-center">
                        <div className="text-2xl font-bold text-primary">
                          {campaign.metrics.roas.toFixed(1)}x
                        </div>
                        <div className="text-sm text-primary">ROAS</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                      {campaign.status === 'نشطة' ? (
                        <button
                          onClick={() => handleStopCampaign(campaign.id)}
                          className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-3 bg-warning text-white rounded-xl hover:bg-warning/90 transition-all duration-200"
                        >
                          <Pause className="w-4 h-4" />
                          <span>إيقاف الحملة</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRunCampaign(campaign.id)}
                          className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-3 bg-success text-white rounded-xl hover:bg-success/90 transition-all duration-200"
                        >
                          <Play className="w-4 h-4" />
                          <span>تشغيل الحملة</span>
                        </button>
                      )}
                      
                      <button className="flex-1 flex items-center justify-center space-x-2 space-x-reverse p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200">
                        <Settings className="w-4 h-4" />
                        <span>تعديل</span>
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