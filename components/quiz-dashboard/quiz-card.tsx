import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock3, ListChecks, CheckCircle2 } from "lucide-react"

type QuizCardProps = {
  title: string
  questions: number
  duration: string
  passedTimes: number
  percent: number
}

export function QuizCard({ title, percent }: QuizCardProps) {
  return (
    <Card className="flex items-start justify-between gap-4 rounded-xl border p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">{title}</h3>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="text-right">
          <div className="text-xl font-bold leading-none" style={{ color: "var(--accent-green)" }}>
            {percent}%
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-md bg-transparent">
            Review
          </Button>
          <Button
            className="rounded-md"
            style={{ backgroundColor: "var(--accent-blue)", color: "var(--primary-foreground)" }}
          >
            Retake
          </Button>
          <Button
            variant="outline"
            className="rounded-md bg-transparent"
            style={{ borderColor: "var(--brand)", color: "var(--foreground)" }}
          >
            Share
          </Button>
        </div>
      </div>
    </Card>
  )
}