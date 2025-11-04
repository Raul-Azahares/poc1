'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Minimize2, Maximize2, Send, Activity, FileDown } from 'lucide-react'
import { getMedicalResponseWithGroq, generateMedicalReport } from '@/lib/medical-ai-groq'
import { generatePDF } from '@/lib/pdf-generator'
import { getUser } from '@/lib/auth'
import { getConsultations, saveConsultation, createConsultation, type Consultation, type Message } from '@/lib/consultations'

interface FloatingChatProps {
  onClose: () => void
  consultationId?: string
}

export default function FloatingChat({ onClose, consultationId }: FloatingChatProps) {
  const router = useRouter()
  const [isMinimized, setIsMinimized] = useState(false)
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) return
    setUser(currentUser)

    // Load or create consultation
    if (consultationId) {
      const consultations = getConsultations(currentUser.email)
      const existingConsultation = consultations.find(c => c.id === consultationId)
      if (existingConsultation) {
        setConsultation(existingConsultation)
      }
    } else {
      const newConsultation = createConsultation(currentUser.email)
      setConsultation(newConsultation)
      initializeChat(newConsultation)
    }
  }, [consultationId])

  useEffect(() => {
    scrollToBottom()
  }, [consultation?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeChat = async (currentConsultation: Consultation) => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: "Hello, I need a medical consultation.",
      timestamp: new Date()
    }

    const responseMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "Good day. I'm Dr. MediConsult AI. Could you please describe the primary symptoms you're experiencing?",
      timestamp: new Date()
    }

    const updatedConsultation = {
      ...currentConsultation,
      messages: [initialMessage, responseMessage]
    }

    saveConsultation(updatedConsultation)
    setConsultation(updatedConsultation)
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !consultation || isLoading) return

    setIsLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    const updatedMessages = [...consultation.messages, userMessage]
    const responseContent = await getMedicalResponseWithGroq(input, updatedMessages)

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date()
    }

    const finalMessages = [...updatedMessages, aiMessage]

    const updatedConsultation: Consultation = {
      ...consultation,
      messages: finalMessages,
      completed: false,
      title: updatedMessages[0]?.content.substring(0, 50) || 'Consultation'
    }

    saveConsultation(updatedConsultation)
    setConsultation(updatedConsultation)
    setInput('')
    setIsLoading(false)
  }

  const handleDownloadPDF = () => {
    if (!consultation || !user) return

    const report = generateMedicalReport(consultation.messages)
    generatePDF(report, user.name, consultation.createdAt)
    
    const completedConsultation: Consultation = {
      ...consultation,
      completed: true
    }
    saveConsultation(completedConsultation)
    setConsultation(completedConsultation)
  }

  const handleExpand = () => {
    if (consultation) {
      router.push(`/consultation/${consultation.id}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!consultation) return null

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="gradient-button text-white rounded-full p-4 shadow-2xl hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Activity className="w-6 h-6" />
          <span className="font-medium">Medical Chat</span>
          {consultation.messages.filter(m => m.role === 'user').length > 0 && (
            <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {consultation.messages.filter(m => m.role === 'user').length}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-[450px] h-[650px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-t-2xl p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Dr. MediConsult AI</h3>
            <p className="text-xs text-blue-100">Medical Intake Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {consultation.messages.filter(m => m.role === 'user').length >= 3 && (
            <button
              onClick={handleDownloadPDF}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Generate Report"
            >
              <FileDown className="w-5 h-5" />
            </button>
          )}
          {consultationId && (
            <button
              onClick={handleExpand}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Expand to full screen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {consultation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'gradient-button text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {consultation.messages.filter(m => m.role === 'user').length >= 3 && (
          <p className="text-xs text-blue-600 text-center mb-2">
            💡 You can generate your report using the button above
          </p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 gradient-button text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

