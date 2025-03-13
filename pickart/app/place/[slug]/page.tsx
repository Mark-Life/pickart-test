import { getPlaceBySlug } from "@/lib/places"
import { getArtPieceById } from "@/lib/art"
import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default async function PlacePage({ params }: { params: { slug: string } }) {
  const place = await getPlaceBySlug(params.slug)

  if (!place) {
    notFound()
  }

  // If the place has an art piece assigned, redirect to the art piece page
  if (place.artPieceId) {
    const artPiece = await getArtPieceById(place.artPieceId)

    // Only redirect if the art piece exists and is published
    if (artPiece && artPiece.published) {
      redirect(`/art/${place.artPieceId}`)
    }
  }

  // If we get here, either there's no art piece assigned or it's not published
  // So we'll show a placeholder page
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative h-64 w-full mb-8 rounded-lg overflow-hidden">
          <Image src={place.image || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
        </div>

        <h1 className="text-3xl font-bold mb-4">{place.name}</h1>
        <p className="text-xl text-gray-600 mb-2">
          {place.type.charAt(0).toUpperCase() + place.type.slice(1)} in {place.location}
        </p>
        <p className="text-gray-700 mb-8">{place.description}</p>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">No Art Piece Currently Featured</h2>
          <p className="text-gray-600 mb-6">
            This {place.type} doesn't have an art piece assigned yet or the assigned piece is not currently available.
          </p>
          <Link
            href="/art"
            className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Browse Available Art
          </Link>
        </div>
      </div>
    </div>
  )
}

