import { NextResponse } from 'next/server'
import { tickets } from '@/app/(dashboard)/dashboard/data/seed-data'

export async function GET() {
  return NextResponse.json(tickets)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // إنشاء تذكرة جديدة
    const newTicket = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    // في التطبيق الحقيقي، سيتم حفظ البيانات في قاعدة البيانات
    console.log('تم إنشاء تذكرة جديدة:', newTicket)
    
    return NextResponse.json(newTicket, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'خطأ في معالجة الطلب' },
      { status: 400 }
    )
  }
} 