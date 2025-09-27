'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2, Save, Eye, BookOpen, Target, Brain, Globe } from 'lucide-react'

interface QuizQuestion {
  id: string
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  hints?: string[]
}

interface QuizCreatorProps {
  onSave?: (quiz: any) => void
  onCancel?: () => void
  onQuizCreated?: (quiz: any) => void
}

export function QuizCreator({ onSave, onCancel, onQuizCreated }: QuizCreatorProps) {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    topic: '',
    difficulty: 'medium',
    language: 'en',
    timeLimit: 30,
    questionTypes: ['multiple-choice'],
    adaptiveMode: false,
    showHints: true,
    randomizeQuestions: true
  })

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    id: '',
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'medium',
    topic: '',
    hints: ['']
  })

  const [activeTab, setActiveTab] = useState<'settings' | 'questions' | 'preview'>('settings')

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
        topic: quizData.topic
      }
      setQuestions([...questions, newQuestion])
      setCurrentQuestion({
        id: '',
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'medium',
        topic: '',
        hints: ['']
      })
    }
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const generateQuizFromAI = async () => {
    // This would call the Assessment Agent API
    try {
      const response = await fetch('/api/assessment/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizData.topic,
          difficulty: quizData.difficulty,
          questionCount: 10,
          language: quizData.language,
          questionTypes: quizData.questionTypes
        })
      })
      
      if (response.ok) {
        const generatedQuestions = await response.json()
        setQuestions(generatedQuestions)
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error)
    }
  }

  const saveQuiz = () => {
    const quiz = {
      ...quizData,
      questions,
      createdAt: new Date().toISOString(),
      status: 'draft'
    }
    onSave?.(quiz)
    onQuizCreated?.(quiz)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Assessment Quiz</h1>
          <p className="text-muted-foreground">Design adaptive quizzes with AI-powered question generation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={saveQuiz} className="bg-orange-500 hover:bg-orange-600">
            <Save className="h-4 w-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { id: 'settings', label: 'Quiz Settings', icon: BookOpen },
          { id: 'questions', label: 'Questions', icon: Brain },
          { id: 'preview', label: 'Preview', icon: Eye }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(id as any)}
            className="flex-1"
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  placeholder="Enter quiz title..."
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={quizData.description}
                  onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                  placeholder="Describe what this quiz covers..."
                />
              </div>
              <div>
                <Label htmlFor="topic">Topic/Subject</Label>
                <Input
                  id="topic"
                  value={quizData.topic}
                  onChange={(e) => setQuizData({ ...quizData, topic: e.target.value })}
                  placeholder="e.g., JavaScript, React, Mathematics..."
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quiz Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label>Difficulty Level</Label>
                <Select value={quizData.difficulty} onValueChange={(value) => setQuizData({ ...quizData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Language</Label>
                <Select value={quizData.language} onValueChange={(value) => setQuizData({ ...quizData, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={quizData.timeLimit}
                  onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Question Types</Label>
                {[
                  { id: 'multiple-choice', label: 'Multiple Choice' },
                  { id: 'true-false', label: 'True/False' },
                  { id: 'fill-blank', label: 'Fill in the Blank' },
                  { id: 'short-answer', label: 'Short Answer' }
                ].map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={quizData.questionTypes.includes(id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setQuizData({ ...quizData, questionTypes: [...quizData.questionTypes, id] })
                        } else {
                          setQuizData({ ...quizData, questionTypes: quizData.questionTypes.filter(t => t !== id) })
                        }
                      }}
                    />
                    <Label htmlFor={id}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">AI-Powered Generation</h3>
            <div className="flex items-center gap-4">
              <Button onClick={generateQuizFromAI} className="bg-orange-500 hover:bg-orange-600">
                <Target className="h-4 w-4 mr-2" />
                Generate Questions with AI
              </Button>
              <div className="text-sm text-muted-foreground">
                Let our Assessment Agent create adaptive questions based on your topic and settings
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quiz Questions ({questions.length})</h3>
            <Badge variant="outline">{questions.length} questions added</Badge>
          </div>

          {/* Add Question Form */}
          <Card className="p-6">
            <h4 className="font-medium mb-4">Add New Question</h4>
            <div className="space-y-4">
              <div>
                <Label>Question Type</Label>
                <Select value={currentQuestion.type} onValueChange={(value: any) => setCurrentQuestion({ ...currentQuestion, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  placeholder="Enter your question..."
                />
              </div>

              {currentQuestion.type === 'multiple-choice' && (
                <div>
                  <Label>Answer Options</Label>
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <RadioGroup value={currentQuestion.correctAnswer.toString()}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value={index.toString()} 
                              onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateQuestionOption(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                            />
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                  placeholder="Explain the correct answer..."
                />
              </div>

              <Button onClick={addQuestion} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </Card>

          {/* Questions List */}
          <div className="space-y-3">
            {questions.map((question, index) => (
              <Card key={question.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{question.type}</Badge>
                      <Badge variant="secondary">{question.difficulty}</Badge>
                    </div>
                    <h5 className="font-medium mb-2">Q{index + 1}: {question.question}</h5>
                    {question.options && (
                      <div className="text-sm text-muted-foreground">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className={optIndex === question.correctAnswer ? 'font-medium text-green-600' : ''}>
                            {optIndex + 1}. {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-2">{quizData.title}</h3>
            <p className="text-muted-foreground mb-4">{quizData.description}</p>
            <div className="flex gap-4 text-sm">
              <Badge>{quizData.topic}</Badge>
              <Badge variant="outline">{quizData.difficulty}</Badge>
              <Badge variant="outline">{questions.length} questions</Badge>
              <Badge variant="outline">{quizData.timeLimit} minutes</Badge>
            </div>
          </Card>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-medium">Question {index + 1}</span>
                  <Badge variant="outline">{question.type}</Badge>
                </div>
                <h4 className="font-medium mb-3">{question.question}</h4>
                {question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${optIndex === question.correctAnswer ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                        <span className={optIndex === question.correctAnswer ? 'font-medium' : ''}>{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                {question.explanation && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Explanation: </span>
                    <span className="text-sm">{question.explanation}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}