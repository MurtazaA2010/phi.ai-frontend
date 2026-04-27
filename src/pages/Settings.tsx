import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, CreditCard, Bell, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { clearApiBaseUrlOverride, getApiBaseUrl, setApiBaseUrl } from "@/lib/api";

const API_BASE_URL = getApiBaseUrl();

const Settings = () => {
    const { user, token, logout, updateName } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

    // Profile form state
    const [displayName, setDisplayName] = useState(user?.name ?? "");
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // API URL (runtime override) state
    const [apiBaseUrl, setApiBaseUrlState] = useState(() => getApiBaseUrl());
    const [isSavingApiUrl, setIsSavingApiUrl] = useState(false);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    if (!user) {
        navigate("/signin");
        return null;
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName.trim()) {
            toast.error("Display name cannot be empty");
            return;
        }
        setIsSavingProfile(true);
        try {
            await updateName(displayName.trim());
            toast.success("Display name updated!");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update name";
            toast.error(message);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            toast.error("Please fill in both password fields");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }
        setIsSavingPassword(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Failed to change password");
            }
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to change password";
            toast.error(message);
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleSaveApiUrl = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingApiUrl(true);
        try {
            const normalized = setApiBaseUrl(apiBaseUrl);
            toast.success(`API URL saved: ${normalized}`);
            toast.info("Reloading to apply API URL...");
            window.location.reload();
        } finally {
            setIsSavingApiUrl(false);
        }
    };

    const handleResetApiUrl = () => {
        clearApiBaseUrlOverride();
        toast.success("API URL reset to default/env");
        toast.info("Reloading to apply API URL...");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8" onValueChange={setActiveTab}>
                    <aside className="w-full md:w-64 space-y-2">
                        <TabsList className="flex flex-col bg-transparent p-0 gap-1 h-auto w-full items-stretch">
                            <TabsTrigger
                                value="profile"
                                className="justify-start px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </TabsTrigger>
                            {!user.is_google_auth && (
                                <TabsTrigger
                                    value="account"
                                    className="justify-start px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                                >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Account &amp; Security
                                </TabsTrigger>
                            )}
                            <TabsTrigger
                                value="billing"
                                className="justify-start px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Billing &amp; Plans
                            </TabsTrigger>
                            <TabsTrigger
                                value="notifications"
                                className="justify-start px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                            >
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                            </TabsTrigger>
                        </TabsList>

                        <Separator className="my-4" />

                        <Button
                            variant="ghost"
                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={logout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </aside>

                    <div className="flex-1">
                        {/* PROFILE TAB */}
                        <TabsContent value="profile" className="m-0 space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Profile Information</h3>
                                <p className="text-sm text-muted-foreground">
                                    Update your personal information.
                                </p>
                            </div>
                            <Separator />
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input
                                            id="name"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" defaultValue={user.username} disabled />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue={user.email} disabled className="bg-muted" />
                                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                                </div>
                                <div className="pt-4">
                                    <Button type="submit" disabled={isSavingProfile}>
                                        {isSavingProfile ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>

                            <Separator />
                        </TabsContent>

                        {/* ACCOUNT & SECURITY TAB */}
                        {!user.is_google_auth && (
                            <TabsContent value="account" className="m-0 space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium">Account Security</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Manage your password and security settings.
                                    </p>
                                </div>
                                <Separator />
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input
                                            id="current-password"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input
                                            id="new-password"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <Button type="submit" disabled={isSavingPassword}>
                                            {isSavingPassword ? "Updating..." : "Update Password"}
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>
                        )}

                        {/* BILLING TAB */}
                        <TabsContent value="billing" className="m-0 space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Billing &amp; Plans</h3>
                                <p className="text-sm text-muted-foreground">
                                    View your plan details and credit usage.
                                </p>
                            </div>
                            <Separator />
                            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold text-lg">Current Plan: Free</h4>
                                        <p className="text-sm text-muted-foreground">Basic features and daily credit limit.</p>
                                    </div>
                                    <Button variant="outline" onClick={() => navigate("/pricing")}>
                                        Upgrade
                                    </Button>
                                </div>
                                <Separator className="bg-border/50" />
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Credits Remaining</span>
                                        <p className="font-medium text-lg">{user.credits_remaining}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Credits Used Today</span>
                                        <p className="font-medium text-lg">{user.credits_used_today}</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* NOTIFICATIONS TAB */}
                        <TabsContent value="notifications" className="m-0 space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Notifications</h3>
                                <p className="text-sm text-muted-foreground">
                                    Manage how we communicate with you.
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Notification settings coming soon.</p>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </main>
        </div>
    );
};

export default Settings;
