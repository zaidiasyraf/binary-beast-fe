'use client'

import { useState } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'assistant'
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user'
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/bedrock/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput
        })
      })

      const data = await response.text()
      
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: data,
        sender: 'assistant'
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <strong>{message.sender === 'user' ? 'You' : 'Assistant'}:</strong>
            <div className={message.sender === 'assistant' ? 'response-container' : ''}>
              <div>{message.text}</div>
              {message.sender === 'assistant' && (
                <button className="cta-button">
                  Send email to Ops
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant-message">
            <strong>Assistant:</strong>
            <div>Typing...</div>
          </div>
        )}
      </div>
      
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="send-button"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}