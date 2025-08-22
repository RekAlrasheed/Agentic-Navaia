import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import '@/styles/globals.css'
import ThemeToggle from '@/components/ThemeToggle'
import Sidebar from '@/components/Sidebar'

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400','500','700','800'] })

export const metadata: Metadata = {
  title: 'Agentic Navaia - بوابة المساعد الصوتي الذكية',
  description: 'بوابة متكاملة لإدارة المساعد الصوتي بالذكاء الاصطناعي لشركات تأجير العقارات',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.className} bg-background text-foreground`}>
        <div id="__app" className="min-h-screen flex">
          <Sidebar />
          <main className="flex-1 mr-80">
            {children}
          </main>
        </div>
        <ThemeToggle />
      </body>
    </html>
  )
} 