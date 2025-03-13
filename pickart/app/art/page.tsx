export const revalidate = 3600 // Revalidate every hour (3600 seconds)

import { getPublishedArtPieces } from "@/lib/art"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Browse Art | PickArt",
  description: "Discover and purchase unique art pieces from talented artists around the world.",
}

export default async function ArtPage() {
  const artPieces = await getPublishedArtPieces()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Art</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artPieces.map((art) => (
          <Link href={`/art/${art.id}`} key={art.id} className="group">
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src={art.images[0] || "/placeholder.svg"}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{art.title}</h2>
                <p className="text-gray-600">{art.artist}</p>
                <p className="mt-2 font-medium">${art.price.toLocaleString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

