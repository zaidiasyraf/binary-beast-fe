import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const response = await fetch('http://Binarybeast-be-2-env.eba-ygepewfy.ap-southeast-1.elasticbeanstalk.com/api/bedrock/chat/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return new Response(data.response, {
      headers: { 'Content-Type': 'text/plain' }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch response' },
      { status: 500 }
    )
  }
}