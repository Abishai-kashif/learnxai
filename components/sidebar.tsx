"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, BarChart3 } from "lucide-react";
import { GiProgression } from "react-icons/gi";
import { IoIosChatbubbles } from "react-icons/io";
import Link from "next/link";

type Session = {
  id: string;
  title: string;
  messages: string[];
};

export function Sidebar() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sessions");
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Start new chat
  const handleNewChat = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: "Untitled",
      messages: [],
    };
    setSessions([...sessions, newSession]);
    setCurrentSession(newSession);
  };

  // Add message
  const handleSendMessage = (text: string) => {
    if (!currentSession) {
      // agar koi session nahi hai to naya banao
      handleNewChat();
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSession?.id
          ? {
              ...s,
              title: s.messages.length === 0 ? text : s.title, // pehla msg hi title banega
              messages: [...s.messages, text],
            }
          : s
      )
    );

    setCurrentSession((prev) =>
      prev
        ? {
            ...prev,
            title: prev.messages.length === 0 ? text : prev.title,
            messages: [...prev.messages, text],
          }
        : null
    );
  };

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
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10"
          onClick={handleNewChat}
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

        <Button variant="ghost" className="w-full justify-start gap-3 h-10">
          <GiProgression className="h-4 w-4" />
          Progress Analytics
        </Button>
      </div>

      {/* Sessions List */}
      <div className="mt-4 px-4 space-y-2 overflow-y-auto flex-1">
        {sessions.map((s) => (
          <Button
            key={s.id}
            variant={currentSession?.id === s.id ? "secondary" : "ghost"}
            className="w-full justify-start h-9 text-sm"
            onClick={() => setCurrentSession(s)}
          >
            {s.title}
          </Button>
        ))}
      </div>

      {/* Simple Input for messages */}
      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const input = form.elements.namedItem("msg") as HTMLInputElement;
            const text = input.value.trim();
            if (text) {
              handleSendMessage(text);
              input.value = "";
            }
          }}
        >
          <input
            name="msg"
            placeholder="Type a message..."
            className="w-full border px-3 py-2 rounded-lg text-sm bg-background text-foreground"
          />
        </form>
      </div>
    </div>
  );
}
