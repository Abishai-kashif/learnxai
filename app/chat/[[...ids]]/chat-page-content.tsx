"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ChatArea } from "@/components/chat-area";
import { AnalyticsPanel } from "@/components/analytics-panel";
import { AuthService } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ChatPageContentProps {
  ids: Array<string>;
}

export default function ChatPageContent({ ids }: ChatPageContentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  if (ids?.length > 1) {
    throw Error("One session at a time.");
  }

  if (isLoading) {
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

  return (
    <div className="flex flex-col h-screen bg-orange-50 min-w-5xl">
      <Header user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatArea user={user} />
        <AnalyticsPanel />
      </div>
    </div>
  );
}