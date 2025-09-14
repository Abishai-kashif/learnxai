import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Plus, Search } from "lucide-react";
import { FaBookmark, FaCalendar } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { IoIosChatbubbles } from "react-icons/io";
import { MdBatteryUnknown } from "react-icons/md";

export function Sidebar() {
  const recentSessions = [
    {
      title: "Machine Learning Basics",
      subtitle: "What is supervised learning and how does it differ from...",
      time: "2 hours ago",
      status: "Quiz Generated",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      title: "Python Data Structures",
      subtitle: "Can you explain the difference between lists and tuples...",
      time: "1 day ago",
      status: "Study Plan",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      title: "React Hooks Deep Dive",
      subtitle: "How do I use useEffect with cleanup functions...",
      time: "3 days ago",
      status: "Completed",
      statusColor: "bg-gray-100 text-gray-700",
    },
    {
      title: "Database Design Principles",
      subtitle: "What are the best practices for normalizing...",
      time: "5 days ago",
      status: "Completed",
      statusColor: "bg-purple-100 text-purple-700",
    },
  ]

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-foreground">Chat History</h2>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-background text-foreground"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3 h-10">
          <IoIosChatbubbles className="h-4 w-4" />
          New Chat
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-10">
          <MdBatteryUnknown className="h-4 w-4" />
          All Quizzes
          <Badge
            variant="secondary"
            className="ml-auto bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
          >
            9
          </Badge>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-10">
          <FaCalendar className="h-4 w-4" />
          Study Schedule
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-10">
          <GiProgression className="h-4 w-4" />
          Progress Analytics
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 h-10">
          <FaBookmark className="h-4 w-4" />
          Saved Topics
        </Button>
      </div>

      {/* Recent Sessions */}
      <div className="flex-1 p-4">
        <h3 className="font-medium text-sm mb-3 text-muted-foreground">Recent Sessions</h3>
        <div className="space-y-3">
          {recentSessions.map((session, index) => (
            <Card key={index} className="p-3 hover:bg-muted/50 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground mb-1">{session.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{session.subtitle}</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{session.time}</span>
                  </div>
                </div>
                <Badge className={`text-xs ${session.statusColor} border-0`}>{session.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Upgrade Section */}
      <div className="p-4 border-t border-border">
        <Card className="p-4 bg-orange-500 text-white">
          <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
          <p className="text-sm text-orange-100 mb-3">Unlock unlimited quizzes and advanced analytics</p>
          <Button className="w-full bg-white text-orange-500 hover:bg-orange-50">Learn More</Button>
        </Card>
      </div>
    </div>
  )
}
