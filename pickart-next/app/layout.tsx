import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"

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
            <MobileNav />

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex gap-6">
                <li>
                  <Link href="/art" className="hover:underline">
                    Art
                  </Link>
                </li>
                <li>
                  <Link href="/platform" className="hover:underline">
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

