import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// This endpoint allows you to trigger revalidation for specific pages
// when you update content in your database

// Add a secret token for security (set this in your environment variables)
const SECRET_TOKEN = process.env.REVALIDATION_TOKEN

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

