"use server"

export async function checkPhishingLink(url: string) {
  try {
    // Validate URL format
    try {
      new URL(url)
    } catch (e) {
      return { success: false, error: "Invalid URL format" }
    }

    // First, check if the URL has already been analyzed
    const apiKey = "3d4d4cecab9b20870c516fe0b8082752f9bba80cb481811181677552d770f861"
    if (!apiKey) {
      return { success: false, error: "API key not configured" }
    }

    // Get URL ID (base64 encoded)
    const urlId = Buffer.from(url).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

    // Check if URL exists in VirusTotal
    const checkResponse = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      headers: {
        "x-apikey": apiKey,
      },
    })

    if (checkResponse.status === 404) {
      // URL not analyzed yet, submit for analysis
      const formData = new URLSearchParams()
      formData.append("url", url)

      const submitResponse = await fetch("https://www.virustotal.com/api/v3/urls", {
        method: "POST",
        headers: {
          "x-apikey": apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json()
        return { success: false, error: errorData.error?.message || "Failed to submit URL for analysis" }
      }

      const submitData = await submitResponse.json()
      const analysisId = submitData.data.id

      // Wait for analysis to complete (poll)
      let analysisComplete = false
      let analysisResult = null
      let attempts = 0

      while (!analysisComplete && attempts < 10) {
        attempts++

        // Wait 2 seconds between polls
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const analysisResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
          headers: {
            "x-apikey": apiKey,
          },
        })

        if (!analysisResponse.ok) {
          continue
        }

        const analysisData = await analysisResponse.json()
        if (analysisData.data.attributes.status === "completed") {
          analysisComplete = true

          // Get the full URL report
          const urlResponse = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
            headers: {
              "x-apikey": apiKey,
            },
          })

          if (urlResponse.ok) {
            analysisResult = await urlResponse.json()
          }
        }
      }

      if (!analysisResult) {
        return { success: false, error: "Analysis timed out or failed" }
      }

      return processPhishingResult(analysisResult)
    } else if (checkResponse.ok) {
      // URL already analyzed
      const data = await checkResponse.json()
      return processPhishingResult(data)
    } else {
      const errorData = await checkResponse.json()
      return { success: false, error: errorData.error?.message || "Failed to check URL" }
    }
  } catch (error) {
    console.error("Error checking phishing link:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

function processPhishingResult(data: any) {
  try {
    const attributes = data.data.attributes
    const stats = attributes.last_analysis_stats
    const results = attributes.last_analysis_results

    // Calculate risk score (0-100)
    const totalEngines = stats.harmless + stats.malicious + stats.suspicious + stats.undetected
    const riskScore = Math.round(((stats.malicious + stats.suspicious) / totalEngines) * 100)

    // Get categories from results
    const categories: string[] = []
    Object.values(results).forEach((result: any) => {
      if (result.category === "malicious" || result.category === "suspicious") {
        if (result.result && !categories.includes(result.result)) {
          categories.push(result.result)
        }
      }
    })

    // Determine risk level
    let riskLevel = "safe"
    if (riskScore >= 5 && riskScore < 20) {
      riskLevel = "suspicious"
    } else if (riskScore >= 20) {
      riskLevel = "dangerous"
    }

    return {
      success: true,
      analysis: {
        url: attributes.url,
        riskScore,
        riskLevel,
        categories,
        stats: {
          malicious: stats.malicious,
          suspicious: stats.suspicious,
          harmless: stats.harmless,
          undetected: stats.undetected,
        },
        lastAnalysisDate: new Date(attributes.last_analysis_date * 1000).toISOString(),
      },
    }
  } catch (error) {
    console.error("Error processing phishing result:", error)
    return {
      success: false,
      error: "Failed to process analysis results",
    }
  }
}
