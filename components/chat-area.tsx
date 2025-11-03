"use client";

import { Button } from "@/components/ui/button";
import { PROMPT_SUGGESTIONS } from "@/contants";
import { parseJSON } from "@/lib/utils";
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
import { ChatMessageProps, QuizQuestions, AssistantMessageProps, UserMessageProps, User, Session, StoredSession } from "@/types";

interface ChatAreaProps {
  user: User;
  currentSessionId: string | null;
  onSessionChange: (sessionId: string | null) => void;
  onNewChat: () => void;
}

export function ChatArea({ user, currentSessionId, onSessionChange, onNewChat }: ChatAreaProps) {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [session, setSession] = useState<Session>([]);
  const [currentResponse, setCurrentResponse] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Load sessions from localStorage on component mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Load session when currentSessionId changes
  useEffect(() => {
    if (currentSessionId) {
      loadSession(currentSessionId);
    } else {
      setSession([]);
    }
  }, [currentSessionId]);

  const loadSessions = () => {
    try {
      const stored = localStorage.getItem('chat-sessions');
      if (stored) {
        const sessionData: StoredSession[] = JSON.parse(stored);
        setSessions(sessionData);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadSession = (sessionId: string) => {
    try {
      const stored = localStorage.getItem('chat-sessions');
      if (stored) {
        const sessionData: StoredSession[] = JSON.parse(stored);
        const session = sessionData.find(s => s.id === sessionId);
        if (session) {
          setSession(session.messages);
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

const saveSession = (messages: Session, sessionId?: string): string => {
  try {
    const id = sessionId || generateSessionId();
    const title = generateSessionTitle(messages);
    const preview = generateSessionPreview(messages);
    const now = new Date().toISOString();
    
    const sessionData: StoredSession = {
      id,
      title,
      preview,
      createdAt: sessionId ? getSessionCreationTime(sessionId) : now,
      updatedAt: now,
      messageCount: messages.length,
      messages
    };

    const existingSessions = localStorage.getItem('chat-sessions');
    let sessions: StoredSession[] = existingSessions ? JSON.parse(existingSessions) : [];
    
    // Remove existing session if updating
    sessions = sessions.filter(s => s.id !== id);
    // Add updated session to beginning
    sessions.unshift(sessionData);
    
    // Keep only last 50 sessions to prevent localStorage overflow
    if (sessions.length > 50) {
      sessions = sessions.slice(0, 50);
    }
    
    localStorage.setItem('chat-sessions', JSON.stringify(sessions));
    setSessions(sessions);
    
    // Trigger storage event to notify other components (like sidebar)
    window.dispatchEvent(new Event('storage'));
    
    return id;
  } catch (error) {
    console.error('Error saving session:', error);
    return generateSessionId();
  }
};

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateSessionTitle = (messages: Session): string => {
    const userMessage = messages.find(msg => msg.role === 'user');
    if (userMessage) {
      const content = (userMessage as UserMessageProps).content;
      return content.length > 30 ? content.substring(0, 30) + '...' : content;
    }
    return 'New Chat';
  };

  const generateSessionPreview = (messages: Session): string => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      let content = '';
      if (lastMessage.role === 'user') {
        content = (lastMessage as UserMessageProps).content;
      } else if (lastMessage.role === 'assistant') {
        content = (lastMessage as AssistantMessageProps).content;
      } else if (lastMessage.role === 'quiz') {
        content = 'Quiz generated';
      }
      
      return content.length > 50 ? content.substring(0, 50) + '...' : content;
    }
    return 'Start a conversation...';
  };

  const getSessionCreationTime = (sessionId: string): string => {
    const existingSession = sessions.find(s => s.id === sessionId);
    return existingSession ? existingSession.createdAt : new Date().toISOString();
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  const prepareApiSession = (sessionToConvert: Session): ChatMessageProps[] => {
    // Convert session to API format
    const apiSession: ChatMessageProps[] = sessionToConvert.map(item => {
      return item.role === "quiz" ? {
        role: "assistant",
        content: "Emitting generated quiz for abbreviation."
      } : item;
    });
    return apiSession;
  }

  const chat = async (apiSession: ChatMessageProps[]) => {
    try {
      const BASE_URL = process.env.PYTHON_API_URL || "http://localhost:8001";
      const URL = `${BASE_URL}/chat`;

      const _apiSession = prepareApiSession([...apiSession]);

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_apiSession)
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

            if (data.type === "raw_response_event" && data?.delta) {
              accumulatedResponse += data?.delta
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
        const quizzes = parseJSON<QuizQuestions | null>(accumulatedResponse)
        console.log('\n\nquizData:>>>  ', quizzes, '\n')

        let assistantMessage: ChatMessageProps;

        if (quizzes) {

          const estimatedTime = '2'
          const currentQuestionIndex = 0

          const quizData = {
            estimatedTime,
            currentQuestionIndex,
            ...quizzes
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
        
        const updatedSession = [...apiSession, assistantMessage];
        setSession(updatedSession);
        
        // Save session after assistant response
        // Convert null to undefined when passing currentSessionId
        const sessionId = saveSession(updatedSession, currentSessionId || undefined);
        if (sessionId && !currentSessionId) {
          // Notify parent component about new session
          onSessionChange(sessionId);
          // Save as last active session
          localStorage.setItem('last-active-session', sessionId);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request was aborted")
        return
      }

      console.error("Chat error:", error)
      const errorMessage: AssistantMessageProps = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      
      const updatedSession = [...apiSession, errorMessage];
      setSession(updatedSession);
      // Convert null to undefined when passing currentSessionId
      saveSession(updatedSession, currentSessionId || undefined);
    } finally {
      setCurrentResponse("")
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

    const updatedSession = [...session, userMessage];
    setSession(updatedSession);

    // Save session after user message and get session ID
    // Convert null to undefined when passing currentSessionId
    const sessionId = saveSession(updatedSession, currentSessionId || undefined);
    
    // If this is a new session (no currentSessionId), notify parent
    if (sessionId && !currentSessionId) {
      onSessionChange(sessionId);
      // Save as last active session
      localStorage.setItem('last-active-session', sessionId);
    }

    setInput("")
    try {
      setLoading(true)
      await chat([...updatedSession])
    } catch (e) {
      console.error("Error: ", e)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChatClick = () => {
    setInput("");
    setCurrentResponse("");
    onNewChat(); // Notify parent to reset session
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await submitMessage()
    }
  }

  // Auto-scroll when session changes or response is being generated
  useEffect(() => {
    scrollToBottom()
  }, [session, currentResponse])

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
              <span>Online</span>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div> */}
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-5">
          {
            session.length === 0 && !currentResponse ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center text-muted-foreground gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-500/10 text-orange-600 flex-center">
                  <FaRobot />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {currentSessionId ? 'Continue conversation' : 'Start a new conversation'}
                  </h3>
                  <p className="text-sm">Ask anything about learning topics, generate quizzes, or get explanations.</p>
                </div>
                {!currentSessionId && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setInput(PROMPT_SUGGESTIONS.EXPLAIN_RECURSION)}>Try: Explain recursion</Button>
                    <Button size="sm" variant="outline" onClick={() => setInput(PROMPT_SUGGESTIONS.CREATE_JS_QUIZ)}>Create a JS quiz</Button>
                    <Button size="sm" variant="outline" onClick={() => setInput(PROMPT_SUGGESTIONS.SUMMARIZE_GRADIENT_DESCENT)}>Summarize a concept</Button>
                  </div>
                )}
              </div>
            ) : (
              session.map((message, index) => {
                return <ChatMessage
                  key={`${message.role}_${index}`}
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
              />
            )
          }
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-start gap-3">
          <Button 
            size="sm" 
            variant="ghost" 
            className="mt-2"
            onClick={handleNewChatClick}
          >
            <span className="text-lg"><Plus /></span>
          </Button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setInput(e.target.value)
                // Auto-resize textarea
                const textarea = e.target as HTMLTextAreaElement
                textarea.style.height = 'auto'
                textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
              }}
              placeholder="Ask me anything or continue our conversation..."
              rows={1}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 bg-background text-foreground resize-none overflow-hidden min-h-[48px] max-h-[120px] leading-relaxed"
              style={{ height: 'auto' }}
            />
            <Button
              size="sm"
              onClick={submitMessage}
              disabled={loading || input.trim().length === 0}
              className="absolute right-2 top-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
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