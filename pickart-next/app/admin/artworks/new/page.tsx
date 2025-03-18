"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Eye } from "lucide-react"
import Link from "next/link"

export default function NewArtworkPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, this would submit to an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to the artworks list
    router.push("/admin/artworks")
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/artworks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Artworks
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Add New Artwork</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Artwork Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic details about the artwork</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Artwork Title *</Label>
                    <Input id="title" placeholder="Enter artwork title" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artist">Artist Name *</Label>
                    <Input id="artist" placeholder="Enter artist name" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Input id="year" type="number" placeholder="YYYY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="place">Place</Label>
                      <Input id="place" placeholder="Where it was created" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description / Artist's Notes *</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a detailed description of the artwork"
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                  <CardDescription>Enter the technical specifications of the artwork</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="style">Style *</Label>
                    <Select>
                      <SelectTrigger id="style">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contemporary">Contemporary</SelectItem>
                        <SelectItem value="abstract">Abstract</SelectItem>
                        <SelectItem value="realism">Realism</SelectItem>
                        <SelectItem value="impressionism">Impressionism</SelectItem>
                        <SelectItem value="minimalism">Minimalism</SelectItem>
                        <SelectItem value="surrealism">Surrealism</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medium">Medium *</Label>
                    <Select>
                      <SelectTrigger id="medium">
                        <SelectValue placeholder="Select medium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oil">Oil on canvas</SelectItem>
                        <SelectItem value="acrylic">Acrylic on canvas</SelectItem>
                        <SelectItem value="watercolor">Watercolor</SelectItem>
                        <SelectItem value="mixed">Mixed media</SelectItem>
                        <SelectItem value="digital">Digital art</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="sculpture">Sculpture</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Edition Type *</Label>
                    <RadioGroup defaultValue="unique">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unique" id="unique" />
                        <Label htmlFor="unique">Unique piece</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="limited" id="limited" />
                        <Label htmlFor="limited">Limited edition</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (cm) *</Label>
                      <Input id="width" type="number" placeholder="Width" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm) *</Label>
                      <Input id="height" type="number" placeholder="Height" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depth">Depth (cm)</Label>
                      <Input id="depth" type="number" placeholder="Depth" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg) *</Label>
                      <Input id="weight" type="number" placeholder="Weight" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input id="price" type="number" placeholder="Price" required />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Artwork Images</CardTitle>
                <CardDescription>Upload high-quality images of the artwork</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Upload Artwork Images</h3>
                    <p className="text-sm text-gray-500 mb-4">Drag and drop image files or click to browse</p>
                    <Button variant="outline" size="sm">
                      Select Files
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">
                      PNG, JPG or WEBP up to 10MB each. First image will be used as the main image.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* This would be populated with uploaded images */}
                    <div className="border rounded-md p-2 relative">
                      <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                        <p className="text-gray-400">Preview 1</p>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">main-image.jpg</span>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Preview Artwork</CardTitle>
                <CardDescription>Review how the artwork will appear on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-8 rounded-lg text-center">
                  <Eye className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Preview Not Available</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Fill in the artwork details and upload images to see a preview
                  </p>
                  <Button variant="outline" size="sm">
                    Generate Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/artworks")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Artwork"}
          </Button>
        </div>
      </form>
    </div>
  )
}

