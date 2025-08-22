'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Activity,
  Users,
  Phone,
  Clock,
  Star,
  Target,
  DollarSign,
  Calendar,
  Filter,
  Download
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [activeTab, setActiveTab] = useState<'operations' | 'marketing' | 'qa'>('operations')
  
  const { dashboardKPIs, campaigns, conversations, tickets } = useAppStore()

  const periods = [
    { value: '1d', label: 'اليوم' },
    { value: '7d', label: '7 أيام' },
    { value: '30d', label: '30 يوم' },
    { value: '90d', label: '90 يوم' }
  ]

  const tabs = [
    { id: 'operations', label: 'العمليات', icon: Activity },
    { id: 'marketing', label: 'التسويق', icon: Target },
    { id: 'qa', label: 'الجودة والامتثال', icon: Star }
  ]

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-success" />
    } else if (change < 0) {
      return <TrendingUp className="w-4 h-4 text-destructive transform rotate-180" />
    }
    return null
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success'
    if (change < 0) return 'text-destructive'
    return 'text-slate-500'
  }

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
              التحليلات
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              تقارير الأداء والمؤشرات الشاملة
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedPeriod === period.value
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
            
            <button className="flex items-center space-x-2 space-x-reverse px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-all duration-200">
              <Download className="w-4 h-4" />
              <span>تصدير</span>
            </button>
          </div>
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
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Operations Analytics */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stats-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">حجم المكالمات</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {dashboardKPIs.totalCalls.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      {getChangeIcon(12)}
                      <span className={`text-sm font-medium mr-1 ${getChangeColor(12)}`}>
                        +12%
                      </span>
                      <span className="text-xs text-slate-500">من الفترة السابقة</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="stats-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">متوسط وقت المعالجة</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {Math.floor(dashboardKPIs.avgHandleTime / 60)}:{(dashboardKPIs.avgHandleTime % 60).toString().padStart(2, '0')}
                    </p>
                    <div className="flex items-center mt-2">
                      {getChangeIcon(-8)}
                      <span className={`text-sm font-medium mr-1 ${getChangeColor(-8)}`}>
                        -8%
                      </span>
                      <span className="text-xs text-slate-500">من الفترة السابقة</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="stats-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">رضا العملاء</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {dashboardKPIs.csat}/5
                    </p>
                    <div className="flex items-center mt-2">
                      {getChangeIcon(5)}
                      <span className={`text-sm font-medium mr-1 ${getChangeColor(5)}`}>
                        +5%
                      </span>
                      <span className="text-xs text-slate-500">من الفترة السابقة</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="stats-card rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">معدل الإجابة</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {dashboardKPIs.answerRate}%
                    </p>
                    <div className="flex items-center mt-2">
                      {getChangeIcon(3)}
                      <span className={`text-sm font-medium mr-1 ${getChangeColor(3)}`}>
                        +3%
                      </span>
                      <span className="text-xs text-slate-500">من الفترة السابقة</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Call Volume Trend */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">حجم المكالمات عبر الزمن</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p>سيتم إضافة الرسم البياني هنا</p>
                  </div>
                </div>
              </div>

              {/* SLA Performance */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">أداء SLA</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">تذاكر عاجلة</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div className="w-16 h-2 bg-success rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">80%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">تذاكر عالية</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div className="w-14 h-2 bg-warning rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">70%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">تذاكر متوسطة</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div className="w-18 h-2 bg-info rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">90%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Marketing Analytics */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            {/* Campaign Performance */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">أداء الحملات</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="text-right p-3 font-semibold text-slate-900 dark:text-slate-100">الحملة</th>
                      <th className="text-right p-3 font-semibold text-slate-900 dark:text-slate-100">تم الوصول</th>
                      <th className="text-right p-3 font-semibold text-slate-900 dark:text-slate-100">تفاعل</th>
                      <th className="text-right p-3 font-semibold text-slate-900 dark:text-slate-100">حجوزات</th>
                      <th className="text-right p-3 font-semibold text-slate-900 dark:text-slate-100">الإيرادات</th>
                      <th className="text-right p-3 font-semibold text-slate-900 dark:text-slate-100">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="text-lg">{campaign.type === 'صوتية' ? '📞' : '💬'}</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{campaign.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-900 dark:text-slate-100">{campaign.metrics.reached}</td>
                        <td className="p-3 text-slate-900 dark:text-slate-100">{campaign.metrics.engaged}</td>
                        <td className="p-3 text-slate-900 dark:text-slate-100">{campaign.metrics.booked}</td>
                        <td className="p-3 text-slate-900 dark:text-slate-100">{campaign.metrics.revenue.toLocaleString()} ر.س</td>
                        <td className="p-3 text-slate-900 dark:text-slate-100">{campaign.metrics.roas.toFixed(1)}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">تحليل الإيرادات</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">إجمالي الإيرادات</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {dashboardKPIs.revenue.toLocaleString()} ر.س
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">متوسط ROAS</span>
                    <span className="text-lg font-bold text-primary">{dashboardKPIs.roas.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">معدل التحويل</span>
                    <span className="text-lg font-bold text-emerald-600">{dashboardKPIs.conversionToBooking}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">مصادر العملاء</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">المساعد الصوتي</span>
                    <span className="text-lg font-bold text-primary">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">الواتساب</span>
                    <span className="text-lg font-bold text-success">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">الويب</span>
                    <span className="text-lg font-bold text-info">10%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">إحالات</span>
                    <span className="text-lg font-bold text-warning">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QA & Compliance Analytics */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* Quality Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stats-card rounded-2xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">4.4/5</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">متوسط رضا العملاء</div>
                  <div className="flex items-center justify-center mt-2">
                    {getChangeIcon(5)}
                    <span className="text-sm text-success mr-1">+5%</span>
                  </div>
                </div>
              </div>

              <div className="stats-card rounded-2xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">98.5%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">دقة الكشف عن النوايا</div>
                  <div className="flex items-center justify-center mt-2">
                    {getChangeIcon(2)}
                    <span className="text-sm text-success mr-1">+2%</span>
                  </div>
                </div>
              </div>

              <div className="stats-card rounded-2xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-info mb-2">95.2%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">معدل الامتثال</div>
                  <div className="flex items-center justify-center mt-2">
                    {getChangeIcon(3)}
                    <span className="text-sm text-success mr-1">+3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">توزيع الدرجات</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">5 نجوم</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div className="w-16 h-2 bg-success rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">80%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">4 نجوم</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div className="w-12 h-2 bg-info rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">15%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">3 نجوم أو أقل</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div className="w-4 h-2 bg-warning rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">5%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">معدلات التحويل للبشر</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">طلب ممثل بشري</span>
                    <span className="text-lg font-bold text-warning">8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">مشكلة معقدة</span>
                    <span className="text-lg font-bold text-info">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">شكوى رسمية</span>
                    <span className="text-lg font-bold text-destructive">3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">أخرى</span>
                    <span className="text-lg font-bold text-slate-600">2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 