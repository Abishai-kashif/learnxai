"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface ChatSession {
  id: string
  title: string
  preview: string
  messageCount: number
  createdAt: string | Date
  updatedAt: string | Date
}

export function AnalyticsPanel() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [liveMinutes, setLiveMinutes] = useState(0) // live increment for current session

  // Load sessions from localStorage
  const loadSessions = () => {
    const stored = localStorage.getItem("chat-sessions")
    if (stored) {
      try {
        const parsed: ChatSession[] = JSON.parse(stored).map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
        }))
        setSessions(parsed)
      } catch (error) {
        console.error("Failed to parse chat sessions:", error)
        setSessions([])
      }
    } else {
      setSessions([])
    }
  }

  // Initial load
  useEffect(() => {
    loadSessions()
  }, [])

  // Listen for updates in other tabs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "chat-sessions") {
        loadSessions()
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Live increment timer (simulate user active time in minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMinutes(prev => prev + 1) // increment 1 minute every minute
    }, 60000) // 1 minute
    return () => clearInterval(interval)
  }, [])

  // Calculate total study time from sessions + liveMinutes
  const minutesPerMessage = 5
  const storedMinutes = sessions.reduce((acc, s) => acc + s.messageCount * minutesPerMessage, 0)
  const totalMinutes = storedMinutes + liveMinutes
  const studyHours = Math.floor(totalMinutes / 60)
  const studyMinutes = totalMinutes % 60

  // Average messages
  const totalMessages = sessions.reduce((acc, s) => acc + s.messageCount, 0)
  const avgMessages = sessions.length ? (totalMessages / sessions.length).toFixed(1) : 0

  return (
    <div className="w-80 bg-background border-l border-border overflow-y-auto">
      <div className="p-4">
        <h2 className="font-semibold mb-4 text-foreground">Learning Analytics</h2>

        {/* Today's Progress */}
        <Card className="p-4 mb-4 bg-orange-500 text-white">
          <h3 className="font-semibold mb-2">Today's Progress</h3>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-2xl font-bold">{studyHours}h {studyMinutes}m</div>
              <div className="text-sm text-orange-100">Study Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{avgMessages}%</div>
              <div className="text-sm text-orange-100">Average Messages</div>
            </div>
          </div>
        </Card>

        {/* Understanding Level */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-2 text-foreground">Understanding Level</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Average Understanding</span>
                <span className="font-medium text-foreground">{avgMessages}%</span>
              </div>
              <Progress value={Number(avgMessages)} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Time Spent */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3 text-foreground">Time Spent</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">
              {studyHours}h {studyMinutes}m
            </div>
            <div className="text-sm text-muted-foreground mb-3">Time Spent Studying</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
