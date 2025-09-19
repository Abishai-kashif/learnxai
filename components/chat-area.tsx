"use client";

import {
  Download,
  MoreHorizontal,
  Plus,
  Send
} from "lucide-react";
import { useState } from "react";
import { parseJSON } from "@/lib/utils";
import { FaRobot } from "react-icons/fa";
import ChatMessage from "./chat-message";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChatMessageProps, QuizMessageResponse, AssistantMessageProps, UserMessageProps, User, Session } from "@/types";
import { PROMPT_SUGGESTIONS } from "@/contants";

export function ChatArea({ user }: { user: User }) {
  const [session, setSession] = useState<Session>([]);
  const [currentResponse, setCurrentResponse] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const chat = async (session: ChatMessageProps[]) => {
    try {
      const BASE_URL = process.env.PYTHON_API_URL || "http://localhost:8001";
      const URL = `${BASE_URL}/chat`;

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      let accumulatedResponse = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n").filter((line) => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)

            if (data.type === "raw_response_event" && data.delta) {
              accumulatedResponse += data.delta
              setCurrentResponse(accumulatedResponse)
            }
          } catch (parseError) {
            console.warn("Failed to parse streaming data:", parseError)
          }
        }
      }

      // Add the complete assistant response
      if (accumulatedResponse) {
        console.log('\n\naccumulatedResponse:>>>  ', accumulatedResponse, '\n')
        const quizzes = parseJSON<QuizMessageResponse | null>(accumulatedResponse)
        console.log('\n\nquizData:>>>  ', quizzes, '\n')

        let assistantMessage: ChatMessageProps;

        if (quizzes) {
          const title = `Here is your well crafted quiz ${user?.name || ''}`
          const estimatedTime = '2'
          const currentQuestionIndex = 0

          const quizData = {
            title,
            estimatedTime,
            currentQuestionIndex,
            questions: quizzes
          }

          assistantMessage = {
            role: "quiz",
            content: quizData
          }
        } else {
          assistantMessage = {
            role: "assistant",
            content: accumulatedResponse
          }
        }
        setSession((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted")
        return
      }

      console.error("Chat error:", error)
      const errorMessage: AssistantMessageProps = {
      // id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        // timestamp: new Date(),
      }
      setSession((prev) => [...prev, errorMessage])
    } finally {
      // setIsLoading(false)
      setCurrentResponse("")
      // abortControllerRef.current = null
    }
  }

  const submitMessage = async () => {
    const prompt = input.trim()
    if (!prompt || loading) return

    console.log('user: ', prompt)


    const userMessage: UserMessageProps = {
      role: "user",
      content: prompt
    }

    const isNewSession = session.length < 2

    const _session = [
      ...session,
      userMessage
    ]

    // if (isNewSession) {
    //   createSession(_session).then((id) => { //  j
    //     if (!id) console.error("Failed to create Session")
    //   })
    // }

    setSession(_session)
    setInput("")
    try {
      setLoading(true)
      await chat(_session)
    } catch (e) {
      console.error("Error: ", e)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await submitMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex-center text-white">
            <FaRobot />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              AI Learning Assistant
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online • Ready to help</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-5">
          {
            session.length === 0 ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-500/10 text-orange-600 flex-center">
                  <FaRobot />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Start a new conversation</h3>
                  <p className="text-sm">Ask anything about learning topics, generate quizzes, or get explanations.</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => setInput(PROMPT_SUGGESTIONS.EXPLAIN_RECURSION)}>Try: Explain recursion</Button>
                  <Button size="sm" variant="outline" onClick={() => setInput(PROMPT_SUGGESTIONS.CREATE_JS_QUIZ)}>Create a JS quiz</Button>
                  <Button size="sm" variant="outline" onClick={() => setInput(PROMPT_SUGGESTIONS.SUMMARIZE_GRADIENT_DESCENT)}>Summarize a concept</Button>
                </div>
              </div>
            ) : (
              session.map((message, index) => {
                return <ChatMessage
                  key={index}
                  {...message}
                  {...(message.role == "user" ? { user } : {})}
                />
              })
              )
          }

          {
            currentResponse && (
              <ChatMessage
                role="assistant"
                content={currentResponse}
                // user={user}
              />
            )
          }
        </div>
      </ScrollArea>
      <div />  

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost">
            <span className="text-lg"><Plus /></span>
          </Button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything or continue our conversation..."
              rows={1}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 bg-background text-foreground resize-none"
            />
            <Button
              size="sm"
              onClick={submitMessage}
              disabled={loading || input.trim().length === 0}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
