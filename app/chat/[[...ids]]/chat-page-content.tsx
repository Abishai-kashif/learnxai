"use client";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ChatArea } from "@/components/chat-area";
import { AnalyticsPanel } from "@/components/analytics-panel";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ChatPageContentProps {
  ids: Array<string>;
}

export default function ChatPageContent({ ids }: ChatPageContentProps) {
  const { user, isLoading } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Load last active session from localStorage on component mount
  useEffect(() => {
    if (!isLoading && user) {
      try {
        const lastSessionId = localStorage.getItem('last-active-session');
        if (lastSessionId) {
          // Verify session exists in storage
          const sessions = localStorage.getItem('chat-sessions');
          if (sessions) {
            const sessionData = JSON.parse(sessions);
            const sessionExists = sessionData.find((s: any) => s.id === lastSessionId);
            if (sessionExists) {
              setCurrentSessionId(lastSessionId);
            }
          }
        }
      } catch (error) {
        console.error('Error loading last session:', error);
      } finally {
        setIsLoadingSession(false);
      }
    }
  }, [isLoading, user]);

  if (ids?.length > 1) {
    throw Error("One session at a time.");
  }

  if (isLoading || isLoadingSession) {
    return (
      <div className="flex flex-col h-screen bg-orange-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-slate-600 font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-orange-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-900">Authentication Error</h1>
          <p className="text-lg text-slate-600">Unable to load user data. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  const handleSelectSession = (sessionId: string | null) => {
    setCurrentSessionId(sessionId);
    // Save last active session to localStorage
    if (sessionId) {
      localStorage.setItem('last-active-session', sessionId);
    } else {
      localStorage.removeItem('last-active-session');
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    localStorage.removeItem('last-active-session');
  };

  return (
    <div className="flex flex-col h-screen bg-orange-50 min-w-5xl">
      <Header user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onSelectSession={handleSelectSession}
          currentSessionId={currentSessionId}
          onNewChat={handleNewChat}
        />
        <ChatArea 
          user={user} 
          currentSessionId={currentSessionId}
          onSessionChange={handleSelectSession}
          onNewChat={handleNewChat}
        />
        <AnalyticsPanel />
      </div>
    </div>
  );
}