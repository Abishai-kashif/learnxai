'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { QuizManagementDashboard } from './quiz/quiz-management-dashboard';
import { Clock, Plus, Search, BookOpen, BarChart3, Target, Settings, Edit, Trash2, Play, Users, TrendingUp, MessageSquare, Calendar, Bookmark, Monitor, Smartphone, Globe } from "lucide-react";
import { FaBookmark, FaCalendar } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { IoIosChatbubbles } from "react-icons/io";
import { MdBatteryUnknown } from "react-icons/md";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const { user, isAuthenticated } = useAuth();
  const [activeQuizSection, setActiveQuizSection] = useState('create')
  const [showQuizManagement, setShowQuizManagement] = useState(false)
  const [showQuizDashboard, setShowQuizDashboard] = useState(false);
  
  // Session history state
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionPage, setSessionPage] = useState(0);
  const [hasMoreSessions, setHasMoreSessions] = useState(true);

  // Fetch session history
  const fetchSessionHistory = async (page = 0, limit = 5) => {
    if (!isAuthenticated || isLoadingSessions) return;
    
    try {
      setIsLoadingSessions(true);
      const response = await apiClient.getSessionHistory(limit, page * limit);
      
      if (page === 0) {
        setSessionHistory(response.sessions || []);
      } else {
        setSessionHistory(prev => [...prev, ...(response.sessions || [])]);
      }
      
      setHasMoreSessions((response.sessions || []).length === limit);
    } catch (error) {
      console.error('Failed to fetch session history:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Fetch session stats
  const fetchSessionStats = async () => {
    if (!isAuthenticated) return;
    
    try {
      const stats = await apiClient.getSessionStats();
      setSessionStats(stats);
    } catch (error) {
      console.error('Failed to fetch session stats:', error);
    }
  };

  // Load session data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSessionHistory(0);
      fetchSessionStats();
    }
  }, [isAuthenticated, user]);

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Helper function to get device icon
  const getDeviceIcon = (device: string) => {
    if (device?.toLowerCase().includes('mobile') || device?.toLowerCase().includes('android') || device?.toLowerCase().includes('iphone')) {
      return <Smartphone className="h-3 w-3" />;
    }
    return <Monitor className="h-3 w-3" />;
  };

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
            onClick={() => setShowQuizDashboard(!showQuizDashboard)}
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm text-muted-foreground">Recent Sessions</h3>
          {sessionStats && (
            <Badge variant="outline" className="text-xs">
              {sessionStats.total_sessions} total
            </Badge>
          )}
        </div>
        
        {/* Session Stats Summary */}
        {sessionStats && (
          <Card className="p-3 mb-3 bg-orange-50 border-orange-200">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold text-orange-700">{formatDuration(sessionStats.total_time_minutes)}</div>
                <div className="text-orange-600">Total Time</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-700">{formatDuration(sessionStats.average_duration_minutes)}</div>
                <div className="text-orange-600">Avg Session</div>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {isLoadingSessions && sessionHistory.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-xs text-muted-foreground">Loading sessions...</div>
            </div>
          ) : sessionHistory.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-xs text-muted-foreground">No recent sessions</div>
            </div>
          ) : (
            sessionHistory.slice(0, 3).map((session, index) => (
              <Card key={session._id || index} className="p-3 hover:bg-muted/50 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getDeviceIcon(session.device_info)}
                      <h4 className="font-medium text-sm text-foreground">
                        {session.browser || 'Web Session'}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {session.ip_address || 'Unknown location'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(session.login_timestamp)}
                      </span>
                      {session.duration_minutes && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(session.duration_minutes)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge 
                    className={`text-xs border-0 ${
                      session.logout_timestamp 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {session.logout_timestamp ? 'Ended' : 'Active'}
                  </Badge>
                </div>
              </Card>
            ))
          )}
        </div>
        
        {sessionHistory.length > 3 && (
          <Button 
            variant="link" 
            className="p-0 mt-2 text-xs"
            onClick={() => {
              const nextPage = sessionPage + 1;
              setSessionPage(nextPage);
              fetchSessionHistory(nextPage);
            }}
            disabled={isLoadingSessions || !hasMoreSessions}
          >
            {isLoadingSessions ? 'Loading...' : 'Load more'}
          </Button>
        )}
      </div>

      {/* Upgrade Section */}
      {/* <div className="p-4 border-t border-border">
        <Card className="p-4 bg-orange-500 text-white">
          <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
          <p className="text-sm text-orange-100 mb-3">Unlock unlimited quizzes and advanced analytics</p>
          <Button className="w-full bg-white text-orange-500 hover:bg-orange-50">Learn More</Button>
        </Card>
      </div> */}
      
      {/* Quiz Dashboard */}
      {showQuizDashboard && (
        <div className="fixed inset-0 bg-white z-50 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Quiz Management Dashboard</h1>
              <Button
                variant="outline"
                onClick={() => setShowQuizDashboard(false)}
              >
                Back to Sidebar
              </Button>
            </div>
            <QuizManagementDashboard />
          </div>
        </div>
      )}
    </div>
  )
}
