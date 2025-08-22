import { NextResponse } from 'next/server'
import { dashboardStats } from '@/app/(dashboard)/dashboard/data/seed-data'

export async function GET() {
  return NextResponse.json(dashboardStats)
} 