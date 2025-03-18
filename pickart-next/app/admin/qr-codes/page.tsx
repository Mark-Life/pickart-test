"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Download, Printer, Copy, Search } from "lucide-react"

export default function QRCodesPage() {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null)

  // Mock spots data
  const spots = [
    {
      id: "1-1",
      propertyName: "Grand Hotel",
      location: "Lobby - North Wall",
      qrCode: "/placeholder.svg?height=200&width=200&text=QR+Code",
      artworkTitle: "Sunset Horizon",
      status: "LIVE",
    },
    {
      id: "2-1",
      propertyName: "Skyline Apartments",
      location: "Living Room - East Wall",
      qrCode: "/placeholder.svg?height=200&width=200&text=QR+Code",
      artworkTitle: "Serene Forest",
      status: "LIVE",
    },
    {
      id: "3-1",
      propertyName: "Riverside Gallery",
      location: "Main Hall - Center",
      qrCode: "/placeholder.svg?height=200&width=200&text=QR+Code",
      artworkTitle: "Urban Rhythm",
      status: "LIVE",
    },
    {
      id: "4-1",
      propertyName: "Ocean View Resort",
      location: "Reception - South Wall",
      qrCode: "/placeholder.svg?height=200&width=200&text=QR+Code",
      artworkTitle: null,
      status: "READY",
    },
    {
      id: "5-1",
      propertyName: "Tech Hub Offices",
      location: "Conference Room - West Wall",
      qrCode: "/placeholder.svg?height=200&width=200&text=QR+Code",
      artworkTitle: "Whispers of the Sea",
      status: "LIVE",
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">QR Code Management</h1>
        <Button asChild>
          <Link href="/admin/qr-codes/generate">
            <QrCode className="mr-2 h-4 w-4" /> Generate New QR Code
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Spot QR Codes</CardTitle>
              <CardDescription>View and manage QR codes for all spots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search spots..." className="pl-8" />
              </div>

              <Tabs defaultValue="all">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="active" className="flex-1">
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="ready" className="flex-1">
                    Ready
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {spots.map((spot) => (
                    <button
                      key={spot.id}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        selectedSpot === spot.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedSpot(spot.id)}
                    >
                      <div className="font-medium">{spot.propertyName}</div>
                      <div className="text-sm text-gray-500">{spot.location}</div>
                      <div className="text-xs mt-1">
                        {spot.artworkTitle ? (
                          <span className="text-green-600">Active: {spot.artworkTitle}</span>
                        ) : (
                          <span className="text-blue-600">Ready for allocation</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedSpot ? (
            <Card>
              <CardHeader>
                <CardTitle>QR Code Details</CardTitle>
                <CardDescription>View and download the QR code for the selected spot</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const spot = spots.find((s) => s.id === selectedSpot)
                  if (!spot) return null

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="border p-4 rounded-lg mb-4">
                          <Image
                            src={spot.qrCode || "/placeholder.svg"}
                            alt="QR Code"
                            width={200}
                            height={200}
                            className="mx-auto"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4 mr-2" /> Print
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-2" /> Copy Link
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Spot Information</h3>
                        <dl className="space-y-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Property</dt>
                            <dd>{spot.propertyName}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                            <dd>{spot.location}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Spot ID</dt>
                            <dd className="font-mono text-sm">ASCH-{spot.id}-XX</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Current Artwork</dt>
                            <dd>{spot.artworkTitle || "None assigned"}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">QR Code URL</dt>
                            <dd className="font-mono text-sm truncate">https://pickart.com/spot/{spot.id}</dd>
                          </div>
                        </dl>

                        <div className="mt-6">
                          <Label htmlFor="notes" className="text-sm font-medium text-gray-500">
                            Notes
                          </Label>
                          <Input id="notes" placeholder="Add notes about this QR code..." className="mt-1" />
                        </div>

                        <div className="mt-6">
                          <Button className="w-full">Update QR Code</Button>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <QrCode className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Spot</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Select a spot from the list to view and manage its QR code
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

