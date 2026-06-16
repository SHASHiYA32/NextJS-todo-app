"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ClipboardList, Plus, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAnnouncement,
  createIntegration,
  getAnnouncements,
  getIntegrations,
  getProfile,
  getUserId,
  updateAnnouncement,
  updateIntegration,
} from "@/lib/db";
import type { Announcement, Integration } from "@/types";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [integrationName, setIntegrationName] = useState("");
  const [integrationConfig, setIntegrationConfig] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadAdminData = async () => {
      const userId = await getUserId();
      if (!userId) {
        router.push("/login");
        return;
      }
      const profileData = await getProfile(userId);
      const adminRole = profileData?.role?.toLowerCase().includes("admin");
      if (!adminRole) {
        router.push("/dashboard");
        return;
      }
      setIsAdmin(true);
      const [announcementRows, integrationRows] = await Promise.all([getAnnouncements(userId), getIntegrations(userId)]);
      setAnnouncements(announcementRows);
      setIntegrations(integrationRows);
    };

    loadAdminData();
  }, [router]);

  const refreshAdminData = async () => {
    const userId = await getUserId();
    if (!userId) return;
    const [announcementRows, integrationRows] = await Promise.all([getAnnouncements(userId), getIntegrations(userId)]);
    setAnnouncements(announcementRows);
    setIntegrations(integrationRows);
  };

  const handleAddAnnouncement = async () => {
    const userId = await getUserId();
    if (!userId || !announcementTitle.trim() || !announcementMessage.trim()) return;

    const newAnnouncement = await createAnnouncement(userId, announcementTitle.trim(), announcementMessage.trim());
    if (newAnnouncement) {
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      setAnnouncementTitle("");
      setAnnouncementMessage("");
      setStatusMessage("Announcement created.");
      window.setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleToggleAnnouncement = async (announcement: Announcement) => {
    const updated = await updateAnnouncement(announcement.id, { active: !announcement.active });
    if (updated) {
      setAnnouncements((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    }
  };

  const handleAddIntegration = async () => {
    const userId = await getUserId();
    if (!userId || !integrationName.trim() || !integrationConfig.trim()) return;

    const newIntegration = await createIntegration(userId, integrationName.trim(), integrationConfig.trim());
    if (newIntegration) {
      setIntegrations((prev) => [newIntegration, ...prev]);
      setIntegrationName("");
      setIntegrationConfig("");
      setStatusMessage("Integration added.");
      window.setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleToggleIntegration = async (integration: Integration) => {
    const updated = await updateIntegration(integration.id, { enabled: !integration.enabled });
    if (updated) {
      setIntegrations((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    }
  };

  if (!isAdmin) {
    return <div className="space-y-8"><div className="rounded-3xl border border-border/80 bg-card/90 p-6 text-center">Redirecting...</div></div>;
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Admin portal</p>
        <h1 className="text-3xl font-semibold">Announcements and integrations</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Manage notifications, site-wide messages, and connected app integrations from a single control panel.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Announcements</p>
                  <CardTitle className="mt-2 text-xl font-semibold">Create a new message</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="announcementTitle">Title</Label>
                <Input id="announcementTitle" value={announcementTitle} onChange={(event) => setAnnouncementTitle(event.target.value)} placeholder="New feature release" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="announcementMessage">Message</Label>
                <textarea
                  id="announcementMessage"
                  rows={4}
                  value={announcementMessage}
                  onChange={(event) => setAnnouncementMessage(event.target.value)}
                  className="w-full rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleAddAnnouncement} className="rounded-full px-6 py-3 text-sm font-semibold">Publish announcement</Button>
                <Button variant="outline" size="sm" onClick={refreshAdminData}>Refresh</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Integrations</p>
                  <CardTitle className="mt-2 text-xl font-semibold">Connect services</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="integrationName">Integration name</Label>
                <Input id="integrationName" value={integrationName} onChange={(event) => setIntegrationName(event.target.value)} placeholder="Google Calendar" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="integrationConfig">Config JSON</Label>
                <textarea
                  id="integrationConfig"
                  rows={4}
                  value={integrationConfig}
                  onChange={(event) => setIntegrationConfig(event.target.value)}
                  className="w-full rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <Button onClick={handleAddIntegration} className="rounded-full px-6 py-3 text-sm font-semibold">Add integration</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Active announcements</p>
                  <CardTitle className="mt-2 text-xl font-semibold">Published messages</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border/60 bg-background/80 p-6 text-center text-sm text-muted-foreground">No announcements published yet.</div>
              ) : (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="rounded-3xl border border-border/70 bg-background/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground">{announcement.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleAnnouncement(announcement)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${announcement.active ? "bg-emerald-100 text-emerald-700" : "bg-muted-100 text-muted-foreground"}`}
                      >
                        {announcement.active ? "Active" : "Inactive"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Installed apps</p>
                  <CardTitle className="mt-2 text-xl font-semibold">Connected integrations</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border/60 bg-background/80 p-6 text-center text-sm text-muted-foreground">No integrations configured yet.</div>
              ) : (
                integrations.map((integration) => (
                  <div key={integration.id} className="rounded-3xl border border-border/70 bg-background/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.enabled ? "Enabled" : "Disabled"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleIntegration(integration)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${integration.enabled ? "bg-emerald-100 text-emerald-700" : "bg-muted-100 text-muted-foreground"}`}
                      >
                        {integration.enabled ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {statusMessage ? <div className="rounded-3xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">{statusMessage}</div> : null}
    </div>
  );
}
