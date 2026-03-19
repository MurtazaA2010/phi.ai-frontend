import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSheet from "./ProfileSheet";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthPage = ["/signin", "/signup"].includes(location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-2 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span>
            <img src="/logo.png" alt="Phi.ai" width={280} height={250} />
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/about" ? "text-primary" : "text-muted-foreground"
              }`}
          >
            About
          </Link>
          <Link
            to="/pricing"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
              }`}
          >
            Pricing
          </Link>

          {user && (
              <>
                <Link
                  to="/workspace"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/workspace"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Workspace
                </Link>

                <Link
                  to="/projects"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/projects"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Projects
                </Link>
              </>
            )}
        </div>

        {/* Right Side Actions */}
        {!isAuthPage && (
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <Button variant="hero" size="sm" onClick={() => navigate("/workspace")} className="hidden sm:flex">
                  Generate
                </Button>
                <ThemeToggle />
                <ProfileSheet />
              </div>
            ) : (
              <>
                <ThemeToggle />
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
