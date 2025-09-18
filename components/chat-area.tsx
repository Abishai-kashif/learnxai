"use client";

import { Button } from "@/components/ui/button";
import {
  Download,
  MoreHorizontal,
  Plus,
  Send
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import ChatMessage from "./chat-message";
import { ScrollArea } from "./ui/scroll-area";

export function ChatArea({ user }: any) {
  const [session, setSession] = useState([{
    role: "assistant",
    content: `👋 Hello ${user.name}!\nI'm your AI learning assistant. I'm here to help you learn any topic through personalized conversations and interactive quizzes.`,
  }]);
  const [currentResponse, setCurrentResponse] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  // const abortControllerRef = useRef<AbortController | null>(null)
  // const [input, setInput] = useState("");

  // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const _input = e.target.value;
  //   setInput(_input);

  //   if (_input === "") {
  //     return;
  //   }

  //   setSession([
  //     ...session,
  //     {
  //       role: "user",
  //       content: _input
  //     }
  //   ]);

  // }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      console.log('scroll container: ', scrollContainer)
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    console.log('use effect triggered')
    scrollToBottom()
  }, [session, currentResponse])

  const chat = async (session: Array<{ role: string; content: string }>) => {
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
        try {
          accumulatedResponse = JSON.parse(accumulatedResponse)

          const assistantMessage = {
            role: "assistant",
            content: accumulatedResponse,
          }

          setSession((prev) => [...prev, assistantMessage])
        } catch (_) {
          console.log("Failed to parse assistant response")

          const assistantMessage = {
            role: "quiz",
            content: accumulatedResponse,
          }
          console.log('\n\nassistantMessage\n\n', assistantMessage, '\n\n')

          setSession((prev) => [...prev, assistantMessage])
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted")
        return
      }

      console.error("Chat error:", error)
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setSession((prev) => [...prev, errorMessage])
    } finally {
      // setIsLoading(false)
      setCurrentResponse("")
      // abortControllerRef.current = null
    }
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      const prompt = (event.target as any)?.value ?? '';

      if (prompt) {
        console.log('user: ', prompt)
        const _session = [
          ...session,
          {
            role: "user",
            content: prompt
          }
        ]

        setSession(_session)
        await chat(_session)
      }
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
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-4">
        <div className="space-y-5">
          {
            session.map((message, index) => (
              <ChatMessage
                key={index}
                variant={message.role as any}
                message={message.content}
                user={user}
              />
            ))
          }

          {
            currentResponse && (
              <ChatMessage
                variant="assistant"
                message={currentResponse}
                user={user}
              />
            )
          }
        </div>
      </ScrollArea>
      {/* <ChatMessage
          variant="user"
          message="I want to learn about machine learning algorithms. Can you help me understand the different types?"
          user={user}
        />

        <ChatMessage
          variant="assistant"
          message="👋 Hello! I'm your AI learning assistant. I'm here to help you learn any topic through personalized conversations and interactive quizzes."
        />

        <ChatMessage
          variant="quiz"
          introText="Perfect! I've generated a personalized quiz based on our conversation about machine learning algorithms."
          quizData={{
            title: "Machine Learning Algorithms Quiz",
            estimatedTime: "3 minutes",
            currentQuestion: 1,
            totalQuestions: 5,
            question: "Which type of machine learning algorithm learns from labeled training data to make predictions?",
            options: [
              "Unsupervised Learning",
              "Supervised Learning",
              "Reinforcement Learning",
              "Semi-supervised Learning"
            ]
          }}
        /> */}
      <div />  

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost">
            <span className="text-lg"><Plus /></span>
          </Button>
          <div className="flex-1 relative">
            <input
              // value={input}
              onKeyDown={handleKeyDown}
              // onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything or continue our conversation..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 bg-background text-foreground"
            />
            <Button
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600"
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
