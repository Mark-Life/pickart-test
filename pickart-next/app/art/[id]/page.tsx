export const revalidate = 3600 // Revalidate every hour (3600 seconds)

import { getArtPieceById, getPublishedArtPieceIds } from "@/lib/art"
import { notFound } from "next/navigation"
import PurchaseButton from "@/components/purchase-button"
import ArtDetails from "@/components/art-details"
import ArtGallery from "@/components/art-gallery"

// Generate static pages at build time
export async function generateStaticParams() {
  const artPieces = await getPublishedArtPieceIds()

  return artPieces.map((id) => ({
    id: id.toString(),
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const art = await getArtPieceById(params.id)

  if (!art) {
    return {
      title: "Art Not Found | PickArt",
    }
  }

  return {
    title: `${art.title} by ${art.artist} | PickArt`,
    description: art.description,
    openGraph: {
      images: [art.images[0]],
    },
  }
}

export default async function ArtPiecePage({ params }) {
  const art = await getArtPieceById(params.id)

  if (!art || !art.published) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ArtGallery images={art.images} title={art.title} />

        <div>
          <h1 className="text-3xl font-bold">{art.title}</h1>
          <p className="text-xl mt-2">by {art.artist}</p>
          <p className="text-gray-600 mt-1">{art.year}</p>

          <div className="mt-6">
            <p className="text-2xl font-bold">${art.price.toLocaleString()}</p>
          </div>

          <div className="mt-6">
            <PurchaseButton artPiece={art} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{art.description}</p>
          </div>

          <ArtDetails art={art} />
        </div>
      </div>
    </div>
  )
}

