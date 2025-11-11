'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Send, Activity, FileDown, Minimize2 } from 'lucide-react'
import { getUser } from '@/lib/auth'
import { getConsultations, saveConsultation, type Consultation, type Message } from '@/lib/consultations'
import { getMedicalResponseWithGroq, generateMedicalReport } from '@/lib/medical-ai-groq'
import { generatePDFFromMessages } from '@/lib/pdf-generator'

export default function ConsultationPage() {
  const router = useRouter()
  const params = useParams()
  const consultationId = params.id as string
  
  const [user, setUser] = useState<any>(null)
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)

    // Load consultation
    const consultations = getConsultations(currentUser.email)
    const currentConsultation = consultations.find(c => c.id === consultationId)
    
    if (!currentConsultation) {
      router.push('/dashboard')
      return
    }

    setConsultation(currentConsultation)

    // Send initial message if consultation is new
    if (currentConsultation.messages.length === 0) {
      setTimeout(() => {
        handleInitialMessage(currentConsultation)
      }, 500)
    }
  }, [consultationId, router])

  useEffect(() => {
    scrollToBottom()
  }, [consultation?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleInitialMessage = async (currentConsultation: Consultation) => {
    const responseMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Hello! I'm your medical pre-consultation assistant. I can help you record how you're feeling and prepare a summary that a healthcare professional can review later. To start, tell me a bit about your condition. What brings you in today?",
      timestamp: new Date()
    }

    const updatedConsultation = {
      ...currentConsultation,
      messages: [responseMessage]
    }

    saveConsultation(updatedConsultation)
    setConsultation(updatedConsultation)
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !consultation || isLoading) return

    setIsLoading(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    const updatedMessages = [...consultation.messages, userMessage]
    
    // Get AI response (uses Groq if configured, otherwise falls back to rule-based)
    const responseContent = await getMedicalResponseWithGroq(input, updatedMessages)

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date()
    }

    const finalMessages = [...updatedMessages, aiMessage]

    // Don't auto-complete - let user decide when to generate report
    const updatedConsultation: Consultation = {
      ...consultation,
      messages: finalMessages,
      completed: false, // User will manually complete by generating report
      title: updatedMessages[0]?.content.substring(0, 50) || 'Consultation'
    }

    saveConsultation(updatedConsultation)
    setConsultation(updatedConsultation)
    setInput('')
    setIsLoading(false)
  }

  const handleDownloadPDF = () => {
    if (!consultation || !user) return

    generatePDFFromMessages(consultation.messages, consultation.createdAt)
    
    // Mark consultation as completed after generating report
    const completedConsultation: Consultation = {
      ...consultation,
      completed: true
    }
    saveConsultation(completedConsultation)
    setConsultation(completedConsultation)
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

  const handleMinimize = () => {
    // Save current state and redirect to dashboard with floating chat
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('openFloatingChat', consultationId)
    }
    router.push('/dashboard')
  }

  if (!consultation) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-icon flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-800">Medical Consultation</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMinimize}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Minimize to floating chat and return to dashboard"
              >
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Minimize</span>
              </button>
              {consultation.messages.filter(m => m.role === 'user').length >= 3 && (
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 gradient-button text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <FileDown className="w-4 h-4" />
                  {consultation.completed ? 'Download Report Again' : 'Generate & Download Report'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {consultation.messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-3 ${
                    message.role === 'user'
                      ? 'gradient-button text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
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
                <div className="bg-white rounded-2xl rounded-bl-sm px-6 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 gradient-button text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {consultation.messages.filter(m => m.role === 'user').length >= 3 && (
            <p className="text-sm text-blue-600 text-center mt-2">
              💡 Tip: You can generate your medical report at any time using the button above
            </p>
          )}
        </div>
      </div>

    </div>
  )
}

