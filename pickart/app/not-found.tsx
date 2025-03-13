import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl mt-2">Art Piece Not Found</h2>
      <p className="text-gray-600 mt-4 text-center max-w-md">
        The art piece you're looking for might have been moved, removed, or is not yet published.
      </p>
      <Link href="/art" className="mt-8 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
        Browse Available Art
      </Link>
    </div>
  )
}

