"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileWarning, LinkIcon, Newspaper, Settings, Shield, User } from "lucide-react"

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

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-background">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">CyberGuard</h1>
        </div>
        <nav className="space-y-1.5">
          {routes.map((route) => (
            <Link key={route.path} href={route.path}>
              <Button variant="ghost" className={cn("w-full justify-start", pathname === route.path && "bg-muted")}>
                {route.icon}
                <span className="ml-2">{route.name}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
