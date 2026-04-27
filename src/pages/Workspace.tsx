import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Send,
  Code2,
  Play,
  Copy,
  Check,
  ArrowLeft,
  Loader2,
  Download,
  LogOut,
  User,
  Pencil
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getApiBaseUrl, resolveVideoUrl } from "@/lib/api";

type ViewMode = "prompt" | "code" | "preview";

const API_BASE_URL = getApiBaseUrl();

const Workspace = () => {
  const { user, token, logout, refreshUser, isLoading: isAuthLoading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [originalGeneratedCode, setOriginalGeneratedCode] = useState(""); // Track AI-generated code
  const [viewMode, setViewMode] = useState<ViewMode>("prompt");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoadError, setVideoLoadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [preEditCode, setPreEditCode] = useState("");

  /* ------------------ CLEANUP BLOB URL (not needed, using direct URL now) -- */

  /* ------------------ GENERATE CODE ------------------ */
  /* ------------------ GENERATE CODE ------------------ */
  const generateCode = async (promptText: string) => {
    if (!promptText.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (isAuthLoading) {
      toast.info("Restoring your session... please wait a moment.");
      return;
    }

    if (!token) {
      toast.error("Please sign in to generate code");
      return;
    }

    setIsGenerating(true);
    setGeneratedCode("");
    setOriginalGeneratedCode("");
    setVideoUrl(null);
    setVideoLoadError(null);

    try {
      const formData = new FormData();
      formData.append("prompt", promptText);

      const res = await fetch(`${API_BASE_URL}/generate-code`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Session expired. Please sign in again.");
          logout();
          return;
        }
        if (res.status === 429) {
          const error = await res.json();
          toast.error(error.detail || "Daily credit limit reached");
          await refreshUser();
          return;
        }
        throw new Error("Code generation failed");
      }

      const data = await res.json();
      setGeneratedCode(data.code);
      setOriginalGeneratedCode(data.code); // Store original AI-generated code
      toast.success("Code generated! Rendering preview...");
      await refreshUser(); // Refresh credits
      // Auto-render the video and switch to preview
      handleRenderPreviewWithCode(data.code);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => generateCode(prompt);

  /* ------------------ AUTO GENERATE ON LOAD ------------------ */
  const location = useLocation();

  useEffect(() => {
    if (location.state?.prompt) {
      setPrompt(location.state.prompt);

      if (location.state?.code) {
        setGeneratedCode(location.state.code);
        setOriginalGeneratedCode(location.state.code);
        setViewMode(location.state.viewMode || "preview");
      } else if (location.state?.autoGenerate) {
        // check if we already generated or if token exists.
        if (token && !generatedCode && !isGenerating) {
          generateCode(location.state.prompt);
        }
      }
    }
  }, [location.state, token]); // Run when token is ready or location changes

  /* ------------------ COPY CODE ------------------ */
  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  /* ------------------ RENDER VIDEO ------------------ */
  // Internal helper that accepts code directly (used for auto-render after generation)
  const handleRenderPreviewWithCode = async (codeToRender: string) => {
    if (!codeToRender || isRendering) return;

    if (isAuthLoading) {
      toast.info("Restoring your session... please wait a moment.");
      return;
    }

    if (!token) {
      toast.error("Please sign in to render videos");
      return;
    }

    setIsRendering(true);
    setViewMode("preview");
    setVideoLoadError(null);

    try {
      const formData = new FormData();
      formData.append("code", codeToRender);
      formData.append("is_rerender", "false");
      console.log("▶️ Auto-rendering after code generation");

      const res = await fetch(`${API_BASE_URL}/render`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      if (!res.ok) {
        let errorText = "";
        try {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const json = await res.json();
            errorText = json?.detail || json?.message || JSON.stringify(json);
          } else {
            errorText = (await res.text()).slice(0, 500);
          }
        } catch {
          // ignore parse failures
        }

        if (res.status === 401) {
          toast.error(errorText || "Session expired. Please sign in again.");
          logout();
          return;
        }
        if (res.status === 429) {
          toast.error(errorText || "Daily credit limit reached");
          await refreshUser();
          return;
        }
        throw new Error(`Render failed (${res.status})${errorText ? `: ${errorText}` : ""}`);
      }

      const data = await res.json();

      // Backend returns { video_url: "/videos/filename.mp4" } or a full URL
      const rawUrl: string = data.video_url || data.url || "";
      if (!rawUrl) throw new Error("No video URL returned from server");

      const fullUrl = resolveVideoUrl(rawUrl);
      setVideoUrl(fullUrl);

      toast.success("Video rendered!");

      await refreshUser(); // Refresh credits
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Rendering failed";
      toast.error(message);
      setViewMode("code"); // Fall back to code view on error
    } finally {
      setIsRendering(false);
    }
  };

  const handleRenderPreview = async () => {
    if (!generatedCode || isRendering) return;
    await handleRenderPreviewWithCode(generatedCode);
  };

  /* ------------------ DOWNLOAD VIDEO ------------------ */
  const handleDownload = () => {
    if (!videoUrl) return;

    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "animation.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /* ------------------ EDIT LOGIC ------------------ */
  const handleEdit = () => {
    setPreEditCode(generatedCode);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Changes saved locally");
  };

  const handleDiscard = () => {
    setGeneratedCode(preEditCode);
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  /* ------------------ RESET ------------------ */
  const handleNewPrompt = () => {
    setPrompt("");
    setGeneratedCode("");
    setOriginalGeneratedCode("");
    setVideoUrl(null);
    setViewMode("prompt");
    setIsEditing(false);
    setPreEditCode("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <header className="border-b bg-card/50">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span>
              <img src="/logo.png" alt="Phi.ai" width={150} height={100} />
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary">
                  {user.credits_remaining} / {user.credit_limit} credits
                </div>
              </div>
            )}

            {generatedCode && (
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "code" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("code")}
                >
                  <Code2 className="h-4 w-4 mr-1" />
                  Code
                </Button>
                <Button
                  variant={viewMode === "preview" ? "secondary" : "ghost"}
                  size="sm"
                  disabled={isRendering || isAuthLoading || !token}
                  onClick={() => {
                    if (videoUrl) {
                      // Video already rendered — just switch view
                      setViewMode("preview");
                    } else {
                      // No video yet — trigger render
                      handleRenderPreview();
                    }
                  }}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            )}

            {user && (
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1">
        {/* PROMPT PANEL */}
        <div className="w-full md:w-2/5 border-r p-4 flex flex-col">
          <Textarea
            placeholder="Describe the animation..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 resize-none"
          />

          <div className="mt-4 flex gap-2">
            {generatedCode && (
              <Button variant="outline" onClick={handleNewPrompt}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                New
              </Button>
            )}
            <Button className="flex-1" onClick={handleSubmit} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* OUTPUT PANEL */}
        <div className="hidden md:flex flex-1 flex-col bg-card/30">
          {viewMode === "code" && (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">Generated Code</h2>
                  {generatedCode !== originalGeneratedCode && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ✏️ Code modified - Re-render to apply changes
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <Button size="sm" variant="outline" onClick={handleEdit}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Code
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" onClick={handleDiscard}>
                        Discard
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        Save
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" onClick={handleCopyCode}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Textarea
                readOnly={!isEditing}
                value={generatedCode}
                onChange={(e) => setGeneratedCode(e.target.value)}
                className={`flex-1 resize-none font-mono text-sm rounded-none border-none ${isEditing ? "bg-background" : "bg-muted/30"}`}
                placeholder="Your generated code will appear here..."
              />
              <div className="p-4">
                <Button className="w-full" onClick={handleRenderPreview} disabled={isRendering || isAuthLoading || !token}>
                  <Play className="h-4 w-4 mr-2" />
                  {generatedCode !== originalGeneratedCode ? "Re-Render" : "Render Preview"}
                </Button>
              </div>
            </>
          )}

          {viewMode === "preview" && (
            <div className="flex-1 flex items-center justify-center p-4">
              {isRendering ? (
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              ) : videoUrl ? (
                <div className="w-full max-w-2xl">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg"
                    onError={() => setVideoLoadError("Video failed to load. Your backend must publicly serve this URL.")}
                  />
                  {videoLoadError && (
                    <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-sm">
                      <p className="font-medium">{videoLoadError}</p>
                      <p className="mt-2 break-all text-muted-foreground">
                        URL:{" "}
                        <a className="underline" href={videoUrl} target="_blank" rel="noreferrer">
                          {videoUrl}
                        </a>
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        API base: <span className="font-mono">{API_BASE_URL}</span>
                      </p>
                    </div>
                  )}
                  <Button className="w-full mt-4" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Video
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
