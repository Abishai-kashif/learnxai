import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Search, Brain, Send, Download, MoreHorizontal, Circle } from "lucide-react"

export function ChatArea() {
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">AI</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">AI Learning Assistant</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online • Ready to help</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* AI Welcome Message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">AI</span>
          </div>
          <div className="flex-1">
            <div className="bg-muted rounded-lg p-4 mb-2">
              <p className="text-sm text-foreground">
                👋 Hello! I'm your AI learning assistant. I'm here to help you learn any topic through personalized
                conversations and interactive quizzes.
              </p>
              <p className="text-sm mt-2 text-foreground">What would you like to explore today?</p>
            </div>
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-3 justify-end">
          <div className="bg-orange-500 text-white rounded-lg p-4 max-w-md">
            <p className="text-sm">
              I want to learn about machine learning algorithms. Can you help me understand the different types?
            </p>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">SC</AvatarFallback>
          </Avatar>
        </div>

        {/* AI Response with ML Categories */}
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">AI</span>
          </div>
          <div className="flex-1">
            <div className="bg-muted rounded-lg p-4 mb-4">
              <p className="text-sm mb-4 text-foreground">
                Excellent choice! Machine learning algorithms can be categorized into several main types. Let me break
                this down for you:
              </p>

              <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
                  <span>💡</span>
                  Main Categories of ML Algorithms
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  {/* Supervised Learning */}
                  <Card className="p-4 text-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Supervised Learning</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Learns from labeled training data to predict outcomes
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Examples: Linear Regression, Decision Trees
                    </p>
                  </Card>

                  {/* Unsupervised Learning */}
                  <Card className="p-4 text-center">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Unsupervised Learning</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Finds patterns in data without labeled examples
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Examples: K-Means, PCA</p>
                  </Card>

                  {/* Reinforcement Learning */}
                  <Card className="p-4 text-center">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Reinforcement Learning</h4>
                    <p className="text-xs text-muted-foreground mb-3">Learns through interaction and reward systems</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      Examples: Q-Learning, Policy Gradient
                    </p>
                  </Card>
                </div>
              </div>

              <p className="text-sm mb-4 text-foreground">
                Would you like me to dive deeper into any of these categories, or shall I create a quiz to test your
                understanding so far?
              </p>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 bg-transparent">
                  <span className="mr-2">📚</span>
                  Learn More About Supervised Learning
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <span className="mr-2">📝</span>
                  Generate Quiz
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* User Response */}
        <div className="flex gap-3 justify-end">
          <div className="bg-orange-500 text-white rounded-lg p-4 max-w-md">
            <p className="text-sm">That's really helpful! Can you create a quiz to test my understanding?</p>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">SC</AvatarFallback>
          </Avatar>
        </div>

        {/* AI Quiz Response */}
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">AI</span>
          </div>
          <div className="flex-1">
            <div className="bg-muted rounded-lg p-4 mb-4">
              <p className="text-sm mb-4 text-foreground">
                Perfect! I've generated a personalized quiz based on our conversation. Let's test your understanding of
                machine learning algorithms:
              </p>

              {/* Quiz Card */}
              <Card className="p-4 border-2 border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">📝</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Machine Learning Algorithms Quiz</h3>
                      <p className="text-sm text-muted-foreground">5 questions • Estimated time: 3 minutes</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">1/5</Badge>
                </div>

                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-3 text-foreground">
                    Which type of machine learning algorithm learns from labeled training data to make predictions?
                  </h4>

                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Unsupervised Learning</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <Circle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Supervised Learning</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 text-sm">
                  <Button size="sm" variant="outline">
                    Explain supervised learning examples
                  </Button>
                  <Button size="sm" variant="outline">
                    Create a study schedule
                  </Button>
                  <Button size="sm" variant="outline">
                    More practice questions
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost">
            <span className="text-lg">📎</span>
          </Button>
          <div className="flex-1 relative">
            <input
              placeholder="Ask me anything or continue our conversation..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 bg-background text-foreground"
            />
            <Button
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}
