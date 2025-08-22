import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body
    
    // محاكاة كشف النوايا
    const intents = [
      {
        intent: 'استعلام_توافر',
        confidence: 0.95,
        entities: [
          { type: 'property_type', value: 'شقة', confidence: 0.9 },
          { type: 'location', value: 'الرياض', confidence: 0.85 }
        ]
      },
      {
        intent: 'تذكرة_صيانة',
        confidence: 0.8,
        entities: [
          { type: 'issue_type', value: 'مشكلة كهربائية', confidence: 0.75 }
        ]
      },
      {
        intent: 'حجز_زيارة',
        confidence: 0.7,
        entities: [
          { type: 'date', value: 'غداً', confidence: 0.8 },
          { type: 'time', value: '2:00 م', confidence: 0.7 }
        ]
      }
    ]
    
    // اختيار النية الأكثر احتمالاً
    const detectedIntent = intents[0]
    
    return NextResponse.json({
      detectedIntent,
      alternatives: intents.slice(1),
      processingTime: Math.random() * 100 + 50
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'خطأ في معالجة الطلب' },
      { status: 400 }
    )
  }
} 