'use client'

import { QuizManagementDashboard } from '@/components/quiz/quiz-management-dashboard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="container mx-auto p-4 md:p-6">
        <QuizManagementDashboard />
      </div>
    </div>
  )
}