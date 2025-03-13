import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, QrCode, Palette, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/placeholder.svg?height=1080&width=1920&text=Art+Gallery"
            alt="Art gallery background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect Art with Spaces</h1>
            <p className="text-xl md:text-2xl mb-8">
              PickArt brings artists and property owners together, turning spaces into galleries and creating new
              opportunities for art discovery and sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/art">Browse Art</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg bg-white/10 backdrop-blur-sm">
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A Platform for Artists and Property Owners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PickArt creates a unique ecosystem where art finds its audience and spaces come alive with creativity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-100 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">For Artists</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Showcase your art in real-world spaces</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Reach new audiences beyond traditional galleries</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Sell directly to interested buyers</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-gray-100 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">For Property Owners</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Enhance guest experience with curated art</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Generate additional revenue from art sales</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Differentiate your property in the market</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How PickArt Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A seamless process connecting artists, spaces, and art enthusiasts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Artists Upload Artwork</h3>
              <p className="text-gray-600">
                Artists upload their work with details like title, dimensions, price, and description.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Art Meets Spaces</h3>
              <p className="text-gray-600">
                Property owners select artwork for their spaces. Each piece gets a unique QR code.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Guests Discover & Purchase</h3>
              <p className="text-gray-600">
                Guests scan QR codes to learn about the art and can purchase directly through the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artwork */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Artwork</h2>
            <Link href="/art" className="text-primary flex items-center hover:underline">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Link href={`/art/${i}`} key={i} className="group">
                <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-64 w-full">
                    <Image
                      src={`/placeholder.svg?height=800&width=600&text=Artwork+${i}`}
                      alt={`Featured artwork ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">Artwork Title {i}</h3>
                    <p className="text-gray-600">Artist Name</p>
                    <p className="mt-2 font-medium">${(1500 * i).toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Spaces with Art?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join PickArt today and be part of a growing community connecting artists, spaces, and art enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-primary text-lg">
              <Link href="/art">Browse Art</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white text-white bg-gray-900 hover:bg-white">
              <Link href="/places">Explore Spaces</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

