import { getPlacesWithArtPieces } from "@/lib/places"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Featured Places | PickArt",
  description: "Discover hotels, apartments, and other venues featuring our art pieces.",
}

export default async function PlacesPage() {
  const placesWithArt = await getPlacesWithArtPieces()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Featured Places</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {placesWithArt.map((place) => (
          <Link href={`/place/${place.slug}`} key={place.id} className="group">
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src={place.image || "/placeholder.svg"}
                  alt={place.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{place.name}</h2>
                <p className="text-gray-600">
                  {place.type.charAt(0).toUpperCase() + place.type.slice(1)} in {place.location}
                </p>

                {place.artPiece ? (
                  <div className="mt-2 flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-2">
                      <Image
                        src={place.artPiece.images[0] || "/placeholder.svg"}
                        alt={place.artPiece.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-700">
                      Featuring: <span className="font-medium">{place.artPiece.title}</span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500 italic">No art piece currently featured</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

