"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell
} from "recharts"
import { motion } from "framer-motion"

interface ChatSession {
  id: string
  title: string
  preview: string
  messageCount: number
  createdAt: string | Date
  updatedAt: string | Date
}

export default function ProgressAnalyticsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [liveMinutes, setLiveMinutes] = useState(0)

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
      } catch {
        setSessions([])
      }
    } else setSessions([])
  }

  useEffect(() => loadSessions(), [])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "chat-sessions") loadSessions()
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Live timer for current session
  useEffect(() => {
    const interval = setInterval(() => setLiveMinutes(prev => prev + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const minutesPerMessage = 5
  const totalMinutes = sessions.reduce((acc, s) => acc + s.messageCount * minutesPerMessage, 0) + liveMinutes
  const studyHours = Math.floor(totalMinutes / 60)
  const studyMinutes = totalMinutes % 60

  const totalMessages = sessions.reduce((acc, s) => acc + s.messageCount, 0)
  const avgMessages = sessions.length ? (totalMessages / sessions.length).toFixed(1) : 0

  // Expert-looking chart data with color gradient
  const chartData = sessions.map((s, idx) => ({
    name: s.title.length > 12 ? s.title.slice(0, 12) + "..." : s.title,
    messages: s.messageCount,
    time: s.messageCount * minutesPerMessage,
    fill: `hsl(${(idx / sessions.length) * 120}, 70%, 50%)` // gradient color
  }))

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900 text-white p-2 rounded-lg shadow-lg text-sm">
          <p><strong>{data.name}</strong></p>
          <p>Study Time: {data.time} min</p>
          <p>Messages: {data.messages}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full md:w-4/5 lg:w-3/4 mx-auto bg-background p-6 rounded-3xl shadow-xl space-y-8">
      {/* Header */}
      <motion.h2
        className="text-3xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Progress Analytics
      </motion.h2>

      {/* Today's Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-2xl shadow-2xl">
          <h3 className="font-semibold text-xl mb-4">Today's Progress</h3>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="w-full md:w-1/2">
              <div className="text-4xl font-extrabold">{studyHours}h {studyMinutes}m</div>
              <div className="text-sm text-orange-100">Study Time</div>
              <Progress
                value={Math.min((totalMinutes / 240) * 100, 100)}
                className="h-4 mt-3 rounded-full bg-orange-300"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="text-4xl font-extrabold">{avgMessages}%</div>
              <div className="text-sm text-orange-100">Average Understanding</div>
              <Progress
                value={Number(avgMessages)}
                className="h-4 mt-3 rounded-full bg-orange-300"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Session Analytics Chart */}
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold text-xl mb-4 text-foreground">Session Analytics</h3>
        {sessions.length ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              barGap={15}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="time" name="Study Time (min)" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-time-${index}`} fill={entry.fill} />
                ))}
              </Bar>
              <Bar dataKey="messages" name="Messages" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-msg-${index}`} fill={entry.fill.replace('50%', '70%')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground">No sessions yet.</p>
        )}
      </motion.div>

      {/* Total Time Spent */}
      <motion.div
        className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold text-xl mb-2">Total Time Spent</h3>
        <div className="text-5xl font-extrabold mb-2">
          {studyHours}h {studyMinutes}m
        </div>
        <p className="text-sm mt-1">Time spent studying across all sessions</p>
      </motion.div>
    </div>
  )
}
