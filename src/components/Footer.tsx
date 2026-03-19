import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter } from "lucide-react";
const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <h2 className="font-bold text-2xl">PHI AI</h2>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transform your ideas into stunning Manim animations with AI.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/workspace" className="hover:text-primary transition-colors">
                  Workspace
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to ="/pricing" className="hover:text-primary transition-colors"> Pricing</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="https://www.thinkerslabe.com/careers" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="https://www.thinkerslabe.com/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="ghttps://github.com/thinkerslabe-2026/"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/ThinkersLabe"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PHI.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
