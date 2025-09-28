'use client'

import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  BookOpen,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { QuizCards } from '../quiz-dashboard/quiz-cards'
import { QuizCreator } from './quiz-creator'
import QuizGenerationDialog from "../quiz-generator-dialog"

interface Quiz {
  id: string
  title: string
  score: number
}

export function QuizManagementDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [showQuizCreator, setShowQuizCreator] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true)

        const BASE_URL = "http://localhost:8001";
        const URL = `${BASE_URL}/quizzes`;

        const response = await fetch(URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch quizzes')
        }

        const data = await response.json()

        if (data) {
          console.log("\n\nfetchQuizzes >>>>>>>>>>> ", data)
        }
        setQuizzes(data)
      } catch (error) {
        console.error('Error fetching quizzes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes();
  }, [])

  // const handleQuizCreated = (newQuiz: any) => {
  //   setQuizzes(prev => [...prev, { ...newQuiz, id: Date.now().toString() }])
  //   setShowQuizCreator(false)
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz management dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Modern Header */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 transition-colors">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Quiz Management
                  </h1>
                  <p className="text-muted-foreground text-lg">Create, manage, and analyze your educational content</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-border hover:bg-accent" asChild>
                <Link href="/chat">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Chat
                </Link>
              </Button>
              <Button onClick={() => setShowQuizCreator(true)} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>
          </div>
        </div>

        {/* Quiz Cards */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 transition-colors">
          <QuizCards quizzes={quizzes} />
        </div>

      {/* Quiz Creator Modal */}
      {showQuizCreator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Create New Quiz</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuizCreator(false)}
                className="hover:bg-accent"
              >
                ×
              </Button>
            </div>
            <div className="p-6">
                <QuizGenerationDialog open={showQuizCreator} onOpenChange={setShowQuizCreator} />
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}