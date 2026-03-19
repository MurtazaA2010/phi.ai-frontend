import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Starter",
    description: "Perfect for trying out PHI.ai",
    price: "Free",
    period: "",
    icon: Sparkles,
    features: [
      "5 animations per month",
      "720p video quality",
      "Basic templates",
      "Community support",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    description: "For creators and educators",
    price: "$10",
    period: "/month",
    icon: Zap,
    features: [
      "100 animations per month",
      "1080p video quality",
      "Advanced templates",
      "Priority support",
      "Save Animations"
    ],
    cta: "Start Pro Trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and organizations",
    price: "$50",
    period: "/month",
    icon: Crown,
    features: [
      "Unlimited animations",
      "4K video quality",
      "All templates",
      "24/7 dedicated support",
      "Save Animations"
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

const Pricing = () => {
  const { user } = useAuth();
  const ctaLink = user ? "/workspace" : "/signup";
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="container mx-auto px-4 text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-muted-foreground">Simple Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Choose your <span className="gradient-text">perfect plan</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our powerful AI animation engine.
          </p>
          {/* Coming soon notice */}
          <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-400">
            <span className="text-lg">🚧</span>
            <p className="text-sm font-medium">Paid plans are not available yet. All features are currently free while we're in beta.</p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 transition-all duration-300 hover:border-primary/50 ${
                  plan.popular
                    ? "border-primary bg-gradient-to-b from-primary/10 to-transparent scale-105"
                    : "border-border/50 bg-card/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[hsl(174,72%,56%)] to-[hsl(199,89%,48%)] px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    plan.popular 
                      ? "bg-gradient-to-br from-[hsl(174,72%,56%)] to-[hsl(199,89%,48%)]" 
                      : "bg-secondary"
                  }`}>
                    <plan.icon className={`h-5 w-5 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.name === "Starter" ? (
                  <Button variant={plan.variant} className="w-full" size="lg" asChild>
                    <Link to={ctaLink}>{plan.cta}</Link>
                  </Button>
                ) : (
                  <Button variant={plan.variant} className="w-full opacity-50 cursor-not-allowed" size="lg" disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans.",
              },
              {
                q: "Is there a free trial for Pro?",
                a: "Yes! Start with a 14-day free trial of Pro. No credit card required.",
              },
              {
                q: "What happens if I exceed my limit?",
                a: "You can purchase additional credits or upgrade to a higher plan for more capacity.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border/50 bg-card/50 p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 mt-24 text-center">
          <div className="rounded-2xl border border-border/50 bg-gradient-to-b from-primary/5 to-transparent p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to create stunning animations?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of creators using PHI.ai to bring mathematics to life.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to={ctaLink}>Start Creating for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
