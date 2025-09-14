import React from "react";
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react";

function Testimonials() {
  return (
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Join thousands of learners who have transformed their education with SuperAI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Computer Science Student",
                content:
                  "SuperAI helped me understand complex algorithms in ways my textbooks never could. The personalized explanations are incredible!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Data Scientist",
                content:
                  "As a professional looking to upskill, SuperAI's adaptive learning has been a game-changer. I've learned more in 3 months than in years of traditional courses.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "High School Teacher",
                content:
                  "I use SuperAI to supplement my teaching. My students love the interactive lessons and I love seeing their improved engagement.",
                rating: 5,
              },
              {
                name: "David Kim",
                role: "Marketing Manager",
                content:
                  "Learning new skills while working full-time seemed impossible until I found SuperAI. The flexible, AI-powered approach fits perfectly into my schedule.",
                rating: 5,
              },
              {
                name: "Lisa Thompson",
                role: "Graduate Student",
                content:
                  "The real-time feedback feature has dramatically improved my research skills. SuperAI doesn't just teach - it mentors.",
                rating: 5,
              },
              {
                name: "James Wilson",
                role: "Software Engineer",
                content:
                  "I've tried many learning platforms, but SuperAI's AI tutor feels like having a personal mentor available 24/7. Absolutely revolutionary!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-pretty">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  );
}

export default Testimonials;
