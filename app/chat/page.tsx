"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { AnalyticsPanel } from "@/components/analytics-panel"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export default async function Chat() {
  const [user, setUser] = useState<null | { name: string, email: string, id: string }>({
    name: "Abishai",
    email: "abishaikashif975@gmail.com",
    id: "1"
  })

  useEffect(() => {
    async function fetchUser() {
      const BASE_URL = process.env.PYTHON_API_URL || "http://localhost:8001";
      const URL = `${BASE_URL}/me`;
      const token = localStorage.getItem('token')

      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.ok) {
        const user = await response.json()
        setUser(user)
      }
    }

    // fetchUser()
  }, []);

  return (
    <div className="flex flex-col h-screen bg-orange-50 min-w-5xl">
      <Header user={user} />

      {
        user ? (
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <ChatArea user={user} />
            <AnalyticsPanel />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold">Error</h1>
            <p className="text-lg">Something went wrong. Please try again.</p>
            <div className="flex gap-4">
              <Button className="bg-orange-500 text-foreground" onClick={() => window.location.reload()}>Refresh</Button>
              <Link href="/auth?auth=login">
                <Button className="bg-orange-500 text-foreground">Login/Signup</Button>
              </Link>
            </div>

          </div>
        )
      }
    </div>
  )
}