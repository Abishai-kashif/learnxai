import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Play } from "lucide-react"

export default function Hero() {
  return (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
                      Learn Anything with <span className="text-primary">AI</span>
                    </h1>
                    <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                      Transform your learning experience with personalized AI tutoring, interactive lessons, and real-time
                      feedback that adapts to your pace.
                    </p>
                  </div>
    
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                      <Play className="w-5 h-5 mr-2" />
                      Get Started Free
                    </Button>
                    <Button size="lg" variant="outline" className="px-8 bg-transparent">
                      Watch Demo
                    </Button>
                  </div>
    
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>14-day free trial</span>
                    </div>
                  </div>
                </div>
    
                <div className="relative">
                  <div className="bg-muted rounded-2xl p-8 shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">AI Learning Assistant</h3>
                        <Badge className="bg-primary text-primary-foreground">Live</Badge>
                      </div>
    
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-muted-foreground mb-2">Question:</p>
                          <p className="font-medium">Explain quantum computing in simple terms</p>
                        </div>
    
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <p className="text-sm text-primary mb-2">AI Response:</p>
                          <p className="text-sm">
                            Think of quantum computing like having a magical coin that can be both heads and tails at the
                            same time...
                          </p>
                        </div>
                      </div>
    
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Response time: 0.3s</span>
                        <span>Accuracy: 98%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  )
}