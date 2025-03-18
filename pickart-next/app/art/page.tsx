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

      {artPieces.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No art pieces available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {artPieces.map((art) => (
            <Link 
              href={`/art/${art.artworkId}`} 
              key={art.id} 
              className="group"
              prefetch={false} // Prevent prefetching which can cause state inconsistencies
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square w-full bg-gray-100">
                  {/* Using priority for first few images to improve LCP */}
                  <Image
                    src={art.images[0] || "/placeholder.svg"}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={artPieces.indexOf(art) < 3}
                    // Avoid using blurDataURL which can cause hydration mismatches
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold truncate">{art.title}</h2>
                  <p className="text-gray-600 truncate">{art.artist}</p>
                  <p className="mt-2 font-medium">${art.price.toLocaleString('en-US')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

