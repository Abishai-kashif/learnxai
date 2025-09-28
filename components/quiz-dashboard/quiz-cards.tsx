"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Check, Circle, Rabbit, Trophy, X } from "lucide-react"
import { useState, useId } from "react"
import { QuizQuestion } from "@/types"
import { apiClient } from "@/lib/api"

interface QuizCardsProps {
  quizzes: {
    id: string
    title: string
    score: number
    questions?: QuizQuestion[]
    created_at?: string
  }[]
}

interface QuizModalProps {
  quiz: {
    id: string
    title: string
    questions?: QuizQuestion[]
  }
  isOpen: boolean
  onClose: () => void
}

function QuizModal({ quiz, isOpen, onClose }: QuizModalProps) {
  const quizId = useId()
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [quizResults, setQuizResults] = useState<{
    score: number
    total: number
    answers: Record<string, string>
    detailedAnswers: Array<{
      question_index: number
      question: string
      selected_answer: string
      correct_answer: string
      is_correct: boolean
      time_taken?: number
    }>
  } | null>(null)

  // Mock quiz questions if not provided
  const questions = quiz.questions || [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      answer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars"
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4"
    }
  ]

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const selectedAnswer = selectedAnswers[currentQuestionIndex]

  const handleOptionSelect = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }))
  }

  const handleNext = async () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Quiz completed
      await calculateResults()
      setQuizCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateResults = async () => {
    let correctAnswers = 0
    const userAnswers: Record<string, string> = {}
    const detailedAnswers: Array<{
      question_index: number
      question: string
      selected_answer: string
      correct_answer: string
      is_correct: boolean
      time_taken?: number
    }> = []

    questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index] || ""
      const isCorrect = userAnswer === question.answer
      
      userAnswers[`question_${index}`] = userAnswer
      if (isCorrect) {
        correctAnswers++
      }

      detailedAnswers.push({
        question_index: index,
        question: question.question,
        selected_answer: userAnswer,
        correct_answer: question.answer,
        is_correct: isCorrect
      })
    })

    const results = {
      score: correctAnswers,
      total: questions.length,
      answers: userAnswers,
      detailedAnswers
    }

    setQuizResults(results)

    // Save quiz attempt to session history
    await saveQuizAttempt(results)
  }

  const handleRetryQuiz = () => {
    setQuizCompleted(false)
    setQuizResults(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setAttemptId(null)
    setQuizStartTime(null)
  }

  const handleCloseModal = () => {
    // Reset quiz state when closing
    setQuizCompleted(false)
    setQuizResults(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setAttemptId(null)
    setQuizStartTime(null)
    onClose()
  }

  const saveQuizAttempt = async (results: any) => {
    if (!attemptId) {
      console.warn('No attempt ID available for saving quiz attempt')
      return
    }

    try {
      const timeTaken = quizStartTime ? (new Date().getTime() - quizStartTime.getTime()) / 1000 : undefined
      const percentage = (results.score / results.total) * 100

      const attemptData = {
        user_id: "", // Will be set by backend from auth
        quiz_id: quiz.id,
        quiz_title: quiz.title,
        answers: results.detailedAnswers,
        score: results.score,
        total_questions: results.total,
        percentage: percentage,
        time_taken: timeTaken,
        status: "completed"
      }

      const result = await apiClient.completeQuizAttempt(attemptId, attemptData)
      if (result.success) {
        console.log('Quiz attempt completed successfully')
      }
    } catch (error) {
      console.error('Error saving quiz attempt:', error)
    }
  }

  if (quizCompleted && quizResults) {
    const percentage = Math.round((quizResults.score / quizResults.total) * 100)

    return (
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Quiz Complete!
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseModal}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-2 border-orange-200 dark:border-orange-800">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-orange-600 mr-2" />
              <CardTitle className="text-2xl font-bold text-foreground">
                Congratulations!
              </CardTitle>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-6 max-w-md mx-auto mb-6">
              <div className="text-6xl font-bold text-orange-600 mb-2">
                {percentage}%
              </div>
              <p className="text-xl text-muted-foreground">
                You scored {quizResults.score} out of {quizResults.total}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRetryQuiz}
                variant="outline"
                className="bg-transparent"
              >
                <Circle className="h-4 w-4 mr-2" />
                Retry Quiz
              </Button>
              <Button
                onClick={handleCloseModal}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Close
              </Button>
            </div>
          </CardHeader>
        </Card>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold"><Rabbit /></span>
            </div>
            <div>
              <span className="text-foreground">{quiz.title}</span>
              <p className="text-sm text-muted-foreground">
                {totalQuestions} questions • 5 minutes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              {currentQuestionIndex + 1}/{totalQuestions}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseModal}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
          }}
        ></div>
      </div>

      <div className="space-y-6">
        {currentQuestion && (
          <div className="mb-6">
            <h4 className="font-medium mb-4 text-foreground text-lg">
              {currentQuestion.question}
            </h4>

            <RadioGroup
              value={selectedAnswer}
              onValueChange={handleOptionSelect}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${selectedAnswer === option
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                    : "border-border hover:bg-muted/50"
                    }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`${quizId}-q${currentQuestionIndex}_option${index}`}
                  />
                  <Label
                    htmlFor={`${quizId}-q${currentQuestionIndex}_option${index}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    <span className="font-medium text-muted-foreground mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-foreground">{option}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="bg-orange-500 hover:bg-orange-600"
            size="sm"
          >
            {currentQuestionIndex === totalQuestions - 1 ? (
              <>
                Finish Quiz
                <Trophy className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

export function QuizCards({ quizzes }: QuizCardsProps) {
  const [openQuizId, setOpenQuizId] = useState<string | null>(null)

  const handleRetakeQuiz = (quizId: string) => {
    setOpenQuizId(quizId)
  }

  const handleCloseModal = () => {
    setOpenQuizId(null)
  }

  // Sort quizzes by created_at date (latest first)
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    if (!a.created_at && !b.created_at) return 0
    if (!a.created_at) return 1
    if (!b.created_at) return -1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="space-y-4">
      {sortedQuizzes.map((quiz) => (
        <Card key={quiz.id} className="rounded-2xl overflow-hidden border-2 border-border hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <Rabbit className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">{quiz.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Interactive quiz • Multiple choice</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                <Trophy className="h-3 w-3 mr-1" />
                {quiz.score}%
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Circle className="h-4 w-4" />
                  <span>Ready to retake</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Dialog open={openQuizId === quiz.id} onOpenChange={(open) => !open && handleCloseModal()}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all duration-200 hover:shadow-md"
                      onClick={() => handleRetakeQuiz(quiz.id)}
                    >
                      <Circle className="h-4 w-4 mr-2" />
                      Retake Quiz
                    </Button>
                  </DialogTrigger>
                  <QuizModal 
                    quiz={quiz} 
                    isOpen={openQuizId === quiz.id} 
                    onClose={handleCloseModal} 
                  />
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}