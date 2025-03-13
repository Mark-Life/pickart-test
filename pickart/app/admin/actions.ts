"use server"

import { updateArtPieceStatus } from "@/lib/art"
import { revalidatePath } from "next/cache"

// Server action to publish or unpublish an art piece
export async function toggleArtPieceStatus(id: string, published: boolean) {
  try {
    // Update the art piece status in the database
    await updateArtPieceStatus(id, published)

    // Revalidate the affected paths
    revalidatePath(`/art/${id}`)
    revalidatePath("/art")

    return { success: true, message: `Art piece ${published ? "published" : "unpublished"} successfully` }
  } catch (error) {
    console.error("Error toggling art piece status:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

