"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Search, Plus, Calendar, MessageSquare, Paperclip, MoreHorizontal, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateIssueDialog } from "@/components/create-issue-dialog"

// Mock data
const issues = [
  {
    id: 1,
    title: "Login page not responsive on mobile devices",
    description: "The login form breaks on screens smaller than 768px. Need to fix responsive design.",
    project: "E-commerce Platform",
    projectId: 1,
    priority: "High",
    status: "Open",
    type: "Bug",
    assignee: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg",
    },
    reporter: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    dueDate: "2024-01-20T00:00:00Z",
    labels: ["Frontend", "Mobile", "Critical"],
    comments: 3,
    attachments: 1,
  },
  {
    id: 2,
    title: "Payment gateway integration failing",
    description: "Stripe webhook not receiving payment confirmation events properly.",
    project: "E-commerce Platform",
    projectId: 1,
    priority: "Critical",
    status: "In Progress",
    type: "Bug",
    assignee: {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/placeholder.svg",
    },
    reporter: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    },
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
    dueDate: "2024-01-18T00:00:00Z",
    labels: ["Backend", "Payment", "Integration"],
    comments: 5,
    attachments: 2,
  },
  {
    id: 3,
    title: "Add dark mode toggle to settings",
    description: "Users have requested a dark mode option in the application settings.",
    project: "Mobile App Redesign",
    projectId: 2,
    priority: "Medium",
    status: "Open",
    type: "Feature",
    assignee: {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg",
    },
    reporter: {
      id: 5,
      name: "Tom Brown",
      email: "tom@example.com",
    },
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-14T11:30:00Z",
    dueDate: "2024-01-25T00:00:00Z",
    labels: ["Frontend", "UI/UX", "Enhancement"],
    comments: 2,
    attachments: 0,
  },
  {
    id: 4,
    title: "Database query optimization needed",
    description: "User dashboard loading time is too slow due to inefficient database queries.",
    project: "API Integration",
    projectId: 3,
    priority: "High",
    status: "Review",
    type: "Improvement",
    assignee: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder.svg",
    },
    reporter: {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
    },
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-15T09:20:00Z",
    dueDate: "2024-01-22T00:00:00Z",
    labels: ["Backend", "Performance", "Database"],
    comments: 4,
    attachments: 1,
  },
  {
    id: 5,
    title: "User profile image upload not working",
    description: "Users cannot upload profile images. Getting 500 error on file upload endpoint.",
    project: "E-commerce Platform",
    projectId: 1,
    priority: "Medium",
    status: "Open",
    type: "Bug",
    assignee: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg",
    },
    reporter: {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
    },
    createdAt: "2024-01-11T13:30:00Z",
    updatedAt: "2024-01-12T10:15:00Z",
    dueDate: "2024-01-19T00:00:00Z",
    labels: ["Backend", "Upload", "User Profile"],
    comments: 1,
    attachments: 3,
  },
]

const mockProjectMembers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Project Manager", avatar: "/placeholder.svg" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Frontend Developer", avatar: "/placeholder.svg" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Backend Developer", avatar: "/placeholder.svg" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "UI/UX Designer", avatar: "/placeholder.svg" },
  { id: 5, name: "Tom Brown", email: "tom@example.com", role: "QA Engineer", avatar: "/placeholder.svg" },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "High":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "In Progress":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    case "Review":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "Done":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Bug":
      return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
    case "Feature":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
    case "Improvement":
      return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
    case "Task":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300"
  }
}

export default function IssuesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false)

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.labels.some((label) => label.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    const matchesProject = projectFilter === "all" || issue.project === projectFilter
    const matchesAssignee = assigneeFilter === "all" || issue.assignee.id.toString() === assigneeFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Issues
          </h1>
          <p className="text-muted-foreground">Track and manage all project issues</p>
        </div>
        <Button
          onClick={() => setIsCreateIssueOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Issue
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Issues</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{issues.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Critical</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {issues.filter((i) => i.priority === "Critical").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">In Progress</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {issues.filter((i) => i.status === "In Progress").length}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Resolved</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {issues.filter((i) => i.status === "Done").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues, labels, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] transition-all duration-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px] transition-all duration-200">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[140px] transition-all duration-200">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {mockProjectMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={`text-xs ${getTypeColor(issue.type)}`}>
                      {issue.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">#{issue.id}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{issue.project}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{issue.description}</p>
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
                    <DropdownMenuItem>Edit Issue</DropdownMenuItem>
                    <DropdownMenuItem>Assign to...</DropdownMenuItem>
                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Issue</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={`${getPriorityColor(issue.priority)} transition-all duration-200`}>
                  {issue.priority}
                </Badge>
                <Badge className={`${getStatusColor(issue.status)} transition-all duration-200`}>{issue.status}</Badge>
                {issue.labels.map((label, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} alt={issue.assignee.name} />
                      <AvatarFallback className="text-xs">
                        {issue.assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{issue.assignee.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {issue.comments > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {issue.comments}
                      </div>
                    )}
                    {issue.attachments > 0 && (
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {issue.attachments}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: {formatDate(issue.dueDate)}
                  </div>
                  <span>Updated {getTimeAgo(issue.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No issues found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || assigneeFilter !== "all"
                ? "Try adjusting your filters or search terms."
                : "Get started by creating your first issue."}
            </p>
            <Button
              onClick={() => setIsCreateIssueOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Issue
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateIssueDialog
        open={isCreateIssueOpen}
        onOpenChange={setIsCreateIssueOpen}
        projectId={1}
        projectMembers={mockProjectMembers}
      />
    </div>
  )
}
