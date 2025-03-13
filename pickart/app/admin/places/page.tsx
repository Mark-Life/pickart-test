import { getPlacesWithArtPieces } from "@/lib/places"
import { getAllArtPieces } from "@/lib/art"
import Link from "next/link"
import Image from "next/image"
import { assignArtPieceToPlace } from "@/lib/places"

export const metadata = {
  title: "Manage Places | Admin Dashboard",
  description: "Manage places and their art piece assignments",
}

// Server action to assign art piece to place
async function assignArtPiece(formData: FormData) {
  "use server"

  const placeId = formData.get("placeId") as string
  const artPieceId = formData.get("artPieceId") as string

  // If "none" is selected, set artPieceId to null
  const finalArtPieceId = artPieceId === "none" ? null : artPieceId

  try {
    await assignArtPieceToPlace(placeId, finalArtPieceId)
    return { success: true }
  } catch (error) {
    console.error("Error assigning art piece:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export default async function ManagePlacesPage() {
  const placesWithArt = await getPlacesWithArtPieces()
  const artPieces = await getAllArtPieces()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Places</h1>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Art
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assign Art
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {placesWithArt.map((place) => (
                <tr key={place.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image src={place.image || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{place.name}</div>
                    <div className="text-sm text-gray-500">ID: {place.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{place.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {place.artPiece ? (
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-2">
                          <Image
                            src={place.artPiece.images[0] || "/placeholder.svg"}
                            alt={place.artPiece.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{place.artPiece.title}</div>
                          <div className="text-xs text-gray-500">by {place.artPiece.artist}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">None assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <form action={assignArtPiece} className="flex space-x-2">
                      <input type="hidden" name="placeId" value={place.id} />
                      <select
                        name="artPieceId"
                        className="text-sm border rounded px-2 py-1"
                        defaultValue={place.artPieceId || "none"}
                      >
                        <option value="none">-- None --</option>
                        {artPieces.map((art) => (
                          <option key={art.id} value={art.id}>
                            {art.title} ({art.published ? "Published" : "Draft"})
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                      >
                        Update
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link href={`/place/${place.slug}`} className="text-blue-600 hover:text-blue-900" target="_blank">
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

