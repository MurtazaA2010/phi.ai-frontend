import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Users, Lightbulb, Rocket } from "lucide-react";
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">PHI.ai</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              PHI.ai helps educators, students, and creators turn complex STEM ideas
              into clear, engaging animations — without coding, scripting, or technical setup.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why We Built PHI.ai</h2>

                <p className="text-muted-foreground mb-4">
                  Teaching or learning STEM concepts shouldn’t require learning
                  a programming language first. Yet most powerful animation tools
                  today are built only for developers.
                </p>

                <p className="text-muted-foreground mb-4">
                  We saw educators, students, and content creators struggling to
                  visually explain ideas they understood perfectly — simply because
                  the tools were too technical.
                </p>

                <p className="text-muted-foreground">
                  PHI.ai changes that. You describe what you want to explain in
                  plain language, and our AI turns it into a clear, accurate,
                  and beautiful animation — automatically.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard number="10K+" label="Concepts Explained Visually" />
                <StatCard number="500+" label="Educators & Creators Using PHI.ai" />
                <StatCard number="99%" label="Users Who Found It Easy to Use" />
                <StatCard number="<5s" label="From Idea to Animation" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Believe In</h2>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <ValueCard
              icon={<Target className="h-6 w-6" />}
              title="Accuracy You Can Trust"
              description="Every animation is mathematically correct, so you can teach and present with confidence."
            />

            <ValueCard
              icon={<Users className="h-6 w-6" />}
              title="No Coding Required"
              description="If you can explain it in words, you can animate it with PHI.ai."
            />

            <ValueCard
              icon={<Lightbulb className="h-6 w-6" />}
              title="Ideas First"
              description="Focus on understanding and creativity — we handle the technical complexity."
            />

            <ValueCard
              icon={<Rocket className="h-6 w-6" />}
              title="Fast & Effortless"
              description="Create professional-quality visuals in seconds instead of hours."
            />
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Who Uses PHI.ai?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-center">
            <AudienceCard
              title="Teachers & Educators"
              description="Create clear explanations and engaging lessons without learning technical tools."
            />

            <AudienceCard
              title="Students"
              description="Visualize difficult concepts instantly and understand topics faster."
            />

            <AudienceCard
              title="Content Creators"
              description="Produce high-quality STEM visuals without animation or coding skills."
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Built by People Who Care</h2>
            {/*<p className="text-muted-foreground text-lg">
              We’re a group of students, coders, and builders who struggled
              with explaining and understanding complex ideas ourselves.
            </p>*/}

            <p className="text-muted-foreground text-lg mt-4">
              PHI.ai is the tool we(ThinkersLabe) wished existed — simple, powerful, and built
              to help ideas speak for themselves.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="p-6 rounded-2xl border border-border bg-card/50 text-center">
    <div className="text-2xl font-bold gradient-text mb-1">{number}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

const ValueCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-2xl border border-border bg-card/50 text-center">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
      {icon}
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const AudienceCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-2xl border border-border bg-card/50">
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default About;
