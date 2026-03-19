import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Code2, Play, Sparkles, Zap, Layers, Wand2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useRef } from "react";
import {

  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
} from "lucide-react";

const testimonials = [
  { text: "PHI.ai transformed my teaching materials!", author: "Dr. Sarah L.", rotation: "-6deg", position: "top-20 left-8" },
  { text: "Incredible speed and quality", author: "Mike R.", rotation: "4deg", position: "top-32 right-12" },
  { text: "Finally, Manim made easy", author: "Alex K.", rotation: "-3deg", position: "bottom-48 left-16" },
  { text: "10x faster than coding manually", author: "Prof. Chen", rotation: "5deg", position: "bottom-40 right-8" },
];

const FloatingMathSymbol = ({
  symbol,
  className,
  delay = 0
}: {
  symbol: string;
  className: string;
  delay?: number;
}) => (
  <div
    className={`absolute text-primary/20 font-mono text-2xl md:text-3xl select-none pointer-events-none ${className}`}
    style={{
      animation: `float ${8 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    {symbol}
  </div>
);

const FloatingTestimonial = ({
  text,
  author,
  rotation,
  position
}: {
  text: string;
  author: string;
  rotation: string;
  position: string;
}) => (
  <div
    className={`absolute ${position} hidden lg:block max-w-[180px] p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30 shadow-lg`}
    style={{ transform: `rotate(${rotation})` }}
  >
    <p className="text-xs text-muted-foreground italic">"{text}"</p>
    <p className="text-xs text-primary mt-1 font-medium">— {author}</p>
  </div>
);

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    if (user) {
      navigate("/workspace", { state: { prompt, autoGenerate: true } });
    } else {
      navigate("/signup", { state: { prompt, autoGenerate: true } });
    }
  };
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += 5;
  };

  const skipBack = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime -= 5;
  };


  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-15px) rotate(3deg); opacity: 0.35; }
          50% { transform: translateY(-8px) rotate(-2deg); opacity: 0.25; }
          75% { transform: translateY(-20px) rotate(1deg); opacity: 0.3; }
        }
        @keyframes draw {
          0% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 200; }
        }
        @keyframes pulse-opacity {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.25; }
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(199,89%,48%)]/10 rounded-full blur-3xl" />
        </div>

        {/* Floating Math Symbols */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingMathSymbol symbol="∫" className="top-24 left-[10%]" delay={0} />
          <FloatingMathSymbol symbol="∑" className="top-40 right-[15%]" delay={1.5} />
          <FloatingMathSymbol symbol="π" className="top-60 left-[20%]" delay={2} />
          <FloatingMathSymbol symbol="∞" className="bottom-40 right-[20%]" delay={0.5} />
          <FloatingMathSymbol symbol="√" className="bottom-60 left-[8%]" delay={3} />
          <FloatingMathSymbol symbol="θ" className="top-32 right-[25%]" delay={2.5} />
          <FloatingMathSymbol symbol="Δ" className="bottom-32 right-[10%]" delay={1} />
          <FloatingMathSymbol symbol="λ" className="top-48 left-[30%]" delay={4} />
          <FloatingMathSymbol symbol="∂" className="bottom-48 left-[25%]" delay={3.5} />
          <FloatingMathSymbol symbol="φ" className="top-20 left-[45%]" delay={2.2} />

          {/* Animated SVG shapes */}
          <svg className="absolute top-28 right-[30%] w-20 h-20 text-primary/15" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="35"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="200"
              style={{ animation: 'draw 8s ease-in-out infinite' }}
            />
          </svg>
          <svg className="absolute bottom-36 left-[35%] w-16 h-16 text-primary/10" viewBox="0 0 100 100">
            <path
              d="M20,80 Q50,20 80,80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="200"
              style={{ animation: 'draw 6s ease-in-out infinite', animationDelay: '2s' }}
            />
          </svg>
          <svg className="absolute top-52 left-[5%] w-24 h-24 text-primary/10" viewBox="0 0 100 100">
            <rect
              x="20" y="20" width="60" height="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              style={{ animation: 'pulse-opacity 4s ease-in-out infinite' }}
              transform="rotate(45 50 50)"
            />
          </svg>
        </div>

        {/* Floating Testimonials */}
        {testimonials.map((t, i) => (
          <FloatingTestimonial key={i} {...t} />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Animation Generation</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Create Stunning
              <br />
              <span className="gradient-text">STEM Animations</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Transform your ideas into beautiful STEM animations with just a prompt.
              PHI.ai generates production-ready Animation code and renders videos instantly.
            </p>

            <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
              <div className="w-full relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative flex flex-col sm:flex-row gap-2 bg-background/80 backdrop-blur-xl p-2 rounded-xl border border-border/50">
                  <Textarea
                    placeholder="Describe your animation (e.g., 'A rotating 3D cube with gradient colors')"
                    className="min-h-[60px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base sm:text-lg py-3 px-4"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button
                    className="h-auto px-4 w-full sm:w-auto self-stretch sm:self-auto shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                  >
                    <span className="font-semibold text-lg">Generate</span>
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-mono">NEW</span>
                <span>Try: "Pythagorean theorem proof visualization"</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="gradient-border rounded-2xl overflow-hidden glow-effect">
              <div className="bg-card p-1">
                <div className="bg-background rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <p className="text-muted-foreground">
                      <span className="text-primary">$</span> Create a rotating 3D cube with gradient colors
                    </p>
                    <p className="text-primary animate-pulse">Generating animation...</p>
                    <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                      <pre className="text-xs text-foreground/80 overflow-x-auto">
                        {`from manim import *

class RotatingCube(ThreeDScene):
    def construct(self):
        cube = Cube(side_length=2)
        cube.set_fill(color=[BLUE, PURPLE])
        self.play(Create(cube))
        self.play(Rotate(cube, TAU, axis=UP))`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Video Placeholder */}
            <div className="relative group rounded-2xl overflow-hidden border border-border bg-card/50 aspect-video shadow-lg">

              {/* Video */}
              <video
                ref={videoRef}
                src="/phiai.mp4"
                className="w-full h-full object-cover"
                playsInline
                onClick={togglePlay}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition" />

              {/* Center Play Button (only when paused) */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur shadow-lg flex items-center justify-center border border-border/50 hover:scale-110 transition">
                    <Play className="w-7 h-7 text-primary fill-primary ml-1" />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className={`absolute bottom-3 left-3 right-3 flex items-center gap-3 px-4 py-2 rounded-xl bg-black/50 backdrop-blur transition-opacity ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>

                <button onClick={skipBack}>
                  <SkipBack className="w-5 h-5 text-white" />
                </button>

                <button onClick={togglePlay}>
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-white" />
                  )}
                </button>

                <button onClick={skipForward}>
                  <SkipForward className="w-5 h-5 text-white" />
                </button>

                <div className="ml-auto">
                  <button onClick={toggleMute}>
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Steps */}
            <div className="space-y-8">
              <div className="flex gap-4 group">
                <div className="flex-none flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors duration-300">You give prompt</h3>
                  <p className="text-muted-foreground">Simply describe your idea in plain text. Examples: "A pendingulum swinging" or "A rotating DNA helix".</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-none flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors duration-300">Our smart idea generate animation code</h3>
                  <p className="text-muted-foreground">Our intelligent system instantly translates your request into precise animation code.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-none flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors duration-300">PHI.ai converts that into video</h3>
                  <p className="text-muted-foreground">The code is magically rendered into a beautiful, high-quality video ready for you to share.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for <span className="gradient-text">Thinkers</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional STEM animations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Wand2 className="h-6 w-6" />}
              title="Natural Language Prompts"
              description="Describe your animation in plain English. Our AI understands context and creates accurate STEP animations."
            />
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Clean Video Generation"
              description="Get production-ready, well-documented Animation video with code that you can customize and extend."
            />
            <FeatureCard
              icon={<Play className="h-6 w-6" />}
              title="Instant Preview"
              description="Watch your animations render in real-time. Iterate quickly with live video previews."
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="Scene Composition"
              description="Build complex animations by combining multiple scenes and effects seamlessly."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Fast Rendering"
              description="Cloud-powered rendering delivers your videos in seconds, not minutes."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI Enhancement"
              description="Smart suggestions and automatic improvements make your animations look professional."
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Only show if user is not signed in */}
      {!user && (
        <section className="py-24 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Create Your First Animation?
              </h2>
              <p className="text-xl text-muted-foreground mb-10">
                Join thousands of thinkers using PHI.ai to bring STEM concepts to life.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="group p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default Index;
