"use client"

import { useState } from "react"
import { checkPhishingLink } from "../actions/phishing"
import PageHeader from "@/components/page-header"
import ResultCard from "@/components/result-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, ExternalLink, Loader2, ShieldAlert, ShieldCheck } from "lucide-react"

export default function PhishingDetection() {
  const [url, setUrl] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!url.trim()) return

    setIsChecking(true)
    setError(null)

    try {
      const response = await checkPhishingLink(url)

      if (response.success) {
        setResult(response.analysis)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError("Failed to check URL. Please try again.")
    } finally {
      setIsChecking(false)
    }
  }

  const getResultStatus = () => {
    if (!result) return "idle"

    if (result.riskLevel === "safe") {
      return "success"
    } else if (result.riskLevel === "suspicious") {
      return "warning"
    } else {
      return "error"
    }
  }

  const getRecommendations = () => {
    if (!result) return []

    if (result.riskLevel === "safe") {
      return [
        "This URL appears to be safe, but always exercise caution when clicking links.",
        "Verify the sender if the link was received via email or message.",
      ]
    } else if (result.riskLevel === "suspicious") {
      return [
        "Proceed with caution. This URL has some suspicious indicators.",
        "Do not enter personal information or credentials on this site.",
        "Consider contacting the supposed organization directly through their official website.",
      ]
    } else {
      return [
        "Do not visit this URL. It has been flagged as dangerous.",
        "If you've already visited the site, consider changing passwords for any accounts you may have accessed.",
        "Run a security scan on your device.",
        "Report the URL to the appropriate authorities or platform.",
      ]
    }
  }

  return (
    <div>
      <PageHeader title="Phishing Link Detection" description="Check URLs for potential phishing threats" />

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL to check (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleCheck} disabled={isChecking || !url.trim()}>
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check URL"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <ResultCard title="Analysis Error" status="error">
          <p>{error}</p>
        </ResultCard>
      )}

      {result && (
        <ResultCard
          title={`Analysis Result: ${result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}`}
          status={getResultStatus()}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="h-4 w-4" />
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {result.url}
              </a>
            </div>

            <div>
              <h3 className="font-medium">Risk Assessment</h3>
              <div className="mt-2 h-4 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    result.riskScore < 5 ? "bg-green-500" : result.riskScore < 20 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${result.riskScore}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Safe (0%)</span>
                <span>Suspicious (10%)</span>
                <span>Dangerous (20%+)</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Detection Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Safe</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{result.stats.harmless}</p>
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Suspicious</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{result.stats.suspicious}</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Malicious</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{result.stats.malicious}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Undetected</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{result.stats.undetected}</p>
                </div>
              </div>
            </div>

            {result.categories && result.categories.length > 0 && (
              <div>
                <h3 className="font-medium">Threat Categories</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.categories.map((category: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium">Recommendations</h3>
              <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                {getRecommendations().map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="text-sm text-muted-foreground">
              Last analyzed: {new Date(result.lastAnalysisDate).toLocaleString()}
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  )
}
