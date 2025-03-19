import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PickArt | Discover and Purchase Unique Art",
  description:
    "PickArt is a platform for discovering and purchasing unique art pieces from talented artists around the world.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              PickArt
            </Link>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col mt-8">
                  <ul className="space-y-4">
                    <li>
                      <Link href="/art" className="text-lg">
                        Browse Art
                      </Link>
                    </li>
                    <li>
                      <Link href="/places" className="text-lg">
                        Places
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-lg">
                        Artists
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-lg">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin" className="text-lg">
                        Platform
                      </Link>
                    </li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex gap-6">
                <li>
                  <Link href="/art" className="hover:underline">
                    Browse Art
                  </Link>
                </li>
                <li>
                  <Link href="/places" className="hover:underline">
                    Places
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Artists
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:underline">
                    Platform
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-gray-500">© {new Date().getFullYear()} PickArt. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

