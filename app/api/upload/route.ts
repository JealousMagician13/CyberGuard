import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.VIRUSTOTAL_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Get the upload URL from VirusTotal
    const uploadUrlResponse = await fetch("https://www.virustotal.com/api/v3/files/upload_url", {
      headers: {
        "x-apikey": apiKey,
      },
    })

    if (!uploadUrlResponse.ok) {
      return NextResponse.json({ error: "Failed to get upload URL" }, { status: 500 })
    }

    const uploadUrlData = await uploadUrlResponse.json()
    const uploadUrl = uploadUrlData.data

    // Get the file from the request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create a new FormData object for the upload
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    // Upload the file to VirusTotal
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: uploadFormData,
    })

    if (!uploadResponse.ok) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    const uploadData = await uploadResponse.json()
    const analysisId = uploadData.data.id

    // Wait for analysis to complete (poll)
    let analysisComplete = false
    let fileId = null
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
        fileId = analysisData.meta.file_info.sha256
      }
    }

    if (!fileId) {
      return NextResponse.json({ error: "Analysis timed out or failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true, fileId })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
