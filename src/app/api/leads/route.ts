import { NextResponse } from 'next/server'
import { leads } from '@/app/(dashboard)/dashboard/data/seed-data'

export async function GET() {
  return NextResponse.json(leads)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // إنشاء عميل محتمل جديد
    const newLead = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    // في التطبيق الحقيقي، سيتم حفظ البيانات في قاعدة البيانات
    console.log('تم إنشاء عميل محتمل جديد:', newLead)
    
    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'خطأ في معالجة الطلب' },
      { status: 400 }
    )
  }
} 