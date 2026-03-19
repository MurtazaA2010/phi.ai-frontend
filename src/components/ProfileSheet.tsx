import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, CreditCard, Box, LogOut, Settings, Sparkles, Loader2, FileCode } from "lucide-react";
import { toast } from "sonner";

interface Project {
    id: string;
    prompt: string;
    code: string;
    created_at: string;
}

const ProfileSheet = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Assuming a daily limit or total credits cap to show progress. 
    // If dynamic, this logic might need adjustment.
    // For now, let's assume a standard daily limit if not provided, or just visualize ratio.
    const TOTAL_CREDITS = (user?.credits_remaining || 0) + (user?.credits_used_today || 0) || 50;
    const creditsPercentage = user ? (user.credits_remaining / TOTAL_CREDITS) * 100 : 0;

    useEffect(() => {
        if (isOpen && token) {
            fetchProjects();
        }
    }, [isOpen, token]);

    const fetchProjects = async () => {
        setIsLoadingProjects(true);
        try {
            const res = await fetch("http://localhost:8000/projects", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                // Take top 5 recent projects
                setProjects(data.projects.slice(0, 5));
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    if (!user) return null;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-border bg-muted/50 hover:bg-muted">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Open profile</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col gap-6 overflow-y-auto">
                <SheetHeader className="text-left">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                        <User className="h-5 w-5" />
                        Profile & Dashboard
                    </SheetTitle>
                </SheetHeader>

                {/* User Info Card */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card border shadow-sm">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                Free Plan
                            </span>
                        </div>
                    </div>
                </div>

                {/* Credits Section */}
                <div className="space-y-3 p-4 rounded-xl bg-muted/30 border">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            Credits Usage
                        </h4>
                        <span className="text-sm font-medium">{user.credits_remaining} remaining</span>
                    </div>
                    <Progress value={creditsPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                        You have used {user.credits_used_today} credits today.
                        Resets daily.
                    </p>
                    <Link to="/pricing">
                        <Button variant="outline" size="sm" className="w-full text-xs h-8">
                            Upgrade Plan
                        </Button>
                    </Link>
                </div>

                {/* Projects Section */}
                <div className="flex-1 min-h-[200px]">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium flex items-center gap-2">
                            <Box className="h-4 w-4" />
                            Recent Projects
                        </h4>
                        <Link
                            to="/projects"
                            onClick={() => setIsOpen(false)}
                            className="text-xs text-primary hover:underline"
                        >
                            View All
                        </Link>
                    </div>

                    {isLoadingProjects ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="grid gap-3">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate("/workspace", {
                                            state: {
                                                prompt: project.prompt,
                                                code: project.code,
                                                viewMode: "code"
                                            }
                                        });
                                    }}
                                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                                >
                                    <div className="mt-1 p-2 rounded bg-primary/5 text-primary">
                                        <FileCode className="h-4 w-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-sm truncate">{project.prompt}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
                            No projects yet.
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto border-t pt-4 space-y-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                            setIsOpen(false);
                            navigate("/settings");
                        }}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ProfileSheet;
