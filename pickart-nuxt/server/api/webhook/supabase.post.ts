import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Extract information from the webhook payload
    const table = body.table
    const eventType = body.type // INSERT, UPDATE, DELETE
    const record = body.record

    // Set cache control headers to prevent caching
    event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    event.node.res.setHeader('Pragma', 'no-cache')
    event.node.res.setHeader('Expires', '0')

    // Only process art_pieces and places table events
    if (table === "art_pieces") {
      const artId = record?.id

      if (artId) {
        // Set cache control headers for art piece routes
        event.node.res.setHeader('Surrogate-Key', `art-piece-${artId} art-pieces`)
        event.node.res.setHeader('Surrogate-Control', 'no-store')

        console.log(`Revalidated paths for art piece ${artId}`)
      }
    } else if (table === "places") {
      const placeSlug = record?.slug

      if (placeSlug) {
        // Set cache control headers for place routes
        event.node.res.setHeader('Surrogate-Key', `place-${placeSlug} places`)
        event.node.res.setHeader('Surrogate-Control', 'no-store')

        console.log(`Revalidated paths for place ${placeSlug}`)
      }
    }

    // Return success response
    return {
      revalidated: true,
      table,
      eventType,
      timestamp: new Date().toISOString(),
      paths: table === "art_pieces" 
        ? [`/art/${record?.id}`, '/art'] 
        : [`/places/${record?.slug}`, '/places']
    }
  } catch (error) {
    console.error("Webhook error:", error)
    
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}) 