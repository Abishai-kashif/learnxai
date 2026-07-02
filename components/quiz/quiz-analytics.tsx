'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, Clock, Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface QuizAnalytics {
  quizId: string
  title: string
  totalAttempts: number
  completionRate: number
  averageScore: number
  averageTime: number
  difficultyDistribution: { easy: number; medium: number; hard: number }
  topicPerformance: { topic: string; score: number; attempts: number }[]
  misconceptions: { pattern: string; frequency: number; remediation: string }[]
  timeAnalysis: { question: string; avgTime: number; difficulty: string }[]
  studentProgress: { studentId: string; name: string; score: number; time: number; attempts: number }[]
}

interface AnalyticsProps {
  quizId?: string
  onQuizSelect?: (quizId: string) => void
}

export function QuizAnalytics({ quizId, onQuizSelect }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('score')
  const [loading, setLoading] = useState(false)

  // Mock data - in real app, this would come from API
  const mockAnalytics: QuizAnalytics = {
    quizId: '1',
    title: 'JavaScript Fundamentals',
    totalAttempts: 156,
    completionRate: 87.2,
    averageScore: 78.5,
    averageTime: 12.3,
    difficultyDistribution: { easy: 45, medium: 35, hard: 20 },
    topicPerformance: [
      { topic: 'Variables & Data Types', score: 85, attempts: 156 },
      { topic: 'Functions', score: 78, attempts: 142 },
      { topic: 'Objects & Arrays', score: 72, attempts: 138 },
      { topic: 'Async Programming', score: 65, attempts: 125 },
      { topic: 'DOM Manipulation', score: 80, attempts: 134 }
    ],
    misconceptions: [
      { 
        pattern: 'Confusing let vs var scope', 
        frequency: 23, 
        remediation: 'Review block scope concepts and provide interactive examples' 
      },
      { 
        pattern: 'Misunderstanding async/await', 
        frequency: 18, 
        remediation: 'Practice with Promise chains and async function exercises' 
      },
      { 
        pattern: 'Array method confusion', 
        frequency: 15, 
        remediation: 'Create visual guides for map, filter, reduce differences' 
      }
    ],
    timeAnalysis: [
      { question: 'Variable declaration syntax', avgTime: 45, difficulty: 'easy' },
      { question: 'Function hoisting behavior', avgTime: 120, difficulty: 'medium' },
      { question: 'Promise chain execution', avgTime: 180, difficulty: 'hard' },
      { question: 'Object destructuring', avgTime: 90, difficulty: 'medium' }
    ],
    studentProgress: [
      { studentId: '1', name: 'Alice Johnson', score: 92, time: 8.5, attempts: 1 },
      { studentId: '2', name: 'Bob Smith', score: 78, time: 15.2, attempts: 2 },
      { studentId: '3', name: 'Carol Davis', score: 85, time: 11.8, attempts: 1 },
      { studentId: '4', name: 'David Wilson', score: 65, time: 18.7, attempts: 3 },
      { studentId: '5', name: 'Eva Brown', score: 88, time: 9.3, attempts: 1 }
    ]
  }

  useEffect(() => {
    if (quizId) {
      fetchAnalytics(quizId)
    }
  }, [quizId, selectedTimeframe])

  const fetchAnalytics = async (id: string) => {
    setLoading(true)
    try {
      // In real app, this would be an API call
      // const response = await fetch(`/api/assessment/quiz-analytics/${id}?timeframe=${selectedTimeframe}`)
      // const data = await response.json()
      
      // Using mock data for now
      setTimeout(() => {
        setAnalytics(mockAnalytics)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Analytics Available</h3>
        <p className="text-muted-foreground">Select a quiz to view detailed analytics and insights.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quiz Analytics</h2>
          <p className="text-muted-foreground">{analytics.title}</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
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
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Attempts</p>
              <p className="text-2xl font-bold">{analytics.totalAttempts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{analytics.completionRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
                {analytics.averageScore}%
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
              <p className="text-sm text-muted-foreground">Average Time</p>
              <p className="text-2xl font-bold">{analytics.averageTime}m</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Topic Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Topic Performance</h3>
        <div className="space-y-3">
          {analytics.topicPerformance.map((topic, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{topic.topic}</h4>
                <p className="text-sm text-muted-foreground">{topic.attempts} attempts</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${topic.score}%` }}
                  ></div>
                </div>
                <span className={`font-medium ${getScoreColor(topic.score)}`}>
                  {topic.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Misconceptions Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Common Misconceptions
        </h3>
        <div className="space-y-4">
          {analytics.misconceptions.map((misconception, index) => (
            <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{misconception.pattern}</h4>
                <Badge variant="outline">{misconception.frequency} students</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{misconception.remediation}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Time Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Question Time Analysis</h3>
        <div className="space-y-3">
          {analytics.timeAnalysis.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{item.question}</h4>
                <Badge className={getDifficultyColor(item.difficulty)}>{item.difficulty}</Badge>
              </div>
              <div className="text-right">
                <p className="font-medium">{item.avgTime}s</p>
                <p className="text-sm text-muted-foreground">avg time</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Student Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Student Progress</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Student</th>
                <th className="text-left py-2">Score</th>
                <th className="text-left py-2">Time</th>
                <th className="text-left py-2">Attempts</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.studentProgress.map((student) => (
                <tr key={student.studentId} className="border-b">
                  <td className="py-3">{student.name}</td>
                  <td className={`py-3 font-medium ${getScoreColor(student.score)}`}>
                    {student.score}%
                  </td>
                  <td className="py-3">{student.time}m</td>
                  <td className="py-3">{student.attempts}</td>
                  <td className="py-3">
                    {student.score >= 80 ? (
                      <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                    ) : student.score >= 60 ? (
                      <Badge className="bg-yellow-100 text-yellow-700">Good</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">Needs Improvement</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Difficulty Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Question Difficulty Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(analytics.difficultyDistribution).map(([difficulty, percentage]) => (
            <div key={difficulty} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      difficulty === 'easy' ? 'text-green-500' :
                      difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
                    }
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={`${percentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{percentage}%</span>
                </div>
              </div>
              <p className="text-sm font-medium capitalize">{difficulty}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}