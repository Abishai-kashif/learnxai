import React from "react";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

function Cta() {
  return (
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4 text-balance">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-pretty">
            Join thousands of learners who are already experiencing the future of education with SuperAI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
      );
}

export default Cta;
