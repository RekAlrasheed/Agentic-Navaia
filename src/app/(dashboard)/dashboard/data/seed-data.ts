import { Property, CallRecord, Booking, Ticket, Campaign, Lead, Contact } from '@/app/(shared)/types';

export const properties: Property[] = [
  {
    id: '1',
    code: 'المجيدية - MG13',
    city: 'الرياض',
    neighborhood: 'حي الملقا',
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    furnished: true,
    monthlyPriceSAR: 8500,
    yearlyPriceSAR: 85000,
    images: ['/images/mg13-1.jpg', '/images/mg13-2.jpg'],
    availability: 'متاح'
  },
  {
    id: '2',
    code: 'المجيدية - MG132',
    city: 'الرياض',
    neighborhood: 'حي الملقا',
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    furnished: false,
    monthlyPriceSAR: 12000,
    yearlyPriceSAR: 120000,
    images: ['/images/mg132-1.jpg'],
    availability: 'محجوز'
  },
  {
    id: '3',
    code: 'المجيدية - NF13',
    city: 'الرياض',
    neighborhood: 'حي النرجس',
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    monthlyPriceSAR: 6500,
    yearlyPriceSAR: 65000,
    images: ['/images/nf13-1.jpg'],
    availability: 'متاح'
  },
  {
    id: '4',
    code: 'بيات - WH41',
    city: 'الرياض',
    neighborhood: 'حي حطين',
    rooms: 5,
    bedrooms: 4,
    bathrooms: 3,
    furnished: false,
    monthlyPriceSAR: 18000,
    yearlyPriceSAR: 180000,
    images: ['/images/wh41-1.jpg', '/images/wh41-2.jpg'],
    availability: 'مشغول'
  },
  {
    id: '5',
    code: 'التعاون - TC22',
    city: 'الرياض',
    neighborhood: 'حي التعاون',
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    furnished: true,
    monthlyPriceSAR: 9500,
    yearlyPriceSAR: 95000,
    images: ['/images/tc22-1.jpg'],
    availability: 'متاح'
  }
];

export const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'حملة الإحالات – الربيع',
    objective: 'حجوزات',
    status: 'نشطة',
    budgetSAR: 50000,
    costSAR: 12500,
    calls: 842,
    qualified: 189,
    bookings: 42,
    revenueSAR: 420000,
    roas: 3.36
  },
  {
    id: '2',
    name: 'تجديد العقود – الربع الثالث',
    objective: 'تجديدات',
    status: 'نشطة',
    budgetSAR: 30000,
    costSAR: 8500,
    calls: 456,
    qualified: 134,
    bookings: 28,
    revenueSAR: 280000,
    roas: 3.29
  },
  {
    id: '3',
    name: 'بيع إضافي – الخريف',
    objective: 'بيع_إضافي',
    status: 'نشطة',
    budgetSAR: 25000,
    costSAR: 7200,
    calls: 312,
    qualified: 89,
    bookings: 15,
    revenueSAR: 150000,
    roas: 2.08
  }
];

