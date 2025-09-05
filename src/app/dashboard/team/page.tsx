"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import {
  Users,
  Search,
  UserPlus,
  Mail,
  MoreHorizontal,
  Crown,
  Shield,
  User,
  Copy,
  LinkIcon,
  Activity,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock team data
const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    department: "Engineering",
    avatar: "/placeholder.svg",
    status: "Active",
    joinDate: "2022-03-15",
    lastActive: "2024-01-15T10:30:00Z",
    projects: 5,
    issuesAssigned: 12,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Developer",
    department: "Engineering",
    avatar: "/placeholder.svg",
    status: "Active",
    joinDate: "2022-06-20",
    lastActive: "2024-01-15T09:45:00Z",
    projects: 3,
    issuesAssigned: 8,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Developer",
    department: "Engineering",
    avatar: "/placeholder.svg",
    status: "Active",
    joinDate: "2023-01-10",
    lastActive: "2024-01-15T11:20:00Z",
    projects: 4,
    issuesAssigned: 15,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Designer",
    department: "Design",
    avatar: "/placeholder.svg",
    status: "Active",
    joinDate: "2023-03-05",
    lastActive: "2024-01-15T08:15:00Z",
    projects: 2,
    issuesAssigned: 6,
  },
  {
    id: 5,
    name: "Tom Brown",
    email: "tom@example.com",
    role: "QA Engineer",
    department: "Quality Assurance",
    avatar: "/placeholder.svg",
    status: "Inactive",
    joinDate: "2023-08-12",
    lastActive: "2024-01-10T16:30:00Z",
    projects: 1,
    issuesAssigned: 3,
  },
]

const inviteLink = "https://nexus.app/invite/abc123def456"

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin":
      return <Crown className="h-4 w-4 text-yellow-600" />
    case "Manager":
      return <Shield className="h-4 w-4 text-blue-600" />
    default:
      return <User className="h-4 w-4 text-gray-600" />
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "Manager":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "Developer":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "Designer":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    case "QA Engineer":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "Inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [searchUsername, setSearchUsername] = useState("")

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter

    return matchesSearch && matchesRole && matchesDepartment
  })

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    toast.message("Invite link copied! 📋",{
      description: "Share this link with new team members.",
    })
  }

  const sendInvite = async () => {
    if (!inviteEmail) return

    try {
      // TODO: Replace with actual API call
      console.log("Sending invite to:", inviteEmail)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.message("Invitation sent! 📧",{
        description: `An invite has been sent to ${inviteEmail}`,
      })

      setInviteEmail("")
      setIsInviteDialogOpen(false)
    } catch (error: unknown) {
      if(error instanceof Error){
        toast.error(error.message)
      }else{
        toast.error("Failed to send invite")
      } 
    }
  }

  const searchUser = async () => {
    if (!searchUsername) return

    try {
      // TODO: Replace with actual API call
      console.log("Searching for user:", searchUsername)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.message("User found! 👤",{
        description: `Found user: ${searchUsername}. Sending invite...`,
      })

      setSearchUsername("")
      setIsAddMemberDialogOpen(false)
    } catch (error:unknown) {
      if(error instanceof Error) {
        toast.error(error.message)
      }else{
        toast.error("Failed to find user")
      }

    }
  }

  const formatLastActive = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Team
          </h1>
          <p className="text-muted-foreground">Manage your team members and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsInviteDialogOpen(true)}
            className="transition-all duration-200 hover:scale-105"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Invite Link
          </Button>
          <Button
            onClick={() => setIsAddMemberDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Members</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{teamMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {teamMembers.filter((m) => m.status === "Active").length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Departments</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {new Set(teamMembers.map((m) => m.department)).size}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Admins</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {teamMembers.filter((m) => m.role === "Admin").length}
                </p>
              </div>
              <Crown className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          {/* Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[140px] transition-all duration-200">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="Designer">Designer</SelectItem>
                      <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[160px] transition-all duration-200">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove from Team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(member.role)}
                      <Badge className={`${getRoleColor(member.role)} transition-all duration-200`}>
                        {member.role}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(member.status)} transition-all duration-200`}
                      >
                        {member.status}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>{member.department}</p>
                      <p>Joined {new Date(member.joinDate).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-medium text-blue-600 dark:text-blue-400">{member.projects}</div>
                          <div className="text-xs text-muted-foreground">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600 dark:text-green-400">{member.issuesAssigned}</div>
                          <div className="text-xs text-muted-foreground">Issues</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last active {formatLastActive(member.lastActive)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Manage what each role can do in your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Permission management will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Link Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>
              Share this link with new team members to invite them to your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invite Link</Label>
              <div className="flex items-center gap-2">
                <Input value={inviteLink} readOnly className="flex-1" />
                <Button onClick={copyInviteLink} size="sm" className="transition-all duration-200">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Or send via email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={sendInvite} size="sm" disabled={!inviteEmail} className="transition-all duration-200">
                  <Mail className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Search for a user by their username to add them to your team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={searchUser} disabled={!searchUsername} className="transition-all duration-200">
              <Search className="h-4 w-4 mr-2" />
              Search & Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
