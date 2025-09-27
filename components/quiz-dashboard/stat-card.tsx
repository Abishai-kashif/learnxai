import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: string
  icon?: ReactNode
  colorToken?: "brand" | "accent-green" | "accent-blue" | "accent-purple"
}

export function StatCard({ label, value, icon, colorToken = "brand" }: StatCardProps) {
  const bg = tokenToBg(colorToken)
  return (
    <Card
      className={cn("relative overflow-hidden rounded-xl p-4 text-sm")}
      style={{ backgroundColor: bg, color: "var(--primary-foreground)" }}
    >
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="opacity-90">{icon}</div>
      </div>
      <div className="mt-1 text-xs/5 opacity-90">{label}</div>
    </Card>
  )
}

function tokenToBg(token: StatCardProps["colorToken"]) {
  switch (token) {
    case "brand":
      return "var(--brand)"
    case "accent-green":
      return "var(--accent-green)"
    case "accent-blue":
      return "var(--accent-blue)"
    case "accent-purple":
      return "var(--accent-purple)"
  }
}
