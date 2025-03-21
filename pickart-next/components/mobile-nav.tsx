"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "/art", label: "Art" }
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-auto pt-10">
        <SheetHeader>
          <SheetTitle className="text-center">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6">
          <ul className="flex flex-col items-center space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block py-2 text-lg hover:text-primary" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

