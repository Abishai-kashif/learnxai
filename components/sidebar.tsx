"use client";

import { Button } from "@/components/ui/button";
import { Search, BarChart3, Trash2, Clock, MessageSquare, RefreshCw } from "lucide-react";
import { GiProgression } from "react-icons/gi";
import { IoIosChatbubbles } from "react-icons/io";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChatSession } from "@/types";

export function Sidebar({ 
  onSelectSession, 
  currentSessionId,
  onNewChat 
}: { 
  onSelectSession: (sessionId: string | null) => void;
  currentSessionId: string | null;
  onNewChat: () => void;
}) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load sessions from localStorage on component mount and when sessions change
  useEffect(() => {
    loadSessions();
  }, []);

  // Add event listener for storage changes (when other tabs update sessions)
  useEffect(() => {
    const handleStorageChange = () => {
      loadSessions();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Refresh sessions when currentSessionId changes (new session created)
  useEffect(() => {
    loadSessions();
  }, [currentSessionId]);

  const loadSessions = () => {
    try {
      const stored = localStorage.getItem('chat-sessions');
      if (stored) {
        const sessionData: ChatSession[] = JSON.parse(stored).map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt)
        }));
        
        // Sort by updatedAt descending (newest first)
        const sortedSessions = sessionData.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        
        setSessions(sortedSessions);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadSessions();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewChat = () => {
    onNewChat();
  };

  const handleSelectSession = (sessionId: string) => {
    onSelectSession(sessionId);
  };

  const handleDeleteSession = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      // Remove from localStorage
      const stored = localStorage.getItem('chat-sessions');
      if (stored) {
        const allSessions = JSON.parse(stored);
        const filtered = allSessions.filter((s: any) => s.id !== sessionId);
        localStorage.setItem('chat-sessions', JSON.stringify(filtered));
      }
      
      // Update local state
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);
      
      // If deleted session was current, switch to new chat
      if (currentSessionId === sessionId) {
        onSelectSession(null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Chat Sessions</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-background text-foreground"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2 border-b border-border pb-4">
        <Button 
          onClick={handleNewChat}
          variant="ghost" 
          className="w-full justify-start gap-3 h-10"
        >
          <IoIosChatbubbles className="h-4 w-4" />
          New Chat
        </Button>

        {/* Quiz Management Section */}
        <div className="space-y-1">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-3 h-10">
              <BarChart3 className="h-4 w-4" />
              Quiz Dashboard
            </Button>
          </Link>
        </div>
           <Link href="/progress-analytics">
      <Button variant="ghost" className="w-full justify-start gap-3 h-10">
        <GiProgression className="h-4 w-4" />
        Progress Analytics
      </Button>
    </Link>
      </div>

      {/* Chat Sessions List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Recent Chats</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {sessions.length} {sessions.length === 1 ? 'chat' : 'chats'}
            </span>
          </div>
          
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                {searchTerm ? 'No matching chats found' : 'No chats yet'}
              </p>
              <p className="text-xs mt-1">
                {searchTerm ? 'Try a different search term' : 'Start a new chat to begin'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border group ${
                    currentSessionId === session.id
                      ? 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800 shadow-sm'
                      : 'border-transparent hover:bg-muted/50 hover:border-muted'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-3 w-3 text-muted-foreground" />
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {session.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-2">
                        {session.preview}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(session.updatedAt)}</span>
                          <span className="text-xs">• {formatTime(session.updatedAt)}</span>
                        </div>
                        <span className="bg-muted px-1.5 py-0.5 rounded text-xs">
                          {session.messageCount} {session.messageCount === 1 ? 'msg' : 'msgs'}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
        </div>
      </div>
    </div>
  );
}