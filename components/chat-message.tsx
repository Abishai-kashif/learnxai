"use client"

import { AssistantMessageProps, ChatMessageProps, QuizMessageProps, UserMessageProps } from "@/types"
import { useState } from "react"
import { FaRobot } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Trophy, Rabbit } from "lucide-react"
import ProfileImage from "./profile-image"

const ChatMessage = (props: ChatMessageProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})

  // User message variant
  if (props.role === "user") {
    const { content, user = { name: "US" } } = props as UserMessageProps
    return (
      <div className="flex gap-3 justify-end">
        <div className="bg-orange-500 text-white rounded-lg p-4 max-w-md">
          <p className="text-sm">{content}</p>
        </div>
        <ProfileImage user={user} />
      </div>
    )
  }

  // Assistant content role
  if (props.role === "assistant") {
    const { content } = props as AssistantMessageProps
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">
            <FaRobot />
          </span>
        </div>
        <div className={`flex-1`}>
          <div className="bg-muted rounded-lg p-4 mb-2 w-fit max-w-[90%]">
            <p className="text-sm text-foreground">{content}</p>
          </div>
        </div>
      </div>
    )
  }

  // Quiz content role
  if (props.role === "quiz") {
    const { content } = props as QuizMessageProps
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [quizResults, setQuizResults] = useState<{
      score: number
      total: number
      answers: Record<string, string>
    } | null>(null)

    const questions = content.questions || []
    const currentQuestion = questions[currentQuestionIndex]
    const totalQuestions = questions.length
    const selectedAnswer = selectedAnswers[currentQuestionIndex]

    const handleOptionSelect = (option: string) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: option,
      }))
    }

    const handleNext = () => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        // Quiz completed
        calculateResults()
        setQuizCompleted(true)
      }
    }

    const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1)
      }
    }

    const calculateResults = () => {
      let correctAnswers = 0
      const userAnswers: Record<string, string> = {}

      questions.forEach((question, index) => {
        const userAnswer = selectedAnswers[index]
        userAnswers[`question_${index}`] = userAnswer || ""
        if (userAnswer === question.answer) {
          correctAnswers++
        }
      })

      setQuizResults({
        score: correctAnswers,
        total: questions.length,
        answers: userAnswers,
      })
    }

    const handleRetryQuiz = () => {
      setQuizCompleted(false)
      setQuizResults(null)
      setCurrentQuestionIndex(0)
      setSelectedAnswers({})
    }

    if (quizCompleted && quizResults) {
      const percentage = Math.round((quizResults.score / quizResults.total) * 100)

      return (
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              <FaRobot />
            </span>
          </div>
          <div className="flex-1">
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-orange-600 mr-2" />
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Quiz Complete!
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
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      )
    }

    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">
            <FaRobot />
          </span>
        </div>
        <div className="flex-1">
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold"><Rabbit /></span>
                  </div>
                  <div>
                    <CardTitle className="text-foreground">
                      {content.title || "Quiz"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {totalQuestions} questions • {content.estimatedTime || "3 minutes"}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </Badge>
              </div>

              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
            </CardHeader>

            <CardContent>
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
                          id={`q${currentQuestionIndex}_option${index}`}
                        />
                        <Label
                          htmlFor={`q${currentQuestionIndex}_option${index}`}
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

              <div className="flex justify-between items-center">
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
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}

export default ChatMessage