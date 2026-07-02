"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BarChart3, CalendarDays, ChevronLeft, LibraryBig } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Back to Chat", href: "#", icon: ChevronLeft },
  { label: "All Quizzes", href: "/quizzes", icon: LibraryBig },
  { label: "Study Schedule", href: "#", icon: CalendarDays },
  { label: "Progress Analytics", href: "#", icon: BarChart3 },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="w-full max-w-[260px] shrink-0">
      <div className="sticky top-[64px] space-y-4">
        <nav aria-label="Navigation" className="rounded-lg border bg-card p-3">
          <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">Navigation</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <li key={item.label}>
                  {item.href === "/quizzes" ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-2 text-sm",
                        active ? "bg-accent text-foreground" : "hover:bg-accent",
                      )}
                    >
                      <Icon className="h-4 w-4 text-foreground/70" />
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <span
                          className="inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-semibold"
                          style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
                        >
                          6
                        </span>
                      )}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                    >
                      <Icon className="h-4 w-4 text-foreground/70" />
                      <span>{item.label}</span>
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Info / performance card */}
        <Card className="space-y-3 rounded-lg border p-4">
          <div
            className="rounded-md p-3 text-sm"
            style={{
              backgroundColor: "color-mix(in oklab, var(--brand) 16%, var(--background))",
              color: "var(--foreground)",
            }}
          >
            <p className="text-xs font-semibold text-foreground/80">Quiz Performance</p>
            <p className="mt-1 text-sm leading-relaxed">Your average score has improved by 12% this month.</p>
          </div>

          <Button className="w-full" style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}>
            View Analytics
          </Button>
        </Card>
      </div>
    </aside>
  )
}
