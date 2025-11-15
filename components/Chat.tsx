'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

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

interface MarkdownTable {
  headers: string[]
  rows: string[][]
  beforeText: string
  afterText: string
}

interface SuggestionSection {
  mainText: string
  suggestionTitle?: string
  suggestionBody?: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [activeCtaMessageId, setActiveCtaMessageId] = useState<number | null>(null)
  const messageRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const formatText = (text: string) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/(\d+\.)\s/g, '<br>$1 ')
      .replace(/^\s*-\s/gm, '<br>• ')
      .replace(/^<br>/, '')
  }

  const extractMarkdownTable = (text: string): MarkdownTable | null => {
    const lines = text.split('\n')
    let start = -1
    let end = -1

    const isTableLine = (line: string) => /^\s*\|.*\|\s*$/.test(line.trim())

    for (let i = 0; i < lines.length; i++) {
      if (isTableLine(lines[i])) {
        start = i
        break
      }
    }

    if (start === -1) return null

    for (let i = start; i < lines.length; i++) {
      if (!isTableLine(lines[i])) {
        end = i
        break
      }
    }

    if (end === -1) end = lines.length

    const tableLines = lines.slice(start, end)
    const rows = tableLines
      .map(line =>
        line
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map(cell => cell.trim())
      )
      .filter(row => row.length)

    if (rows.length < 2) return null

    const [headerRow, ...rest] = rows
    if (!rest.length) return null

    const dividerRow = rest[0]
    const dividerValid = dividerRow.every(cell => /^:?-{3,}:?$/.test(cell))
    if (!dividerValid) return null

    const dataRows = rest.slice(1).filter(row => row.some(cell => cell.length))
    if (!dataRows.length) return null

    return {
      headers: headerRow,
      rows: dataRows,
      beforeText: lines.slice(0, start).join('\n').trim(),
      afterText: lines.slice(end).join('\n').trim()
    }
  }

  const separateSuggestionSection = (text: string): SuggestionSection => {
    const suggestionRegex = /(Suggestions?[^:\n]*:)/i
    const match = suggestionRegex.exec(text)

    if (!match) {
      return { mainText: text.trim() }
    }

    const startIndex = match.index
    const rawLabel = match[1] ?? ''
    const label = rawLabel.replace(/:$/, '').trim()
    const mainText = text.slice(0, startIndex).trim()
    const suggestionBody = text.slice(startIndex + rawLabel.length).trim()

    return {
      mainText,
      suggestionTitle: label || 'Suggestions',
      suggestionBody
    }
  }

  const renderAssistantContent = (text: string) => {
    const { mainText, suggestionTitle, suggestionBody } = separateSuggestionSection(text)
    const tableData = extractMarkdownTable(mainText)
    const hasMainContent = Boolean(mainText)

    return (
      <>
        {tableData ? (
          <div className="structured-response">
            {tableData.beforeText && (
              <div dangerouslySetInnerHTML={{ __html: formatText(tableData.beforeText) }} />
            )}
            <div className="structured-table-wrapper">
              <table className="structured-table">
                <thead>
                  <tr>
                    {tableData.headers.map((header, index) => (
                      <th key={`${header}-${index}`}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`cell-${rowIndex}-${cellIndex}`}>
                          <div dangerouslySetInnerHTML={{ __html: formatText(cell) }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tableData.afterText && (
              <div dangerouslySetInnerHTML={{ __html: formatText(tableData.afterText) }} />
            )}
          </div>
        ) : (
          hasMainContent && (
            <div dangerouslySetInnerHTML={{ __html: formatText(mainText) }} />
          )
        )}

        {suggestionBody && (
          <div className="suggestion-block">
            <div className="suggestion-header">
              <span className="suggestion-pill">{suggestionTitle || 'Suggestions'}</span>
              <span className="suggestion-hint">AI recommended</span>
            </div>
            <div
              className="suggestion-body"
              dangerouslySetInnerHTML={{ __html: formatText(suggestionBody) }}
            />
          </div>
        )}
      </>
    )
  }

  const createNewChat = (): string => {
    const newSessionId = crypto.randomUUID()
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    }
    setChatSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSessionId)
    setMessages([])
    return newSessionId
  }

  const selectChat = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
    }
  }

  const updateCurrentSession = (newMessages: Message[], sessionIdOverride?: string) => {
    const targetSessionId = sessionIdOverride ?? currentSessionId
    if (targetSessionId) {
      setChatSessions(prev => prev.map(session => 
        session.id === targetSessionId
          ? { ...session, messages: newMessages, title: newMessages[0]?.text.slice(0, 30) + '...' || 'New Chat' }
          : session
      ))
    }
  }

  const toggleCtaDropdown = (messageId: number) => {
    setActiveCtaMessageId(prev => (prev === messageId ? null : messageId))
  }

  const handleCtaSelect = (action: string) => {
    console.log(`CTA selected: ${action}`)
    setActiveCtaMessageId(null)
  }

  const captureAssistantMessage = async (messageId: number) => {
    const target = messageRefs.current[messageId]
    if (!target) return

    try {
      const canvas = await html2canvas(target, {
        backgroundColor: null,
        scale: 2
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `assistant-message-${messageId}.png`
      link.click()
    } catch (error) {
      console.error('Failed to capture assistant message', error)
    } finally {
      setActiveCtaMessageId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Create new session if none exists
    const activeSessionId = currentSessionId ?? createNewChat()

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user'
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    updateCurrentSession(newMessages, activeSessionId)
    
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': activeSessionId
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
      updateCurrentSession(finalMessages, activeSessionId)
    } catch (error) {
      console.error('API Error:', error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: `Error: ${error instanceof Error ? error.message : 'Network error'}`,
        sender: 'assistant'
      }
      
      const finalMessages = [...newMessages, errorMessage]
      setMessages(finalMessages)
      updateCurrentSession(finalMessages, activeSessionId)
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
          {messages.map((message) => {
            if (message.sender === 'assistant') {
              return (
                <div key={message.id} className="assistant-interaction">
                  <div
                    className="message assistant-message"
                    ref={el => {
                      messageRefs.current[message.id] = el
                    }}
                  >
                    <strong>Assistant:</strong>
                    <div className="response-container">
                      {renderAssistantContent(message.text)}
                    </div>
                  </div>
                  <div className="cta-container">
                    <button
                      type="button"
                      className="cta-button"
                      onClick={() => toggleCtaDropdown(message.id)}
                      aria-expanded={activeCtaMessageId === message.id}
                      aria-label="Open quick actions"
                    >
                      <span className="cta-button-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 4l4 4h-3v4h-2V8H8l4-4zm-6 10h12v6H6v-6z" />
                        </svg>
                      </span>
                    </button>
                    {activeCtaMessageId === message.id && (
                      <div className="cta-dropup">
                        {[
                          {
                            id: 'gallery',
                            label: 'Download Snapshot',
                            icon: '/gallery.png',
                            handler: () => captureAssistantMessage(message.id)
                          },
                          {
                            id: 'gchat',
                            label: 'Google Chat',
                            icon: '/gchat.png',
                            handler: () => handleCtaSelect('Google Chat')
                          },
                          {
                            id: 'calendar',
                            label: 'Calendar',
                            icon: '/calender.png',
                            handler: () => handleCtaSelect('Calendar')
                          },
                          {
                            id: 'gmail',
                            label: 'Gmail',
                            icon: '/gmail.png',
                            handler: () => handleCtaSelect('Gmail')
                          }
                        ].map(action => (
                          <button
                            key={action.id}
                            type="button"
                            className="cta-icon"
                            onClick={action.handler}
                            aria-label={action.label}
                          >
                            <img src={action.icon} alt={action.label} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            }

            return (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <strong>{message.sender === 'user' ? 'You' : 'Assistant'}:</strong>
                <div>
                  <div>{message.text}</div>
                </div>
              </div>
            )
          })}
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
