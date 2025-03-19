import { ArtworkWithDetails } from "@/lib/art";

export default function ArtDetails({ art }: { art: ArtworkWithDetails }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500">Dimensions</p>
          <p>{art.dimensions}</p>
        </div>
        <div>
          <p className="text-gray-500">Medium</p>
          <p>{art.medium}</p>
        </div>
        <div>
          <p className="text-gray-500">Style</p>
          <p>{art.style}</p>
        </div>
        <div>
          <p className="text-gray-500">Year</p>
          <p>{art.year}</p>
        </div>
      </div>
    </div>
  )
}

