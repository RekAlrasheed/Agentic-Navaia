'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Ticket, 
  Calendar, 
  Users, 
  BarChart3, 
  Play, 
  Settings,
  Bot,
  TrendingUp,
  Phone,
  Mail
} from 'lucide-react'

const navigation = [
  {
    name: 'لوحة التحكم',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'نظرة شاملة على الأداء'
  },
  {
    name: 'المحادثات',
    href: '/conversations',
    icon: MessageSquare,
    description: 'إدارة المكالمات والرسائل'
  },
  {
    name: 'التذاكر',
    href: '/tickets',
    icon: Ticket,
    description: 'متابعة الطلبات والدعم'
  },
  {
    name: 'الحجوزات',
    href: '/bookings',
    icon: Calendar,
    description: 'إدارة المواعيد والحجوزات'
  },
  {
    name: 'العملاء',
    href: '/customers',
    icon: Users,
    description: 'قاعدة بيانات العملاء'
  },
  {
    name: 'الحملات',
    href: '/campaigns',
    icon: BarChart3,
    description: 'إدارة الحملات التسويقية'
  },
  {
    name: 'التحليلات',
    href: '/analytics',
    icon: TrendingUp,
    description: 'تقارير الأداء والمؤشرات'
  },
  {
    name: 'ساحة التجربة',
    href: '/playground',
    icon: Play,
    description: 'تجربة المساعد الصوتي'
  },
  {
    name: 'الإعدادات',
    href: '/settings',
    icon: Settings,
    description: 'تخصيص النظام'
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-l border-slate-200/50 dark:border-slate-700/50 z-50">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Agentic Navaia
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              المساعد الصوتي الذكي
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
              }`} />
              <div className="flex-1 text-right">
                <div className="font-medium">{item.name}</div>
                <div className={`text-xs ${
                  isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {item.description}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          إجراءات سريعة
        </h3>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 space-x-reverse p-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200">
            <Phone className="w-4 h-4" />
            <span>مكالمة جديدة</span>
          </button>
          <button className="w-full flex items-center space-x-2 space-x-reverse p-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200">
            <Mail className="w-4 h-4" />
            <span>رسالة جديدة</span>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-2 space-x-reverse text-sm">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-slate-600 dark:text-slate-400">النظام يعمل</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          AI متصل ومتاح
        </div>
      </div>
    </div>
  )
} 