import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuizCardsProps {
  quizzes: {
    id: string
    title: string
    score: number
  }[]
}

export function QuizCards({ quizzes }: QuizCardsProps) {
  return (
    <div className="space-y-2">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 bg-muted/20">
            <div className="w-10 h-10 bg-muted/50 rounded-md" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{quiz.title}</h3>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-end gap-3 w-full">
              {/* <span className="text-2xl font-bold text-green-500">{quiz.score}%</span> */}
              <Button variant="ghost" className="text-muted-foreground">Review</Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Retake</Button>
              <Button variant="ghost" className="text-orange-500">Share</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}