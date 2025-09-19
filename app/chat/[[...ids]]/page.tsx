import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { AnalyticsPanel } from "@/components/analytics-panel"
import Link from "next/link"
// import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fetchCurrentSession, fetchSessions, fetchUser } from "@/db"

export default async function Chat({
  params,
}: {
  params: Promise<{ ids: Array<string> }>
}) {
  const { ids } = await params
  console.log('ids>>>> ', ids)

  if (ids?.length > 1) {
    throw Error("One session at a time.")
  }

  // const id = ids?.[0]

  const user = await fetchUser()
  console.log(user)
  // const sessions = await fetchSessions(user?.id)

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