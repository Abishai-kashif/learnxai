import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Award, CheckCircle, Clock } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalQuizzes: number
    averageScore: number
    passedQuizzes: number
    studyTime: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-orange-500 text-white rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold">{stats.totalQuizzes}</span>
            <Calendar className="h-6 w-6 opacity-70" />
          </div>
          <p className="text-sm mt-2 opacity-90">Total Quizzes</p>
        </CardContent>
      </Card>
      
      <Card className="bg-green-500 text-white rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold">{stats.averageScore}%</span>
            <Award className="h-6 w-6 opacity-70" />
          </div>
          <p className="text-sm mt-2 opacity-90">Average Score</p>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-500 text-white rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold">{stats.passedQuizzes}</span>
            <CheckCircle className="h-6 w-6 opacity-70" />
          </div>
          <p className="text-sm mt-2 opacity-90">Passed Quizzes</p>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-500 text-white rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold">{stats.studyTime}h</span>
            <Clock className="h-6 w-6 opacity-70" />
          </div>
          <p className="text-sm mt-2 opacity-90">Study Time</p>
        </CardContent>
      </Card>
    </div>
  )
}