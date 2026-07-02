'use client'

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Brain, Clock, Target, TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StudentProgress {
  studentId: string
  name: string
  email: string
  totalQuizzes: number
  completedQuizzes: number
  averageScore: number
  totalTimeSpent: number
  masteryLevel: 'beginner' | 'intermediate' | 'advanced'
  strongTopics: string[]
  weakTopics: string[]
  recentActivity: {
    quizId: string
    quizTitle: string
    score: number
    timeSpent: number
    completedAt: string
    misconceptions: string[]
  }[]
  learningPath: {
    topic: string
    progress: number
    nextRecommendation: string
  }[]
  achievements: {
    id: string
    title: string
    description: string
    earnedAt: string
    icon: string
  }[]
}

interface StudentProgressProps {
  studentId?: string
  onStudentSelect?: (studentId: string) => void
}

export function StudentProgress({ studentId, onStudentSelect }: StudentProgressProps) {
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [timeframe, setTimeframe] = useState('30d')
  const [loading, setLoading] = useState(false)

  // Mock data - in real app, this would come from API
  const mockProgress: StudentProgress = {
    studentId: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    totalQuizzes: 25,
    completedQuizzes: 23,
    averageScore: 87.5,
    totalTimeSpent: 420, // minutes
    masteryLevel: 'intermediate',
    strongTopics: ['JavaScript Basics', 'React Components', 'CSS Flexbox'],
    weakTopics: ['Async Programming', 'Database Design', 'Testing'],
    recentActivity: [
      {
        quizId: '1',
        quizTitle: 'JavaScript Fundamentals',
        score: 92,
        timeSpent: 15,
        completedAt: '2024-01-20T10:30:00Z',
        misconceptions: ['Variable hoisting']
      },
      {
        quizId: '2',
        quizTitle: 'React Hooks',
        score: 78,
        timeSpent: 22,
        completedAt: '2024-01-19T14:15:00Z',
        misconceptions: ['useEffect dependencies', 'State updates']
      },
      {
        quizId: '3',
        quizTitle: 'CSS Grid Layout',
        score: 95,
        timeSpent: 12,
        completedAt: '2024-01-18T09:45:00Z',
        misconceptions: []
      }
    ],
    learningPath: [
      {
        topic: 'JavaScript Fundamentals',
        progress: 95,
        nextRecommendation: 'Advanced JavaScript Concepts'
      },
      {
        topic: 'React Basics',
        progress: 85,
        nextRecommendation: 'React State Management'
      },
      {
        topic: 'CSS Styling',
        progress: 90,
        nextRecommendation: 'CSS Animations'
      },
      {
        topic: 'Backend Development',
        progress: 45,
        nextRecommendation: 'API Design Patterns'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Quiz Master',
        description: 'Completed 20+ quizzes',
        earnedAt: '2024-01-15T12:00:00Z',
        icon: '🏆'
      },
      {
        id: '2',
        title: 'Perfect Score',
        description: 'Achieved 100% on a quiz',
        earnedAt: '2024-01-10T15:30:00Z',
        icon: '⭐'
      },
      {
        id: '3',
        title: 'Fast Learner',
        description: 'Completed quiz in under 10 minutes',
        earnedAt: '2024-01-08T11:20:00Z',
        icon: '⚡'
      }
    ]
  }

  useEffect(() => {
    if (studentId) {
      fetchStudentProgress(studentId)
    }
  }, [studentId, timeframe])

  const fetchStudentProgress = async (id: string) => {
    setLoading(true)
    try {
      // In real app, this would be an API call
      // const response = await fetch(`/api/assessment/student-progress/${id}?timeframe=${timeframe}`)
      // const data = await response.json()
      
      // Using mock data for now
      setTimeout(() => {
        setProgress(mockProgress)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch student progress:', error)
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'advanced': return 'bg-purple-100 text-purple-700'
      case 'intermediate': return 'bg-blue-100 text-blue-700'
      case 'beginner': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading student progress...</p>
        </div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Student Selected</h3>
        <p className="text-muted-foreground">Select a student to view their detailed progress and analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-orange-600">
              {progress.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{progress.name}</h2>
            <p className="text-muted-foreground">{progress.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">
                {Math.round((progress.completedQuizzes / progress.totalQuizzes) * 100)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(progress.averageScore)}`}>
                {progress.averageScore}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Spent</p>
              <p className="text-2xl font-bold">{formatTime(progress.totalTimeSpent)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Brain className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mastery Level</p>
              <Badge className={getMasteryColor(progress.masteryLevel)}>
                {progress.masteryLevel}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Learning Path Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Learning Path Progress</h3>
        <div className="space-y-4">
          {progress.learningPath.map((path, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{path.topic}</h4>
                <span className="text-sm font-medium">{path.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${path.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Next: {path.nextRecommendation}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Strong Topics
          </h3>
          <div className="space-y-2">
            {progress.strongTopics.map((topic, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Areas for Improvement
          </h3>
          <div className="space-y-2">
            {progress.weakTopics.map((topic, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Quiz Activity</h3>
        <div className="space-y-4">
          {progress.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{activity.quizTitle}</h4>
                <p className="text-sm text-muted-foreground">
                  Completed {formatDate(activity.completedAt)}
                </p>
                {activity.misconceptions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Misconceptions:</p>
                    <div className="flex flex-wrap gap-1">
                      {activity.misconceptions.map((misconception, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {misconception}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getScoreColor(activity.score)}`}>
                  {activity.score}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(activity.timeSpent)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {progress.achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl">{achievement.icon}</div>
              <div>
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(achievement.earnedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <h4 className="font-medium text-blue-800">Focus on Async Programming</h4>
            <p className="text-sm text-blue-700">
              Based on recent quiz results, consider reviewing Promise chains and async/await patterns.
            </p>
          </div>
          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
            <h4 className="font-medium text-green-800">Excellent Progress in React</h4>
            <p className="text-sm text-green-700">
              You're ready for advanced React topics like Context API and custom hooks.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <h4 className="font-medium text-yellow-800">Practice Testing Concepts</h4>
            <p className="text-sm text-yellow-700">
              Consider taking quizzes on unit testing and test-driven development.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}