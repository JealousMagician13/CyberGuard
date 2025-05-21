"use client"

import { useState } from "react"
import { analyzeFakeNews } from "./actions/fake-news"
import PageHeader from "@/components/page-header"
import ResultCard from "@/components/result-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function FakeNewsDetection() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await analyzeFakeNews(text)

      if (response.success) {
        setResult(response.analysis)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError("Failed to analyze text. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getResultStatus = () => {
    if (!result) return "idle"

    if (result.classification === "legitimate") {
      return "success"
    } else if (result.classification === "potentially misleading") {
      return "warning"
    } else {
      return "error"
    }
  }

  return (
    <div>
      <PageHeader
        title="Fake News Detection"
        description="Analyze article text to detect potential fake news or misinformation"
      />

      <Card>
        <CardContent className="pt-6">
          <Textarea
            placeholder="Paste or type article text here..."
            className="min-h-[200px] resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button className="mt-4" onClick={handleAnalyze} disabled={isAnalyzing || !text.trim()}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Article"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <ResultCard title="Analysis Error" status="error">
          <p>{error}</p>
        </ResultCard>
      )}

      {result && (
        <ResultCard title={`Analysis Result: ${result.classification}`} status={getResultStatus()}>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Confidence Score</h3>
              <div className="mt-2 h-4 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    result.score <= 30 ? "bg-green-500" : result.score <= 70 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Legitimate (0)</span>
                <span>Needs Fact-Checking (50)</span>
                <span>Fake (100)</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Reasoning</h3>
              <p className="mt-1 text-muted-foreground">{result.reasoning}</p>
            </div>

            {result.keyIssues && result.keyIssues.length > 0 && (
              <div>
                <h3 className="font-medium">Key Issues</h3>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {result.keyIssues.map((issue: string, index: number) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <h3 className="font-medium">Recommendations</h3>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ResultCard>
      )}
    </div>
  )
}
