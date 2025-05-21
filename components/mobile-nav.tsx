"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FileWarning, LinkIcon, Menu, Newspaper, Settings, Shield, User } from "lucide-react"

const routes = [
  {
    name: "Fake News Detection",
    path: "/",
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    name: "Phishing Link Detection",
    path: "/phishing",
    icon: <LinkIcon className="h-5 w-5" />,
  },
  {
    name: "Malware Detection",
    path: "/malware",
    icon: <FileWarning className="h-5 w-5" />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <User className="h-5 w-5" />,
  },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">CyberGuard</h1>
            </div>
            <nav className="space-y-1.5">
              {routes.map((route) => (
                <Link key={route.path} href={route.path} onClick={() => setOpen(false)}>
                  <Button variant="ghost" className={cn("w-full justify-start", pathname === route.path && "bg-muted")}>
                    {route.icon}
                    <span className="ml-2">{route.name}</span>
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
