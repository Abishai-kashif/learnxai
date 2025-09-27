"use client"

import { AssistantMessageProps, ChatMessageProps, QuizMessageProps, UserMessageProps } from "@/types"
import { useState } from "react"
import { FaRobot } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Circle, ArrowLeft, ArrowRight, Trophy, Rabbit, Save, Check } from "lucide-react"
import { apiClient } from "@/lib/api"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'

const ChatMessage = (props: ChatMessageProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})

  // User message variant
  if (props.role === "user") {
    const { content, user = { name: "US" } } = props as UserMessageProps
    return (
      <div className="flex gap-3 justify-end">
        <div className="bg-orange-500 text-white rounded-lg p-4 max-w-md break-words whitespace-pre-wrap overflow-hidden">
          <p className="text-sm break-words whitespace-pre-wrap overflow-hidden">
            {content}
          </p>
        </div>
      </div>
    )
  }

  // Assistant content role with Markdown
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
            <div className="text-sm text-foreground prose prose-sm prose-orange max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !(className && className.startsWith('language-'))
                    return !isInline && match ? (
                      <SyntaxHighlighter
                        style={oneDark as any}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-muted-foreground/20 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                  h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold mt-4 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-bold mt-3 mb-2">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-base font-bold mt-3 mb-1">{children}</h4>,
                  p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="ml-4">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-orange-500 pl-4 italic my-2">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-2">
                      <table className="min-w-full border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-3 py-2 bg-muted font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-3 py-2">
                      {children}
                    </td>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-orange-600 hover:text-orange-700 underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz content role (same as before)
  if (props.role === "quiz") {
    const { content } = props as QuizMessageProps
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [quizSaved, setQuizSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
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
      
      // Start a new attempt if quiz is already saved
      if (quizSaved) {
        // We'll need to get the quiz ID from the saved quiz
        // For now, we'll start tracking when user begins answering
      }
    }

    const saveQuiz = async () => {
      if (quizSaved || isSaving) return
      
      setIsSaving(true)
      try {
        const result = await apiClient.storeQuiz({
          title: content.title || "Generated Quiz",
          estimatedTime: content.estimatedTime || "5 minutes",
          questions: content.questions || [],
          currentQuestionIndex: 0
        })
        console.log('Save quiz result:', result)
        if (result.success) {
          setQuizSaved(true)
          console.log('Quiz saved successfully with ID:', result.quiz_id)
          
          // Start quiz attempt tracking when quiz is saved
          await startQuizAttempt(result.quiz_id)
        } else {
          console.error('Failed to save quiz:', result.message)
        }
      } catch (error) {
        console.error('Error saving quiz:', error)
      } finally {
        setIsSaving(false)
      }
    }

    console.log('QuizMessage render:', { quizCompleted, quizResults, currentQuestionIndex, selectedAnswers })

    const startQuizAttempt = async (quizId: string) => {
      try {
        const result = await apiClient.startQuizAttempt(quizId)
        if (result.success) {
          setAttemptId(result.attempt_id)
          setQuizStartTime(new Date())
          console.log('Quiz attempt started with ID:', result.attempt_id)
        }
      } catch (error) {
        console.error('Error starting quiz attempt:', error)
      }
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
          quiz_id: "", // Will be set by backend
          quiz_title: content.title || "Generated Quiz",
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
                <div className="flex items-center gap-2">
                  <Button
                    onClick={saveQuiz}
                    disabled={quizSaved || isSaving}
                    variant="outline"
                    size="sm"
                    className={`${quizSaved ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300' : ''}`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-500 mr-2"></div>
                        Saving...
                      </>
                    ) : quizSaved ? (
                      <>
                        <Check className="h-3 w-3 mr-2" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-2" />
                        Save Quiz
                      </>
                    )}
                  </Button>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                    {currentQuestionIndex + 1}/{totalQuestions}
                  </Badge>
                </div>
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