"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
// import { QuizCreator } from "./quiz-creator"
import { Plus, Filter } from "lucide-react"
import { Topbar } from "@/components/quiz-dashboard/topbar"
import { SidebarNav } from "@/components/quiz-dashboard/sidebar-nav"
import { StatCard } from "@/components/quiz-dashboard/stat-card"
import { QuizCard } from "@/components/quiz-dashboard/quiz-card"
import { CalendarDays, Trophy, CheckCircle2, Clock3 } from "lucide-react" // Import missing icons
import { QuizCreator } from "../quiz/quiz-creator"

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  questionCount: number
  timeLimit: number
  language: string
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  attempts: number
  averageScore: number
  completionRate: number
  tags: string[]
}

interface Student {
  id: string
  name: string
  email: string
  totalQuizzes: number
  averageScore: number
  lastActivity: string
}

interface DashboardStats {
  totalQuizzes: number
  activeQuizzes: number
  totalStudents: number
  totalAttempts: number
  averageScore: number
  completionRate: number
}

export function QuizManagementDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [statsData, setStatsData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [showQuizCreator, setShowQuizCreator] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data - in real app, this would come from API
  const mockQuizzes: Quiz[] = [
    {
      id: "1",
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics",
      topic: "JavaScript",
      difficulty: "easy",
      questionCount: 10,
      timeLimit: 15,
      language: "English",
      status: "published",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      attempts: 45,
      averageScore: 87.5,
      completionRate: 92,
      tags: ["javascript", "basics", "programming"],
    },
    {
      id: "2",
      title: "React Hooks Deep Dive",
      description: "Advanced concepts in React Hooks",
      topic: "React",
      difficulty: "hard",
      questionCount: 15,
      timeLimit: 25,
      language: "English",
      status: "published",
      createdAt: "2024-01-14T14:30:00Z",
      updatedAt: "2024-01-16T09:15:00Z",
      attempts: 23,
      averageScore: 73.2,
      completionRate: 78,
      tags: ["react", "hooks", "advanced"],
    },
    {
      id: "3",
      title: "CSS Grid Layout",
      description: "Master CSS Grid for modern layouts",
      topic: "CSS",
      difficulty: "medium",
      questionCount: 12,
      timeLimit: 20,
      language: "English",
      status: "draft",
      createdAt: "2024-01-18T16:45:00Z",
      updatedAt: "2024-01-18T16:45:00Z",
      attempts: 0,
      averageScore: 0,
      completionRate: 0,
      tags: ["css", "grid", "layout"],
    },
  ]

  const mockStudents: Student[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      totalQuizzes: 23,
      averageScore: 87.5,
      lastActivity: "2024-01-20T10:30:00Z",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@example.com",
      totalQuizzes: 18,
      averageScore: 79.3,
      lastActivity: "2024-01-19T15:20:00Z",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol.davis@example.com",
      totalQuizzes: 31,
      averageScore: 92.1,
      lastActivity: "2024-01-20T14:45:00Z",
    },
  ]

  const stats = [
    { label: "Total Quizzes", value: "24", color: "brand" as const, icon: <CalendarDays className="h-5 w-5" /> },
    { label: "Average Score", value: "87%", color: "accent-green" as const, icon: <Trophy className="h-5 w-5" /> },
    { label: "Passed Quizzes", value: "18", color: "accent-blue" as const, icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Study Time", value: "45h", color: "accent-purple" as const, icon: <Clock3 className="h-5 w-5" /> },
  ]

  const quizzesData = [
    {
      title: "Machine Learning Algorithms",
      questions: 8,
      duration: "21m",
      passedTimes: 3,
      percent: 92,
      generated: true,
    },
    { title: "Python Data Structures", questions: 7, duration: "19m", passedTimes: 2, percent: 87 },
    { title: "React Hooks Deep Dive", questions: 9, duration: "24m", passedTimes: 1, percent: 94 },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuizzes(mockQuizzes)
      setStudents(mockStudents)
      setStatsData(stats)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || quiz.status === filterStatus
    const matchesDifficulty = filterDifficulty === "all" || quiz.difficulty === filterDifficulty

    return matchesSearch && matchesStatus && matchesDifficulty
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700"
      case "draft":
        return "bg-yellow-100 text-yellow-700"
      case "archived":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleQuizCreated = (newQuiz: any) => {
    setQuizzes((prev) => [...prev, { ...newQuiz, id: Date.now().toString() }])
    setShowQuizCreator(false)
    setActiveTab("quizzes")
  }

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
    <div className="min-h-screen bg-background">
      {/* Top navigation to match the generated design */}
      <Topbar />

      {/* Header strip identical to /quizzes */}
      <div
        className="border-b"
        style={{
          backgroundColor: "color-mix(in oklab, var(--brand) 6%, var(--secondary))",
        }}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-pretty text-xl font-bold tracking-tight">All Quizzes</h1>
            <p className="text-sm text-muted-foreground">Track your learning progress and review past quizzes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-md bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="rounded-md bg-transparent">
              Sort by Date
            </Button>
            <Button
              className="rounded-md"
              style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
              onClick={() => setShowQuizCreator(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Quiz
            </Button>
          </div>
        </div>
      </div>

      {/* Two-column layout with sidebar + main content, reusing theme classes */}
      <main className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <SidebarNav />

        <section className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsData.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} colorToken={s.color} icon={s.icon} />
            ))}
          </div>

          {/* Quiz list */}
          <div className="space-y-4">
            {quizzesData.map((q) => (
              <QuizCard
                key={q.title}
                title={q.title}
                questions={q.questions}
                duration={q.duration}
                passedTimes={q.passedTimes}
                percent={q.percent} />
            ))}
          </div>
        </section>
      </main>

      {/* Hidden reference image for developers */}
      <div className="sr-only">
        <img src="/images/reference-quizzes.png" alt="Reference design of the quizzes dashboard" />
      </div>

      {/* Quiz Creator Modal */}
      {showQuizCreator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Create New Quiz</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowQuizCreator(false)} className="hover:bg-accent">
                ×
              </Button>
            </div>
            <div className="p-6">
              <QuizCreator onQuizCreated={handleQuizCreated} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}