"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function AllocationWizardPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null)
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data
  const spots = [
    {
      id: "spot1",
      propertyName: "Grand Hotel",
      location: "Lobby - North Wall",
      dimensions: "100cm × 80cm",
      fixtureMethod: "Wall Mount",
      maxWeight: "10kg",
      image: "/placeholder.svg?height=100&width=100&text=Spot",
    },
    {
      id: "spot2",
      propertyName: "Skyline Apartments",
      location: "Living Room - East Wall",
      dimensions: "120cm × 90cm",
      fixtureMethod: "Wall Mount",
      maxWeight: "15kg",
      image: "/placeholder.svg?height=100&width=100&text=Spot",
    },
    {
      id: "spot3",
      propertyName: "Riverside Gallery",
      location: "Main Hall - Center",
      dimensions: "150cm × 100cm",
      fixtureMethod: "Standing",
      maxWeight: "20kg",
      image: "/placeholder.svg?height=100&width=100&text=Spot",
    },
  ]

  const artworks = [
    {
      id: "art1",
      title: "Sunset Horizon",
      artist: "Emma Johnson",
      dimensions: "90cm × 70cm",
      weight: "8kg",
      style: "Contemporary",
      image: "/placeholder.svg?height=100&width=100&text=Art1",
    },
    {
      id: "art2",
      title: "Urban Rhythm",
      artist: "Marcus Chen",
      dimensions: "110cm × 85cm",
      weight: "12kg",
      style: "Abstract",
      image: "/placeholder.svg?height=100&width=100&text=Art2",
    },
    {
      id: "art3",
      title: "Serene Forest",
      artist: "Olivia Parker",
      dimensions: "140cm × 95cm",
      weight: "18kg",
      style: "Realism",
      image: "/placeholder.svg?height=100&width=100&text=Art3",
    },
  ]

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // In a real app, this would submit to an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to the allocations list
    router.push("/admin/allocations")
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/allocations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Allocations
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Allocation Wizard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Allocation</CardTitle>
          <CardDescription>Follow the steps to allocate an artwork to a spot</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <span className="text-sm mt-2">Select Spot</span>
              </div>
              <div className="flex-1 flex items-center">
                <div className={`h-1 w-full ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 2 ? <Check className="h-5 w-5" /> : "2"}
                </div>
                <span className="text-sm mt-2">Select Artwork</span>
              </div>
              <div className="flex-1 flex items-center">
                <div className={`h-1 w-full ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className="text-sm mt-2">Confirm</span>
              </div>
            </div>
          </div>

          {/* Step 1: Select Spot */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Step 1: Select a Spot</h3>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search spots..." className="pl-8" />
              </div>

              <RadioGroup value={selectedSpot || ""} onValueChange={setSelectedSpot}>
                <div className="space-y-4">
                  {spots.map((spot) => (
                    <div key={spot.id} className="flex items-start space-x-3 border rounded-md p-4">
                      <RadioGroupItem value={spot.id} id={spot.id} className="mt-1" />
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                        <div className="relative h-20 w-20 rounded overflow-hidden">
                          <Image
                            src={spot.image || "/placeholder.svg"}
                            alt={spot.propertyName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Label htmlFor={spot.id} className="font-medium">
                            {spot.propertyName}
                          </Label>
                          <p className="text-sm text-gray-500">{spot.location}</p>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-gray-500">Dimensions</p>
                              <p className="text-sm">{spot.dimensions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Fixture</p>
                              <p className="text-sm">{spot.fixtureMethod}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Max Weight</p>
                              <p className="text-sm">{spot.maxWeight}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Select Artwork */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Step 2: Select an Artwork</h3>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search artworks..." className="pl-8" />
              </div>

              <RadioGroup value={selectedArtwork || ""} onValueChange={setSelectedArtwork}>
                <div className="space-y-4">
                  {artworks.map((artwork) => (
                    <div key={artwork.id} className="flex items-start space-x-3 border rounded-md p-4">
                      <RadioGroupItem value={artwork.id} id={artwork.id} className="mt-1" />
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                        <div className="relative h-20 w-20 rounded overflow-hidden">
                          <Image
                            src={artwork.image || "/placeholder.svg"}
                            alt={artwork.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Label htmlFor={artwork.id} className="font-medium">
                            {artwork.title}
                          </Label>
                          <p className="text-sm text-gray-500">by {artwork.artist}</p>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-gray-500">Dimensions</p>
                              <p className="text-sm">{artwork.dimensions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Weight</p>
                              <p className="text-sm">{artwork.weight}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Style</p>
                              <p className="text-sm">{artwork.style}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Step 3: Confirm Allocation</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Selected Spot</h4>
                  {selectedSpot &&
                    (() => {
                      const spot = spots.find((s) => s.id === selectedSpot)
                      if (!spot) return <p>No spot selected</p>

                      return (
                        <div className="flex items-start space-x-4">
                          <div className="relative h-20 w-20 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={spot.image || "/placeholder.svg"}
                              alt={spot.propertyName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{spot.propertyName}</p>
                            <p className="text-sm text-gray-500">{spot.location}</p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div>
                                <p className="text-xs text-gray-500">Dimensions</p>
                                <p className="text-sm">{spot.dimensions}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Fixture</p>
                                <p className="text-sm">{spot.fixtureMethod}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Max Weight</p>
                                <p className="text-sm">{spot.maxWeight}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                </div>

                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Selected Artwork</h4>
                  {selectedArtwork &&
                    (() => {
                      const artwork = artworks.find((a) => a.id === selectedArtwork)
                      if (!artwork) return <p>No artwork selected</p>

                      return (
                        <div className="flex items-start space-x-4">
                          <div className="relative h-20 w-20 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={artwork.image || "/placeholder.svg"}
                              alt={artwork.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{artwork.title}</p>
                            <p className="text-sm text-gray-500">by {artwork.artist}</p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div>
                                <p className="text-xs text-gray-500">Dimensions</p>
                                <p className="text-sm">{artwork.dimensions}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Weight</p>
                                <p className="text-sm">{artwork.weight}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Style</p>
                                <p className="text-sm">{artwork.style}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <h4 className="font-medium text-green-800 mb-2">Compatibility Check</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-green-700">
                    <Check className="h-4 w-4 mr-2" /> Dimensions are compatible
                  </li>
                  <li className="flex items-center text-sm text-green-700">
                    <Check className="h-4 w-4 mr-2" /> Weight is within the spot's limit
                  </li>
                  <li className="flex items-center text-sm text-green-700">
                    <Check className="h-4 w-4 mr-2" /> Fixture method is suitable
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/admin/allocations">Cancel</Link>
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={handleNext} disabled={(step === 1 && !selectedSpot) || (step === 2 && !selectedArtwork)}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating Allocation..." : "Create Allocation"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

