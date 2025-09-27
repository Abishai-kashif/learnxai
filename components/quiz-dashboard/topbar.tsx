"use client"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex max-w-screen-2xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div aria-hidden className="h-7 w-7 rounded-md" style={{ backgroundColor: "var(--brand)" }} />
          <span className="text-sm font-semibold tracking-tight text-foreground/80">{"learnX.ai"}</span>
        </div>

        {/* Search */}
        <div className="ml-2 flex-1 max-w-2xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <Input className="pl-9" placeholder="Search quizzes, topics, or tags" />
          </div>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-4">
          <button
            className={cn(
              "relative inline-flex h-9 w-9 items-center justify-center rounded-md border",
              "bg-background hover:bg-accent",
            )}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-foreground/70" />
            <span className="sr-only">Notifications</span>
          </button>

          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none">{"Sarah Chen"}</p>
              <p className="text-xs text-muted-foreground">Premium Member</p>
            </div>
            <ChevronDown className="h-4 w-4 text-foreground/50" />
          </div>
        </div>
      </div>
    </header>
  )
}
