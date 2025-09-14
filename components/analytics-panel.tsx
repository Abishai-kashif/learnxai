import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Award, BookOpen, Zap, Heart, CheckCircle } from "lucide-react"

export function AnalyticsPanel() {
  return (
    <div className="w-80 bg-background border-l border-border overflow-y-auto">
      <div className="p-4">
        {/* Learning Analytics Header */}
        <h2 className="font-semibold mb-4 text-foreground">Learning Analytics</h2>

        {/* Today's Progress */}
        <Card className="p-4 mb-4 bg-orange-500 text-white">
          <h3 className="font-semibold mb-2">Today's Progress</h3>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-2xl font-bold">2.5h</div>
              <div className="text-sm text-orange-100">Study Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm text-orange-100">Quiz Average</div>
            </div>
          </div>
        </Card>

        {/* Current Topic */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-2 text-foreground">Current Topic: Machine Learning</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Understanding Level</span>
                <span className="font-medium text-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Practice Completed</span>
                <span className="font-medium text-foreground">3/5</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Recommended Next Steps */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3 text-foreground">Recommended Next Steps</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-foreground">Complete Supervised Learning Quiz</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-foreground">Explore Unsupervised Learning</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-foreground">Neural Networks Basics</span>
            </div>
          </div>
        </Card>

        {/* Recent Quiz Results */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3 text-foreground">Recent Quiz Results</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">ML Algorithms</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">92%</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">Data Structures</div>
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">87%</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">Python Basics</div>
                  <div className="text-xs text-muted-foreground">3 days ago</div>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">65%</Badge>
            </div>
          </div>
        </Card>

        {/* Study Streak */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3 text-foreground">Study Streak</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">7</div>
            <div className="text-sm text-muted-foreground mb-3">Days in a row!</div>
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((day, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index < 3 ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < 3 ? "🔥" : "○"}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Keep it up 3 more days to reach your weekly goal!</p>
          </div>
        </Card>

        {/* Recent Achievements */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-foreground">Recent Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">Quiz Master</div>
                <div className="text-xs text-muted-foreground">Completed 10 quizzes with 80%+ score</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">Fast Learner</div>
                <div className="text-xs text-muted-foreground">Completed a topic in under 2 hours</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">Consistent Learner</div>
                <div className="text-xs text-muted-foreground">7-day learning streak</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
