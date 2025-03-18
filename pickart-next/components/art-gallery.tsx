"use client"

import Image from "next/image"
import { useState } from "react"

type ArtGalleryProps = {
  images: string[]
  title: string
}

export default function ArtGallery({ images, title }: ArtGalleryProps) {
  // Ensure we always have a valid array of images
  const safeImages = Array.isArray(images) && images.length > 0 
    ? images 
    : ['/placeholder.svg']
  
  // Use the first image as the default main image
  const [mainImage, setMainImage] = useState<string>(safeImages[0])

  return (
    <div>
      <div className="relative aspect-square md:aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-50">
        <Image 
          src={mainImage} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain" 
          priority 
        />
      </div>

      {safeImages.length > 1 && (
        <div className="flex mt-4 gap-2 overflow-x-auto p-1 pb-2">
          {safeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setMainImage(img)}
              className={`relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 ${
                mainImage === img ? "ring-2 ring-black" : "ring-1 ring-gray-200"
              }`}
              type="button"
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${title} - view ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

