import React from "react";

function Statistics() {
  return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How SuperAI Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Three simple steps to transform your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Sign Up & Assess</h3>
              <p className="text-muted-foreground text-pretty">
                Create your account and take our quick assessment to understand your learning style and goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-chart-2 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-2xl font-bold text-white">2</span>
                <div className="absolute inset-0 rounded-full border-4 border-chart-2/20"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Learn with AI</h3>
              <p className="text-muted-foreground text-pretty">
                Start learning with personalized content and AI tutoring that adapts to your progress in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-chart-3 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-2xl font-bold text-white">3</span>
                <div className="absolute inset-0 rounded-full border-4 border-chart-3/20"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-muted-foreground text-pretty">
                Monitor your achievements and get insights on your learning journey with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
}

export default Statistics;