export const callRecords: CallRecord[] = [
  {
    id: '1',
    direction: 'وارد',
    persona: 'دعم',
    transcript: [
      { role: 'user', text: 'أهلاً، عندي مشكلة في الكهرباء في الشقة', ts: Date.now() - 300000 },
      { role: 'agent', text: 'أهلاً وسهلاً، أهلاً بك في خدمة العملاء. ممكن أعرف رقم الشقة؟', ts: Date.now() - 280000 },
      { role: 'user', text: 'المجيدية MG13', ts: Date.now() - 260000 },
      { role: 'agent', text: 'شكراً لك. سأقوم بفتح تذكرة صيانة للكهرباء في شقة المجيدية MG13. هل المشكلة عاجلة؟', ts: Date.now() - 240000 }
    ],
    detectedIntent: 'تذكرة_صيانة',
    entities: {
      city: 'الرياض',
      neighborhood: 'حي الملقا'
    },
    actions: [
      {
        type: 'RAISE_TICKET',
        payload: { category: 'كهرباء', priority: 'متوسط' },
        createdAt: new Date().toISOString()
      }
    ],
    outcome: 'تذكرة',
    handleTimeSec: 180,
    sentiment: 'محايد',
    csat: 4,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    direction: 'صادر',
    persona: 'مبيعات',
    campaignId: '1',
    transcript: [
      { role: 'agent', text: 'أهلاً وسهلاً، أهلاً بك في NAVAIA. هل تبحث عن شقة للإيجار؟', ts: Date.now() - 600000 },
      { role: 'user', text: 'نعم، أبحث عن شقة بغرفتين نوم', ts: Date.now() - 580000 },
      { role: 'agent', text: 'ممتاز! عندنا خيارات ممتازة. ما هي ميزانيتك الشهرية؟', ts: Date.now() - 560000 },
      { role: 'user', text: 'حوالي 10,000 ريال', ts: Date.now() - 540000 },
      { role: 'agent', text: 'ممتاز! عندنا شقة المجيدية MG13 بغرفتين نوم مفروشة بسعر 8,500 ريال شهرياً. هل تود حجز زيارة؟', ts: Date.now() - 520000 }
    ],
    detectedIntent: 'تأهيل_عميل',
    entities: {
      bedrooms: 2,
      budgetSAR: 10000,
      city: 'الرياض'
    },
    actions: [
      {
        type: 'CREATE_BOOKING',
        payload: { propertyId: '1', type: 'زيارة' },
        createdAt: new Date().toISOString()
      }
    ],
    outcome: 'حجز',
    handleTimeSec: 240,
    sentiment: 'إيجابي',
    csat: 5,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const bookings: Booking[] = [
  {
    id: '1',
    propertyId: '1',
    contact: { name: 'أحمد محمد', phone: '+966501234567', email: 'ahmed@example.com' },
    startDate: '2024-01-15',
    endDate: '2024-01-16',
    status: 'مؤكد',
    source: 'مساعد_صوتي',
    priceSAR: 8500,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    propertyId: '3',
    contact: { name: 'فاطمة علي', phone: '+966507654321', email: 'fatima@example.com' },
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    status: 'معلق',
    source: 'واتساب',
    priceSAR: 6500,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const tickets: Ticket[] = [
  {
    id: '1',
    propertyId: '1',
    priority: 'متوسط',
    category: 'كهرباء',
    status: 'مفتوحة',
    assignee: 'فريق الصيانة',
    notes: 'مشكلة في الكهرباء - تم فتح التذكرة من المساعد الصوتي',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    priority: 'عالٍ',
    category: 'سباكة',
    status: 'قيد_المعالجة',
    assignee: 'أحمد الصيانة',
    notes: 'تسرب مياه في الحمام',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const leads: Lead[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    phone: '+966501234567',
    email: 'ahmed@example.com',
    status: 'حجز',
    budgetSAR: 10000,
    preferredNeighborhoods: ['حي الملقا', 'حي حطين'],
    preferredBedrooms: 2,
    moveInDate: '2024-02-01',
    source: 'مساعد_صوتي',
    campaignId: '1',
    lastCallSummary: 'عميل مهتم بشقة بغرفتين نوم في حي الملقا، ميزانية 10,000 ريال شهرياً',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    name: 'فاطمة علي',
    phone: '+966507654321',
    email: 'fatima@example.com',
    status: 'مؤهل',
    budgetSAR: 8000,
    preferredNeighborhoods: ['حي النرجس'],
    preferredBedrooms: 1,
    moveInDate: '2024-03-01',
    source: 'واتساب',
    campaignId: '1',
    lastCallSummary: 'عميلة تبحث عن شقة بغرفة نوم واحدة في حي النرجس',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    phone: '+966501234567',
    email: 'ahmed@example.com',
    type: 'عميل',
    properties: ['1'],
    totalBookings: 1,
    totalRevenueSAR: 8500,
    lastInteraction: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    name: 'فاطمة علي',
    phone: '+966507654321',
    email: 'fatima@example.com',
    type: 'عميل',
    properties: ['3'],
    totalBookings: 1,
    totalRevenueSAR: 6500,
    lastInteraction: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

// بيانات إضافية للإحصائيات
export const dashboardStats = {
  totalCalls: 1842,
  callGrowth: 12,
  answerRate: 62,
  conversionRate: 21,
  completedDeals: 118,
  monthlyRevenue: 1420000,
  occupancyRate: 89,
  avgHandleTime: '3:42',
  csatScore: 4.4,
  // حقول جديدة للوحة التحكم المحسنة
  totalRevenue: 1420000,
  revenueChange: 8.5,
  newBookings: 42,
  bookingsChange: 15.2,
  newLeads: 189,
  leadsChange: 12.8,
  callsChange: 12.0
};

// بيانات الحجوزات الحديثة
export const recentBookings = [
  {
    id: '1',
    propertyId: '1',
    contact: { name: 'أحمد محمد', phone: '+966501234567', email: 'ahmed@example.com' },
    startDate: '2024-01-15',
    endDate: '2024-01-16',
    status: 'مؤكد',
    source: 'مساعد_صوتي',
    priceSAR: 8500,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    propertyId: '3',
    contact: { name: 'فاطمة علي', phone: '+966507654321', email: 'fatima@example.com' },
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    status: 'معلق',
    source: 'واتساب',
    priceSAR: 6500,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '3',
    propertyId: '2',
    contact: { name: 'محمد عبدالله', phone: '+966509876543', email: 'mohammed@example.com' },
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    status: 'مؤكد',
    source: 'مساعد_صوتي',
    priceSAR: 12000,
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '4',
    propertyId: '5',
    contact: { name: 'سارة أحمد', phone: '+966505432109', email: 'sara@example.com' },
    startDate: '2024-01-28',
    endDate: '2024-01-29',
    status: 'معلق',
    source: 'واتساب',
    priceSAR: 9500,
    createdAt: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: '5',
    propertyId: '4',
    contact: { name: 'علي حسن', phone: '+966501112223', email: 'ali@example.com' },
    startDate: '2024-02-01',
    endDate: '2024-02-02',
    status: 'مؤكد',
    source: 'مساعد_صوتي',
    priceSAR: 18000,
    createdAt: new Date(Date.now() - 432000000).toISOString()
  }
]; 