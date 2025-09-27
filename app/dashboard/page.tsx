'use client'

import { QuizManagementDashboard } from '@/components/quiz/quiz-management-dashboard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <QuizManagementDashboard />
      </div>
    </div>
  )
}