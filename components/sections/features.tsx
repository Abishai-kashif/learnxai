import React from "react";
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Target, Zap } from "lucide-react";

function Features() {
  return (
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Smarter Learning</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover how our AI-powered platform revolutionizes the way you learn and grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
                  <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Zap className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Personalized Learning</h3>
                <p className="text-muted-foreground text-pretty">
                  AI adapts to your learning style, pace, and preferences to create a unique educational experience
                  tailored just for you.
                </p>
              </CardContent>
            </Card>

                  <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Target className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Real-time Feedback</h3>
                <p className="text-muted-foreground text-pretty">
                  Get instant feedback on your progress with detailed explanations and suggestions for improvement.
                </p>
              </CardContent>
            </Card>

                  <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <BookOpen className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Interactive Content</h3>
                <p className="text-muted-foreground text-pretty">
                  Engage with dynamic lessons, quizzes, and simulations that make learning fun and memorable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  )
}

export default Features;
