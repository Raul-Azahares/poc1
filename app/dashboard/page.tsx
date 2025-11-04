'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, Plus, LogOut, Clock, MessageSquare, FileCheck, MessageCircle } from 'lucide-react'
import { getUser, logout } from '@/lib/auth'
import { getConsultations, createConsultation, type Consultation } from '@/lib/consultations'
import FloatingChat from '@/app/components/FloatingChat'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [showFloatingChat, setShowFloatingChat] = useState(false)
  const [floatingChatId, setFloatingChatId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push('/')
    } else {
      setUser(currentUser)
      loadConsultations(currentUser.email)
      
      // Check if we should open floating chat (from minimized consultation)
      if (typeof window !== 'undefined') {
        const shouldOpenChat = sessionStorage.getItem('openFloatingChat')
        if (shouldOpenChat) {
          setFloatingChatId(shouldOpenChat)
          setShowFloatingChat(true)
          sessionStorage.removeItem('openFloatingChat')
        }
      }
    }
  }, [router])

  const loadConsultations = (email: string) => {
    const userConsultations = getConsultations(email)
    setConsultations(userConsultations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }

  const handleNewConsultation = () => {
    if (user) {
      const newConsultation = createConsultation(user.email)
      router.push(`/consultation/${newConsultation.id}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-icon flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">MediConsult AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Hello, <span className="font-semibold">{user.name}</span></span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your medical consultations</p>
        </div>

        {/* New Consultation Card */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-dashed border-blue-300 p-12 mb-8 hover:border-blue-400 transition-colors">
          <div className="text-center">
            <button
              onClick={handleNewConsultation}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-button text-white mb-4 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-8 h-8" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">New Medical Consultation</h3>
            <p className="text-gray-600">Start a new assessment with our assistant</p>
          </div>
        </div>

        {/* Consultation History */}
        <div className="mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-800">Consultation History</h3>
        </div>

        {consultations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No consultations yet. Start your first one above!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                onClick={() => router.push(`/consultation/${consultation.id}`)}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{consultation.title}</h4>
                      {consultation.completed && (
                        <FileCheck className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{formatDate(consultation.createdAt)}</p>
                    {consultation.messages.length > 0 && (
                      <p className="text-gray-700 line-clamp-2">
                        {consultation.messages[0].content}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      <span>{consultation.messages.length} messages</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Chat Button */}
      {!showFloatingChat && (
        <button
          onClick={() => setShowFloatingChat(true)}
          className="fixed bottom-6 right-6 gradient-button text-white rounded-full p-4 shadow-2xl hover:opacity-90 transition-all hover:scale-110 z-40 flex items-center gap-2"
          title="Quick Medical Consultation"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Floating Chat Widget */}
      {showFloatingChat && (
        <FloatingChat 
          onClose={() => {
            setShowFloatingChat(false)
            setFloatingChatId(undefined)
            loadConsultations(user.email)
          }} 
          consultationId={floatingChatId}
        />
      )}
    </div>
  )
}

