import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

type ResultStatus = "success" | "warning" | "error" | "loading" | "idle"

interface ResultCardProps {
  title: string
  status: ResultStatus
  children: React.ReactNode
}

export default function ResultCard({ title, status, children }: ResultCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card
      className={cn(
        "mt-6",
        status === "success" && "border-green-200 dark:border-green-900",
        status === "warning" && "border-amber-200 dark:border-amber-900",
        status === "error" && "border-red-200 dark:border-red-900",
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
