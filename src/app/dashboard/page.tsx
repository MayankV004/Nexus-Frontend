"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FolderOpen,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  Activity,
  Zap,
} from "lucide-react"
import Link from "next/link"

// Mock data
const stats = [
  {
    name: "Active Projects",
    value: "8",
    change: "+2 from last month",
    changeType: "positive",
    icon: FolderOpen,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Open Issues",
    value: "23",
    change: "-5 from last week",
    changeType: "positive",
    icon: AlertCircle,
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Team Members",
    value: "12",
    change: "+3 new members",
    changeType: "positive",
    icon: Users,
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "Completed Tasks",
    value: "156",
    change: "+23% this month",
    changeType: "positive",
    icon: CheckCircle2,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
    textColor: "text-purple-600 dark:text-purple-400",
  },
]

const recentProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "Modern online shopping platform with advanced features",
    progress: 75,
    issues: 12,
    members: [
      { id: 1, name: "John Doe", avatar: "/placeholder.svg" },
      { id: 2, name: "Jane Smith", avatar: "/placeholder.svg" },
      { id: 3, name: "Mike Johnson", avatar: "/placeholder.svg" },
    ],
    status: "In Progress",
    dueDate: "2024-03-15",
    priority: "High",
  },
  {
    id: 2,
    name: "Mobile App Redesign",
    description: "Complete UI/UX overhaul for mobile application",
    progress: 45,
    issues: 8,
    members: [
      { id: 4, name: "Sarah Wilson", avatar: "/placeholder.svg" },
      { id: 5, name: "Tom Brown", avatar: "/placeholder.svg" },
    ],
    status: "In Progress",
    dueDate: "2024-04-01",
    priority: "Medium",
  },
  {
    id: 3,
    name: "API Integration",
    description: "Third-party service integration and optimization",
    progress: 90,
    issues: 3,
    members: [
      { id: 1, name: "John Doe", avatar: "/placeholder.svg" },
      { id: 2, name: "Jane Smith", avatar: "/placeholder.svg" },
    ],
    status: "Review",
    dueDate: "2024-02-20",
    priority: "High",
  },
]

const recentActivity = [
  {
    id: 1,
    user: { name: "John Doe", avatar: "/placeholder.svg" },
    action: "completed issue",
    target: "Login page responsiveness",
    project: "E-commerce Platform",
    time: "2 hours ago",
    type: "issue",
  },
  {
    id: 2,
    user: { name: "Sarah Wilson", avatar: "/placeholder.svg" },
    action: "created project",
    target: "Mobile App Redesign",
    project: null,
    time: "4 hours ago",
    type: "project",
  },
  {
    id: 3,
    user: { name: "Mike Johnson", avatar: "/placeholder.svg" },
    action: "commented on",
    target: "Payment gateway integration",
    project: "E-commerce Platform",
    time: "6 hours ago",
    type: "comment",
  },
  {
    id: 4,
    user: { name: "Jane Smith", avatar: "/placeholder.svg" },
    action: "updated status of",
    target: "Database optimization",
    project: "API Integration",
    time: "1 day ago",
    type: "update",
  },
]

const upcomingDeadlines = [
  {
    id: 1,
    title: "API Integration Review",
    project: "API Integration",
    dueDate: "2024-02-20",
    priority: "High",
    daysLeft: 3,
  },
  {
    id: 2,
    title: "Mobile App Prototype",
    project: "Mobile App Redesign",
    dueDate: "2024-02-25",
    priority: "Medium",
    daysLeft: 8,
  },
  {
    id: 3,
    title: "E-commerce Launch",
    project: "E-commerce Platform",
    dueDate: "2024-03-15",
    priority: "Critical",
    daysLeft: 25,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "Review":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

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

const getActivityIcon = (type: string) => {
  switch (type) {
    case "issue":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case "project":
      return <FolderOpen className="h-4 w-4 text-blue-600" />
    case "comment":
      return <AlertCircle className="h-4 w-4 text-orange-600" />
    case "update":
      return <Activity className="h-4 w-4 text-purple-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 w-full ">
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Welcome back, John! 👋
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className={`border-0 shadow-lg bg-gradient-to-br ${stat.bgColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className={`text-sm font-medium ${stat.textColor}`}>{stat.name}</p>
                  <p
                    className={`text-3xl font-bold ${stat.textColor.replace("text-", "text-").replace("dark:text-", "dark:text-").replace("-400", "-900").replace("dark:text-", "dark:text-").replace("-900", "-100")}`}
                  >
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${stat.textColor}`} />
                    <span className={`text-xs ${stat.textColor}`}>{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                    Recent Projects
                  </CardTitle>
                  <CardDescription>Your most active projects</CardDescription>
                </div>
                <Link href="/dashboard/projects">
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                  <div className="group p-4 rounded-xl border hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        <Badge variant="outline" className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {project.issues} issues
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex -space-x-2">
                          {project.members.slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.members.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">+{project.members.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest team updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                    <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                    <AvatarFallback className="text-xs">
                      {activity.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1">
                      {getActivityIcon(activity.type)}
                      <p className="text-sm">
                        <span className="font-medium">{activity.user.name}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                    </div>
                    {activity.project && <p className="text-xs text-muted-foreground">{activity.project}</p>}
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Don't miss these important dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-3 rounded-lg border bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    <Badge variant="outline" className={getPriorityColor(deadline.priority)}>
                      {deadline.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{deadline.project}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Due {new Date(deadline.dueDate).toLocaleDateString()}</span>
                    <span className={`font-medium ${deadline.daysLeft <= 7 ? "text-red-600" : "text-green-600"}`}>
                      {deadline.daysLeft} days left
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Quick Actions</CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">Get things done faster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/projects">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </Link>
              <Link href="/dashboard/issues">
                <Button
                  variant="outline"
                  className="w-full justify-start hover:scale-105 transition-transform duration-200"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </Link>
              <Link href="/dashboard/team">
                <Button
                  variant="outline"
                  className="w-full justify-start hover:scale-105 transition-transform duration-200"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
