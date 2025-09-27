'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuizCreator } from './quiz-creator'
import { QuizAnalytics } from './quiz-analytics'
import { StudentProgress } from './student-progress'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Play, 
  Pause, 
  Users, 
  BarChart3,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  Calendar,
  Award,
  Activity,
  Eye,
  Settings,
  Download
} from 'lucide-react'

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  questionCount: number
  timeLimit: number
  language: string
  status: 'draft' | 'published' | 'archived'
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
  const [activeTab, setActiveTab] = useState('overview')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [showQuizCreator, setShowQuizCreator] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data - in real app, this would come from API
  const mockQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics',
      topic: 'JavaScript',
      difficulty: 'easy',
      questionCount: 10,
      timeLimit: 15,
      language: 'English',
      status: 'published',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      attempts: 45,
      averageScore: 87.5,
      completionRate: 92,
      tags: ['javascript', 'basics', 'programming']
    },
    {
      id: '2',
      title: 'React Hooks Deep Dive',
      description: 'Advanced concepts in React Hooks',
      topic: 'React',
      difficulty: 'hard',
      questionCount: 15,
      timeLimit: 25,
      language: 'English',
      status: 'published',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-16T09:15:00Z',
      attempts: 23,
      averageScore: 73.2,
      completionRate: 78,
      tags: ['react', 'hooks', 'advanced']
    },
    {
      id: '3',
      title: 'CSS Grid Layout',
      description: 'Master CSS Grid for modern layouts',
      topic: 'CSS',
      difficulty: 'medium',
      questionCount: 12,
      timeLimit: 20,
      language: 'English',
      status: 'draft',
      createdAt: '2024-01-18T16:45:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
      attempts: 0,
      averageScore: 0,
      completionRate: 0,
      tags: ['css', 'grid', 'layout']
    }
  ]

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      totalQuizzes: 23,
      averageScore: 87.5,
      lastActivity: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      totalQuizzes: 18,
      averageScore: 79.3,
      lastActivity: '2024-01-19T15:20:00Z'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      totalQuizzes: 31,
      averageScore: 92.1,
      lastActivity: '2024-01-20T14:45:00Z'
    }
  ]

  const mockStats: DashboardStats = {
    totalQuizzes: 3,
    activeQuizzes: 2,
    totalStudents: 3,
    totalAttempts: 68,
    averageScore: 80.2,
    completionRate: 85
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuizzes(mockQuizzes)
      setStudents(mockStudents)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus
    const matchesDifficulty = filterDifficulty === 'all' || quiz.difficulty === filterDifficulty
    
    return matchesSearch && matchesStatus && matchesDifficulty
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700'
      case 'draft': return 'bg-yellow-100 text-yellow-700'
      case 'archived': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleQuizCreated = (newQuiz: any) => {
    setQuizzes(prev => [...prev, { ...newQuiz, id: Date.now().toString() }])
    setShowQuizCreator(false)
    setActiveTab('quizzes')
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
              <Button variant="outline" className="border-border hover:bg-accent">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => setShowQuizCreator(true)} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {/* Total Quizzes Card */}
            <Card className="relative bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Quizzes</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 group-hover:scale-105 transition-transform duration-300">{stats.totalQuizzes}</p>
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <TrendingUp className="h-3 w-3 animate-pulse" />
                      <span>+12% from last month</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-2xl group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Quizzes Card */}
            <Card className="relative bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800 shadow-sm hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Active Quizzes</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100 group-hover:scale-105 transition-transform duration-300">{stats.activeQuizzes}</p>
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Currently live</span>
                    </div>
                    <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-2xl group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Activity className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Students Card */}
            <Card className="relative bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Students</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 group-hover:scale-105 transition-transform duration-300">{stats.totalStudents}</p>
                    <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                      <Users className="h-3 w-3" />
                      <span>Enrolled learners</span>
                    </div>
                    <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/50 rounded-2xl group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Users className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Attempts Card */}
            <Card className="relative bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Total Attempts</p>
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 group-hover:scale-105 transition-transform duration-300">{stats.totalAttempts}</p>
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <Target className="h-3 w-3" />
                      <span>Quiz submissions</span>
                    </div>
                    <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div className="p-4 bg-orange-100 dark:bg-orange-900/50 rounded-2xl group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Target className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Score Card */}
            <Card className="relative bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/50 dark:to-yellow-900/30 border-yellow-200 dark:border-yellow-800 shadow-sm hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Average Score</p>
                    <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 group-hover:scale-105 transition-transform duration-300">{stats.averageScore}%</p>
                    <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                      <Award className="h-3 w-3" />
                      <span>Performance metric</span>
                    </div>
                    <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full animate-pulse" style={{ width: `${stats.averageScore}%` }} />
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-2xl group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Award className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate Card */}
            <Card className="relative bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/50 dark:to-indigo-900/30 border-indigo-200 dark:border-indigo-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Completion Rate</p>
                    <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 group-hover:scale-105 transition-transform duration-300">{stats.completionRate}%</p>
                    <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400">
                      <BarChart3 className="h-3 w-3" />
                      <span>Success rate</span>
                    </div>
                    <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full animate-pulse" style={{ width: `${stats.completionRate}%` }} />
                    </div>
                  </div>
                  <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <BarChart3 className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modern Main Content */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden transition-colors">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-border bg-muted/30">
              <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none py-4 px-6 font-medium transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="quizzes" 
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none py-4 px-6 font-medium transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Quizzes
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none py-4 px-6 font-medium transition-colors"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="students" 
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none py-4 px-6 font-medium transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Students
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-8 space-y-8">
              {/* Recent Activity */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">Recent Activity</h3>
                  <Button variant="outline" size="sm" className="border-border hover:bg-accent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-800 transition-colors">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">JavaScript Fundamentals quiz completed</p>
                      <p className="text-sm text-muted-foreground">Alice Johnson scored 92% • 2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">92%</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <Edit className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">React Hooks quiz updated</p>
                      <p className="text-sm text-muted-foreground">Added 3 new questions • 5 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">+3</p>
                      <p className="text-xs text-muted-foreground">Questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl border border-orange-200 dark:border-orange-800 transition-colors">
                    <div className="p-3 bg-orange-500 rounded-xl">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">CSS Grid Layout quiz created</p>
                      <p className="text-sm text-muted-foreground">Draft saved • 1 day ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">NEW</p>
                      <p className="text-xs text-muted-foreground">Draft</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Quizzes */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Top Performing Quizzes</h3>
                <div className="grid gap-4">
                  {quizzes
                    .filter(q => q.status === 'published')
                    .sort((a, b) => b.averageScore - a.averageScore)
                    .slice(0, 3)
                    .map((quiz, index) => (
                      <div key={quiz.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-bold text-lg">
                            #{index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-lg">{quiz.title}</h4>
                            <p className="text-muted-foreground">{quiz.attempts} attempts • {quiz.completionRate}% completion</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{quiz.averageScore}%</p>
                          <p className="text-sm text-muted-foreground">Average Score</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quizzes" className="p-8 space-y-8">
              {/* Enhanced Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Input
                      placeholder="Search quizzes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-border focus:border-orange-500 focus:ring-orange-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger className="w-40 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-border hover:bg-accent">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Enhanced Quiz List */}
              <div className="grid gap-6">
                {filteredQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="w-2 bg-gradient-to-b from-orange-500 to-red-500"></div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-foreground">{quiz.title}</h3>
                                <Badge className={`${getStatusColor(quiz.status)} font-medium`}>
                                  {quiz.status}
                                </Badge>
                                <Badge className={`${getDifficultyColor(quiz.difficulty)} font-medium`}>
                                  {quiz.difficulty}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">{quiz.description}</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <BookOpen className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">{quiz.questionCount}</span> questions
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4 text-green-500" />
                                  <span className="font-medium">{quiz.timeLimit}</span> min
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Users className="h-4 w-4 text-purple-500" />
                                  <span className="font-medium">{quiz.attempts}</span> attempts
                                </div>
                                {quiz.status === 'published' && (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Target className="h-4 w-4 text-orange-500" />
                                    <span className="font-medium">{quiz.averageScore}%</span> avg
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {quiz.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-border">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-6">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedQuizId(quiz.id)
                                  setActiveTab('analytics')
                                }}
                                className="hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700"
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="hover:bg-green-50 dark:hover:bg-green-950/50 hover:border-green-300 dark:hover:border-green-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:border-purple-300 dark:hover:border-purple-700">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="hover:bg-accent hover:border-border">
                                <MoreVertical className="h-4 w-4" />
                               </Button>
                             </div>
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="analytics" className="p-8">
               <QuizAnalytics quizId={selectedQuizId || undefined} />
             </TabsContent>

             <TabsContent value="students" className="p-8 space-y-8">
               {/* Enhanced Student List */}
               <div className="space-y-6">
                 <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-bold text-foreground">Student Management</h3>
                   <Button variant="outline" size="sm" className="border-border hover:bg-accent">
                     <Download className="h-4 w-4 mr-2" />
                     Export Students
                   </Button>
                 </div>
                 <div className="grid gap-4">
                   {students.map((student) => (
                     <Card key={student.id} className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
                       <CardContent className="p-6">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h3 className="font-bold text-foreground text-lg">{student.name}</h3>
                                <p className="text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8 text-sm">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-foreground">{student.totalQuizzes}</p>
                                <p className="text-muted-foreground">Quizzes</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{student.averageScore}%</p>
                                <p className="text-muted-foreground">Avg Score</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-semibold text-foreground">{formatDate(student.lastActivity)}</p>
                                <p className="text-muted-foreground">Last Active</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedStudentId(student.id)}
                                className="hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Progress
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Student Progress Detail */}
                  {selectedStudentId && (
                    <div className="mt-8">
                      <StudentProgress 
                        studentId={selectedStudentId}
                        onStudentSelect={setSelectedStudentId}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
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
              <QuizCreator onQuizCreated={handleQuizCreated} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}