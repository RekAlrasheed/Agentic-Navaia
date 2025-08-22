import { NextResponse } from 'next/server'
import { bookings } from '@/app/(dashboard)/dashboard/data/seed-data'

export async function GET() {
  return NextResponse.json(bookings)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // إنشاء حجز جديد
    const newBooking = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    // في التطبيق الحقيقي، سيتم حفظ البيانات في قاعدة البيانات
    console.log('تم إنشاء حجز جديد:', newBooking)
    
    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'خطأ في معالجة الطلب' },
      { status: 400 }
    )
  }
} 