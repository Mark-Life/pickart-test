import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createHmac, timingSafeEqual } from "crypto"

// Verify Supabase webhook signature
function verifySignature(payload: string, signature: string | null, secret: string | undefined): boolean {
  if (!signature || !secret) return false
  
  try {
    // For testing without signature verification
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_WEBHOOK_VERIFICATION === 'true') {
      return true
    }
    
    // Calculate HMAC using SHA-256
    const hmac = createHmac('sha256', secret)
    const expectedSignature = hmac.update(payload).digest('hex')
    
    // Use constant-time comparison to prevent timing attacks
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

// This webhook endpoint will be triggered by Supabase when data changes
// Configure this in your Supabase dashboard under Database > Webhooks

export async function POST(request: NextRequest) {
  // Check if webhook secret is configured
  if (!process.env.REVALIDATE_WEBHOOK_SECRET) {
    console.warn('REVALIDATE_WEBHOOK_SECRET is not set, skipping verification')
  }

  // Get raw payload text for signature verification
  const payload = await request.text()
  const payloadObj = JSON.parse(payload)

  // Verify the webhook signature
  const signature = request.headers.get('x-supabase-signature')
  if (!verifySignature(payload, signature, process.env.REVALIDATE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    // Extract information from the webhook payload
    const table = payloadObj.table
    const eventType = payloadObj.type // INSERT, UPDATE, DELETE
    const record = payloadObj.record

    // Only process artworks table events (previously art_pieces)
    if (table === "artworks") {
      const artworkId = record?.artwork_id

      if (artworkId) {
        // Revalidate the specific art page
        revalidatePath(`/art/${artworkId}`)

        // Also revalidate the art listing page
        revalidatePath("/art")

        console.log(`Revalidated paths for artwork ${artworkId}`)
      }
    }

    return NextResponse.json({
      revalidated: true,
      table,
      eventType,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Webhook error:", error)

    return NextResponse.json(
      {
        error: "Error processing webhook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

