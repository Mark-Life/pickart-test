"use client"

import Image from "next/image"
import { useState } from "react"

export default function ArtGallery({ images, title }) {
  const [mainImage, setMainImage] = useState(images[0])

  return (
    <div>
      <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
        <Image src={mainImage || "/placeholder.svg"} alt={title} fill className="object-contain" priority />
      </div>

      {images.length > 1 && (
        <div className="flex mt-4 gap-2 overflow-x-auto p-1 pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setMainImage(img)}
              className={`relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 ${
                mainImage === img ? "ring-1 ring-black" : ""
              }`}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`${title} - view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

