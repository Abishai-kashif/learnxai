'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Plus, Search, BookOpen, BarChart3, Target, Settings, Edit, Trash2, Play, Users, TrendingUp, MessageSquare, Calendar, Bookmark } from "lucide-react";
import { FaBookmark, FaCalendar } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { IoIosChatbubbles } from "react-icons/io";
import { MdBatteryUnknown } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const router = useRouter()
  const [activeQuizSection, setActiveQuizSection] = useState('create')
  const [showQuizManagement, setShowQuizManagement] = useState(false)

  // Mock quiz data - in real app, this would come from API
  const quizzes = [
    {
      id: "1",
      title: "JavaScript Fundamentals",
      topic: "Programming",
      difficulty: "Beginner",
      questions: 10,
      completions: 45,
      avgScore: 78,
      createdAt: "2024-01-15",
      status: "active"
    },
    {
      id: "2", 
      title: "React Hooks Deep Dive",
      topic: "Frontend",
      difficulty: "Intermediate",
      questions: 15,
      completions: 23,
      avgScore: 82,
      createdAt: "2024-01-12",
      status: "active"
    },
    {
      id: "3",
      title: "Database Design Principles", 
      topic: "Backend",
      difficulty: "Advanced",
      questions: 20,
      completions: 12,
      avgScore: 75,
      createdAt: "2024-01-10",
      status: "draft"
    }
  ];

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
        
        {/* Quiz Management Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={() => router.push('/dashboard')}
          >
            <BarChart3 className="h-4 w-4" />
            Quiz Dashboard
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-10"
            onClick={() => setShowQuizManagement(!showQuizManagement)}
          >
            <BookOpen className="h-4 w-4" />
            Quiz Management
            <Badge
              variant="secondary"
              className="ml-auto bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
            >
              {quizzes.length}
            </Badge>
          </Button>
          
          {showQuizManagement && (
            <div className="ml-4 space-y-1 border-l-2 border-orange-200 pl-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start gap-2 h-8 text-xs"
                onClick={() => setActiveQuizSection('create')}
              >
                <Plus className="h-3 w-3" />
                Create New Quiz
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start gap-2 h-8 text-xs"
                onClick={() => setActiveQuizSection('all')}
              >
                <MdBatteryUnknown className="h-3 w-3" />
                All Quizzes ({quizzes.filter(q => q.status === 'active').length})
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start gap-2 h-8 text-xs"
                onClick={() => setActiveQuizSection('drafts')}
              >
                <Edit className="h-3 w-3" />
                Drafts ({quizzes.filter(q => q.status === 'draft').length})
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start gap-2 h-8 text-xs"
                onClick={() => setActiveQuizSection('analytics')}
              >
                <BarChart3 className="h-3 w-3" />
                Quiz Analytics
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start gap-2 h-8 text-xs"
                onClick={() => setActiveQuizSection('performance')}
              >
                <Target className="h-3 w-3" />
                Student Performance
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start gap-2 h-8 text-xs"
                onClick={() => setActiveQuizSection('settings')}
              >
                <Settings className="h-3 w-3" />
                Quiz Settings
              </Button>
            </div>
          )}
        </div>

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

      {/* Quiz Management Content */}
      {activeQuizSection && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm text-muted-foreground">
              {activeQuizSection === 'create' && 'Create New Quiz'}
              {activeQuizSection === 'all' && 'All Quizzes'}
              {activeQuizSection === 'drafts' && 'Draft Quizzes'}
              {activeQuizSection === 'analytics' && 'Quiz Analytics'}
              {activeQuizSection === 'performance' && 'Student Performance'}
              {activeQuizSection === 'settings' && 'Quiz Settings'}
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveQuizSection('')}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>

          {activeQuizSection === 'all' && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {quizzes.filter(q => q.status === 'active').map((quiz) => (
                <Card key={quiz.id} className="p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground mb-1">{quiz.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{quiz.topic} • {quiz.difficulty}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{quiz.questions} questions</span>
                        <span>{quiz.completions} completions</span>
                        <span>{quiz.avgScore}% avg</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeQuizSection === 'drafts' && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {quizzes.filter(q => q.status === 'draft').map((quiz) => (
                <Card key={quiz.id} className="p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground mb-1">{quiz.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{quiz.topic} • {quiz.difficulty}</p>
                      <Badge variant="outline" className="text-xs">Draft</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeQuizSection === 'create' && (
            <div className="space-y-3">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create from Topic
              </Button>
              <Button variant="outline" className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Import from File
              </Button>
              <Button variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Generate Adaptive Quiz
              </Button>
            </div>
          )}

          {activeQuizSection === 'analytics' && (
            <div className="space-y-3">
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{quizzes.reduce((acc, q) => acc + q.completions, 0)}</div>
                  <div className="text-xs text-muted-foreground">Total Completions</div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{Math.round(quizzes.reduce((acc, q) => acc + q.avgScore, 0) / quizzes.length)}%</div>
                  <div className="text-xs text-muted-foreground">Average Score</div>
                </div>
              </Card>
            </div>
          )}

          {activeQuizSection === 'performance' && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-2">Top Performing Topics</div>
              {['JavaScript', 'React', 'Database'].map((topic, index) => (
                <div key={topic} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="text-xs font-medium">{topic}</span>
                  <span className="text-xs text-green-600">{85 - index * 5}%</span>
                </div>
              ))}
            </div>
          )}

          {activeQuizSection === 'settings' && (
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Default Quiz Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Difficulty Algorithms
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics Preferences
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Recent Sessions */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="font-medium text-sm mb-3 text-muted-foreground">Recent Sessions</h3>
        <div className="space-y-3">
          {recentSessions.slice(0, 2).map((session, index) => (
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
        {
          recentSessions.length > 2 && (
            <Button variant={"link"} className="p-0">more</Button>
          )
        }
      </div>

      {/* Upgrade Section */}
      {/* <div className="p-4 border-t border-border">
        <Card className="p-4 bg-orange-500 text-white">
          <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
          <p className="text-sm text-orange-100 mb-3">Unlock unlimited quizzes and advanced analytics</p>
          <Button className="w-full bg-white text-orange-500 hover:bg-orange-50">Learn More</Button>
        </Card>
      </div> */}
    </div>
  )
}
