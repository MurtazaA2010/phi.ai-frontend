import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Calendar, Code2, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface Project {
    id: string;
    prompt: string;
    code: string;
    description?: string;
    created_at: string;
}

const Projects = () => {
    const { user, token } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        const fetchProjects = async () => {
            try {
                const res = await fetch("http://localhost:8000/projects", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch projects");

                const data = await res.json();
                setProjects(data.projects);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load projects");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, [token]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`http://localhost:8000/projects/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete project");

            setProjects(projects.filter((p) => p.id !== id));
            toast.success("Project deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete project");
        }
    };

    const loadProject = (project: Project) => {
        navigate("/workspace", {
            state: {
                prompt: project.prompt,
                code: project.code,
                viewMode: "code"
            }
        });
    };


    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Please sign in to view projects</h1>
                <Link to="/signin">
                    <Button>Sign In</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar /> {/* Reuse existing Navbar if appropriate, or build a custom header */}

            <main className="container mx-auto px-4 py-8 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Your Projects
                    </h1>
                    <Link to="/workspace">
                        <Button>
                            <Code2 className="mr-2 h-4 w-4" />
                            New Project
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-lg bg-card/50">
                        <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                        <p className="text-muted-foreground mb-4">Generate your first Manim animation to get started.</p>
                        <Link to="/workspace">
                            <Button variant="secondary">Go to Workspace</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => loadProject(project)}
                                className="group relative bg-card hover:bg-card/80 border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer flex flex-col h-full"
                            >
                                <div className="p-6 flex-1 flex flex-col" >
                                    {/* Header with Title and Date */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 mr-2">
                                            <h3 className="font-semibold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                {project.prompt}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-auto pt-4 flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(project.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                {/* Footer / Actions */}
                                <div className="px-6 py-4 bg-muted/30 border-t flex items-center justify-between">
                                    <span className="text-xs font-medium text-primary flex items-center group-hover:underline">
                                        View Project <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleDelete(e, project.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Projects;
