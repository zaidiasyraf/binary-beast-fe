import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const response = await fetch('http://Binarybeast-be-2-env.eba-ygepewfy.ap-southeast-1.elasticbeanstalk.com/api/bedrock/chat/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      timeout: 10000
    })

    if (!response.ok) {
      console.error(`API returned ${response.status}: ${response.statusText}`)
      throw new Error(`External API error: ${response.status}`)
    }

    const data = await response.json()
    return new Response(data.response, {
      headers: { 'Content-Type': 'text/plain' }
    })

  } catch (error) {
    console.error('API Error:', error)
    
    // Fallback mock response when external API is down
    const mockResponse = `I apologize, but the AI service is currently unavailable (Error 503). This is a mock response to demonstrate the chat functionality.

Your message: "${(await request.json()).message}"

Please try again later when the service is restored.`
    
    return new Response(mockResponse, {
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}