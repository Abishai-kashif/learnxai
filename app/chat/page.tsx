import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { AnalyticsPanel } from "@/components/analytics-panel"

export default function Chat() {
  return (
    <div className="flex flex-col h-screen bg-orange-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatArea />
        <AnalyticsPanel />
      </div>
    </div>
  )
}