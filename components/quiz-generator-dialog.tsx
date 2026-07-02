"use client";

import { useRef, useState, useId } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, FileText, Link as LinkIcon, ArrowLeft, ArrowRight, Trophy, Circle, Check, Save } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaRobot } from "react-icons/fa"; // Assuming FaRobot is available
import { parseJSON } from "@/lib/utils";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

type QuizMessageResponse = QuizQuestion[];

interface QuizQuestions {
  title: string;
  questions: QuizMessageResponse;
}

interface QuizGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuizGenerationDialog({
  open,
  onOpenChange,
}: QuizGenerationDialogProps) {
  const [textContent, setTextContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestions | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    total: number;
    answers: Record<string, string>;
    detailedAnswers: Array<{
      question_index: number;
      question: string;
      selected_answer: string;
      correct_answer: string;
      is_correct: boolean;
    }>;
  } | null>(null);
  const quizId = useId();
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateQuiz = async (payload: FormData) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    const API_URL = `${BASE_URL}/quizzes`;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: payload,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseMode = response.headers.get("X-Response-Mode");

      if (responseMode == "error") {
        const error = await response.json();
        setErrorMessage(error?.message || "An error occurred");
        return null;
      }

      return (await response.json()) as QuizQuestions;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError")
        console.log("Request was aborted");
      else {
        console.log("Error: ", error);
        setErrorMessage((error as Error)?.message || "An unexpected error occurred");
      }
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFromText = async () => {
    if (!textContent.trim()) {
      console.log("Text content is empty");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    setGeneratedQuiz(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setQuizResults(null);

    const formData = new FormData();
    formData.append("source", textContent);

    const data = await generateQuiz(formData);
    console.log('data: response from generateQuiz: >>>>>>', data);

    if (data) {
      setGeneratedQuiz(data);
    }

    setIsGenerating(false);
    setTextContent("");
  };

  const handleGenerateFromLink = async () => {
    if (!linkUrl.trim()) {
      console.error("Link URL is empty");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    setGeneratedQuiz(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setQuizResults(null);

    const formData = new FormData();
    formData.append("source", linkUrl);

    const data = await generateQuiz(formData);

    if (data) {
      setGeneratedQuiz(data);
    }

    setLinkUrl("");
    setIsGenerating(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    setErrorMessage("");
    setGeneratedQuiz(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setQuizResults(null);

    const formData = new FormData();
    formData.append("file", file);

    const data = await generateQuiz(formData);

    if (data) {
      setGeneratedQuiz(data);
    }

    setIsGenerating(false);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (generatedQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (generatedQuiz) {
      calculateResults();
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    if (!generatedQuiz) return;

    let correctAnswers = 0;
    const userAnswers: Record<string, string> = {};
    const detailedAnswers: Array<{
      question_index: number;
      question: string;
      selected_answer: string;
      correct_answer: string;
      is_correct: boolean;
    }> = [];

    generatedQuiz.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index] || "";
      const isCorrect = userAnswer === question.answer;
      
      userAnswers[`question_${index}`] = userAnswer;
      if (isCorrect) correctAnswers++;

      detailedAnswers.push({
        question_index: index,
        question: question.question,
        selected_answer: userAnswer,
        correct_answer: question.answer,
        is_correct: isCorrect,
      });
    });

    setQuizResults({
      score: correctAnswers,
      total: generatedQuiz.questions.length,
      answers: userAnswers,
      detailedAnswers,
    });
  };

  const handleRetryQuiz = () => {
    setQuizCompleted(false);
    setQuizResults(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
  };

  const saveQuiz = async () => {
    if (quizSaved || isSaving || !generatedQuiz) return;

    setIsSaving(true);
    try {
      const dbQuiz = {
        title: generatedQuiz.title || "Generated Quiz",
        questions: generatedQuiz.questions || [],
        estimatedTime: 5,
        userId: "",
      };

      // Simulate saveUserQuiz API call (replace with actual implementation)
      const response = { ok: true }; // Placeholder
      console.log('Save quiz result:', response);
      if (response.ok) {
        setQuizSaved(true);
        console.log('Quiz saved successfully');
      } else {
        console.error('Failed to save quiz:');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const questions = generatedQuiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {generatedQuiz ? generatedQuiz.title || "Generated Quiz" : "Generate Quiz"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            {generatedQuiz
              ? `Answer the ${totalQuestions} questions below.`
              : "Choose a method to generate quiz questions from your content."}
          </DialogDescription>
        </DialogHeader>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {!generatedQuiz && (
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" disabled={isGenerating}>Text</TabsTrigger>
              <TabsTrigger value="link" disabled={isGenerating}>Link</TabsTrigger>
              <TabsTrigger value="file" disabled={isGenerating}>File</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="pt-4">
              <Label htmlFor="text-content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Text Content
              </Label>
              <Textarea
                id="text-content"
                placeholder="Paste your text content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="mt-2 min-h-[200px] resize-none"
                disabled={isGenerating}
              />
              <Button
                onClick={handleGenerateFromText}
                disabled={!textContent.trim() || isGenerating}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate from Text
                  </>
                )}
              </Button>
            </TabsContent>
            <TabsContent value="link" className="pt-4">
              <Label htmlFor="link-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                URL or Link
              </Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com/article"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="mt-2"
                disabled={isGenerating}
              />
              <Button
                onClick={handleGenerateFromLink}
                disabled={!linkUrl.trim() || isGenerating}
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Generate from Link
                  </>
                )}
              </Button>
            </TabsContent>
            <TabsContent value="file" className="pt-4">
              <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload File
              </Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                className="mt-2"
                disabled={isGenerating}
              />
              {isGenerating && (
                <div className="mt-4 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  <span className="ml-2">Uploading and generating...</span>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
        {generatedQuiz && !quizCompleted && (
          <div className="mt-4">
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold"><FaRobot /></span>
                    </div>
                    <div>
                      <CardTitle className="text-foreground">
                        {generatedQuiz.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {totalQuestions} questions • 5 minutes
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
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
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
        )}
        {quizCompleted && quizResults && (
          <div className="mt-4">
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
                    {Math.round((quizResults.score / quizResults.total) * 100)}%
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
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating || quizCompleted}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}