import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db/client'

export async function GET() {
  try {
    const connectionInfo = await checkDatabaseConnection()

    // For security, only return this in development
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json(connectionInfo)
    } else {
      return NextResponse.json({ 
        status: 'Database check only available in development mode'
      })
    }
  } catch (error) {
    console.error('Error checking database:', error)
    return NextResponse.json(
      { error: 'Failed to check database connection' },
      { status: 500 }
    )
  }
} 