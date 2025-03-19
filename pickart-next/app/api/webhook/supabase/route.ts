import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// This webhook endpoint will be triggered by Supabase when data changes
// Configure this in your Supabase dashboard under Database > Webhooks

export async function POST(request: NextRequest) {
  // In production, verify the webhook signature
  // const signature = request.headers.get('x-supabase-signature');
  // if (!verifySignature(signature, process.env.SUPABASE_WEBHOOK_SECRET)) {
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  // }

  try {
    const body = await request.json()

    // Extract information from the webhook payload
    const table = body.table
    const eventType = body.type // INSERT, UPDATE, DELETE
    const record = body.record

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

