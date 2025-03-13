import { getArtPieceById } from "@/lib/art"
import { toggleArtPieceStatus } from "../../actions"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

// This is a simple admin page to demonstrate how to publish/unpublish art pieces
// In a real application, you would add authentication and authorization

export default async function AdminArtPage({ params }) {
  const art = await getArtPieceById(params.id)

  if (!art) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin: Manage Art Piece</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">{art.title}</h2>
        <p className="text-gray-600">by {art.artist}</p>

        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="font-medium">
            Current Status:
            <span className={art.published ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
              {art.published ? "Published" : "Unpublished"}
            </span>
          </p>
        </div>

        <form
          action={async () => {
            "use server"
            await toggleArtPieceStatus(art.id, !art.published)
          }}
          className="mt-6"
        >
          <Button type="submit" variant={art.published ? "destructive" : "default"}>
            {art.published ? "Unpublish" : "Publish"} Art Piece
          </Button>
        </form>

        <div className="mt-8 text-sm text-gray-500">
          <p>Note: When you change the publication status, the following will happen:</p>
          <ul className="list-disc ml-5 mt-2">
            <li>The database will be updated</li>
            <li>The revalidation API will be triggered</li>
            <li>The art piece page and listing page will be regenerated</li>
            <li>Changes will be visible immediately</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

