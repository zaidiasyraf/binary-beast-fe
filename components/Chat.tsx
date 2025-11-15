'use client'

import { useState } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'assistant'
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  const formatText = (text: string) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/(\d+\.)\s/g, '<br>$1 ')
      .replace(/^\s*-\s/gm, '<br>• ')
      .replace(/^<br>/, '')
  }

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    }
    setChatSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([])
  }

  const selectChat = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
    }
  }

  const updateCurrentSession = (newMessages: Message[]) => {
    if (currentSessionId) {
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: newMessages, title: newMessages[0]?.text.slice(0, 30) + '...' || 'New Chat' }
          : session
      ))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Create new session if none exists
    if (!currentSessionId) {
      createNewChat()
    }

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user'
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    updateCurrentSession(newMessages)
    
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput
        })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.text()
      
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: data,
        sender: 'assistant'
      }
      
      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      updateCurrentSession(finalMessages)
    } catch (error) {
      console.error('API Error:', error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: `Error: ${error instanceof Error ? error.message : 'Network error'}`,
        sender: 'assistant'
      }
      
      const finalMessages = [...newMessages, errorMessage]
      setMessages(finalMessages)
      updateCurrentSession(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-wrapper">
      <div className="logo">
        <img src="/logo.png" alt="Logo" className="logo-icon" />
        <div className="logo-text">BB Neuro Insight</div>
      </div>
      <div className="app-container">
        <div className="sidebar">
          <button onClick={createNewChat} className="new-chat-btn">
            + New Chat
          </button>
        <div className="chat-history">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => selectChat(session.id)}
              className={`chat-item ${currentSessionId === session.id ? 'active' : ''}`}
            >
              <div className="chat-title">{session.title}</div>
              <div className="chat-date">
                {session.createdAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <strong>{message.sender === 'user' ? 'You' : 'Assistant'}:</strong>
              <div className={message.sender === 'assistant' ? 'response-container' : ''}>
                <div dangerouslySetInnerHTML={{ __html: message.sender === 'assistant' ? formatText(message.text) : message.text }} />
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
    </div>
    </div>
  )
}