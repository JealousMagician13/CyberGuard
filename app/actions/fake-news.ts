"use server"

// Replace with your actual Google Generative AI API key
const googleApiKey = "AIzaSyB08cJzMPIZQ4i_pVbVrL08vieu5V8Oz8w"; // <--- YOUR API KEY HERE
const modelName = "gemini-1.5-flash-latest"; // Or "gemini-pro-vision" if you need multimodal

export async function analyzeFakeNews(text: string) {
  try {
    // Check if the input text is empty or undefined
    if (!text || text.trim() === "") {
      return { success: false, error: "No text provided for analysis." };
    }

    const prompt = `
      Analyze the following text and determine if it contains fake news or misinformation.
      Consider factors such as:
      - Factual accuracy
      - Source credibility
      - Logical consistency
      - Presence of misleading statements
      - Emotional manipulation
      - Clickbait elements

      Text to analyze:
      """
      ${text}
      """

      Provide a detailed analysis with a confidence score from 0-100 where:
      - 0-30: Likely legitimate content
      - 31-70: Potentially misleading or requires fact-checking
      - 71-100: Likely fake news or misinformation

      Return ONLY a JSON object with the following structure, without any markdown formatting or code blocks:
      {
        "score": number,
        "classification": "legitimate" | "potentially misleading" | "likely fake",
        "reasoning": string,
        "keyIssues": string[],
        "recommendations": string[]
      }
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${googleApiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }],
        }],
        generationConfig: {
          temperature: 0.3, // You can adjust these parameters
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google API Error:", errorData);
      return { success: false, error: `Google API request failed: ${response.statusText}` };
    }

    const data = await response.json();
    const analysisText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from the response (same as before)
    let jsonStr = analysisText;
    const jsonMatch = analysisText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1].trim();
    }

    const analysis = JSON.parse(jsonStr);
    return { success: true, analysis };

  } catch (error) {
    console.error("Error analyzing fake news:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}