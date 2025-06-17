"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Settings, Bell, Shield, Database, Key, Trash2, Save, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [workspaceSettings, setWorkspaceSettings] = useState({
    name: "Nexus Workspace",
    description: "Our main project management workspace",
    timezone: "America/Los_Angeles",
    language: "English",
    dateFormat: "MM/DD/YYYY",
    weekStart: "Monday",
  })

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    projectUpdates: true,
    issueAssignments: true,
    mentions: true,
    deadlineReminders: true,
    teamInvites: false,
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "24",
    passwordExpiry: "90",
    loginNotifications: true,
  })

  const handleSaveWorkspace = async () => {
    try {
      // TODO: Replace with actual API call
      console.log("Saving workspace settings:", workspaceSettings)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Settings saved! ✅", {
        description: "Workspace settings have been updated successfully.",
      })
    } catch (error) {
      toast.error("Failed to save settings", {
        description: "Something went wrong. Please try again.",
      })
    }
  }

  const handleSaveNotifications = async () => {
    try {
      console.log("Saving notification settings:", notifications)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Notifications updated! 🔔", {
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      toast.error("Failed to save notifications", {
        description: "Something went wrong. Please try again.",
      })
    }
  }

  const handleSaveSecurity = async () => {
    try {
      console.log("Saving security settings:", security)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Security updated! 🔒", {
        description: "Your security settings have been saved.",
      })
    } catch (error) {
      toast.error("Failed to save security settings", {
        description: "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your workspace preferences and configurations</p>
      </div>

      <Tabs defaultValue="workspace" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="workspace" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Workspace Settings
              </CardTitle>
              <CardDescription>Configure your workspace preferences and defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input
                    id="workspace-name"
                    value={workspaceSettings.name}
                    onChange={(e) => setWorkspaceSettings((prev) => ({ ...prev, name: e.target.value }))}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={workspaceSettings.timezone}
                    onValueChange={(value) => setWorkspaceSettings((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={workspaceSettings.description}
                  onChange={(e) => setWorkspaceSettings((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={workspaceSettings.language}
                    onValueChange={(value) => setWorkspaceSettings((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select
                    value={workspaceSettings.dateFormat}
                    onValueChange={(value) => setWorkspaceSettings((prev) => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="week-start">Week Starts On</Label>
                  <Select
                    value={workspaceSettings.weekStart}
                    onValueChange={(value) => setWorkspaceSettings((prev) => ({ ...prev, weekStart: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                      <SelectItem value="Monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveWorkspace}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how and when you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive daily summary of activities</p>
                  </div>
                  <Switch
                    checked={notifications.emailDigest}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailDigest: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Project Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when projects are updated</p>
                  </div>
                  <Switch
                    checked={notifications.projectUpdates}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, projectUpdates: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Issue Assignments</Label>
                    <p className="text-sm text-muted-foreground">Notify when issues are assigned to you</p>
                  </div>
                  <Switch
                    checked={notifications.issueAssignments}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, issueAssignments: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Mentions</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
                  </div>
                  <Switch
                    checked={notifications.mentions}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, mentions: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Deadline Reminders</Label>
                    <p className="text-sm text-muted-foreground">Remind me about upcoming deadlines</p>
                  </div>
                  <Switch
                    checked={notifications.deadlineReminders}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, deadlineReminders: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Team Invites</Label>
                    <p className="text-sm text-muted-foreground">Notify about new team member invitations</p>
                  </div>
                  <Switch
                    checked={notifications.teamInvites}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, teamInvites: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={security.twoFactorAuth ? "default" : "secondary"}>
                      {security.twoFactorAuth ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => setSecurity((prev) => ({ ...prev, twoFactorAuth: checked }))}
                    />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(value) => setSecurity((prev) => ({ ...prev, sessionTimeout: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="168">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                    <Select
                      value={security.passwordExpiry}
                      onValueChange={(value) => setSecurity((prev) => ({ ...prev, passwordExpiry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={security.loginNotifications}
                    onCheckedChange={(checked) => setSecurity((prev) => ({ ...prev, loginNotifications: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSecurity}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Security
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Integrations
              </CardTitle>
              <CardDescription>Connect with external tools and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Integration with popular tools like Slack, GitHub, and Jira will be available soon.
                </p>
                <Button variant="outline" disabled>
                  <Database className="h-4 w-4 mr-2" />
                  Browse Integrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-green-600" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>Manage your subscription and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Pro Plan</h3>
                    <p className="text-green-700 dark:text-green-300">$29/month • Billed monthly</p>
                  </div>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Next billing date</span>
                    <span className="font-medium">March 15, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Team members</span>
                    <span className="font-medium">12 / 25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage used</span>
                    <span className="font-medium">2.4 GB / 100 GB</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
                  <Key className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
                <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
                  <Database className="h-4 w-4 mr-2" />
                  Download Invoices
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Danger Zone
                </h4>
                <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-red-900 dark:text-red-100">Cancel Subscription</h5>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        This will cancel your subscription and you'll lose access to Pro features.
                      </p>
                    </div>
                    <Button variant="destructive" className="hover:scale-105 transition-transform duration-200">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Plan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
