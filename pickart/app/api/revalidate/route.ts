import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// This endpoint allows you to trigger revalidation for specific pages
// when you update content in your database

// Add a secret token for security (set this in your environment variables)
const SECRET_TOKEN = process.env.REVALIDATION_TOKEN
const SUPABASE_WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  const path = request.nextUrl.searchParams.get("path") || "/art"

  // Check for valid token to prevent unauthorized revalidations
  if (!SECRET_TOKEN || token !== SECRET_TOKEN) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  try {
    // Revalidate the specific path
    revalidatePath(path)

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error revalidating",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  // Handle Supabase webhooks
  const signature = request.headers.get("x-supabase-signature")
  
  if (!SUPABASE_WEBHOOK_SECRET || !signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 })
  }

  try {
    // Get parameters from URL
    const table = request.nextUrl.searchParams.get("table")
    const type = request.nextUrl.searchParams.get("type")
    const recordId = request.nextUrl.searchParams.get("record_id")
    const recordSlug = request.nextUrl.searchParams.get("record_slug")

    if (!table || !type) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Determine which paths to revalidate based on the table and operation
    let paths: string[] = []
    
    if (table === "art_pieces") {
      paths.push("/art")
      if ((type === "UPDATE" || type === "DELETE") && recordId) {
        paths.push(`/art/${recordId}`)
      }
    } else if (table === "places") {
      paths.push("/places")
      if ((type === "UPDATE" || type === "DELETE") && recordSlug) {
        paths.push(`/places/${recordSlug}`)
      }
    }

    // Revalidate all affected paths
    for (const path of paths) {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error processing webhook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

