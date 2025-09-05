"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProject";
import { useEffect } from "react";
const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Review":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "High":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

// const getActivityIcon = (type: string) => {
//   switch (type) {
//     case "issue":
//       return <CheckCircle2 className="h-4 w-4 text-green-600" />;
//     case "project":
//       return <FolderOpen className="h-4 w-4 text-blue-600" />;
//     case "comment":
//       return <AlertCircle className="h-4 w-4 text-orange-600" />;
//     case "update":
//       return <Activity className="h-4 w-4 text-purple-600" />;
//     default:
//       return <Clock className="h-4 w-4 text-gray-600" />;
//   }
// };

export default function DashboardPage() {
  const { user } = useAuth();
  const { 
    projects, 
    isLoading, 
    error, 
    totalCount,
    fetchAllProjects,
    getProjectsByStatus,
    clearProjectError 
  } = useProjects();
  // Fetch projects on component mount
  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        clearProjectError();
      }
    };
  }, [error, clearProjectError]);
  
  const stats = [
    {
      name: "Active Projects",
      value: getProjectsByStatus('In Progress').length.toString(),
      change: `+${Math.max(0, getProjectsByStatus('In Progress').length - 6)} from last month`,
      changeType: "positive",
      icon: FolderOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Open Issues",
      value: projects.reduce((sum, project) => sum + (project.issues || 0), 0).toString(),
      change: "-5 from last week", // You can calculate this based on your needs
      changeType: "positive",
      icon: AlertCircle,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      name: "Total Projects",
      value: totalCount.toString(),
      change: `${projects.length} active projects`,
      changeType: "positive",
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      name: "Completed Tasks",
      value: getProjectsByStatus('Completed').length.toString(),
      change: "+23% this month", // You can calculate this based on your needs
      changeType: "positive",
      icon: CheckCircle2,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

    // Get recent projects (limit to 3)
  const recentProjects = Array.from(projects)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)
    .map(project => ({
      id: project._id,
      name: project.name,
      description: project.description,
      progress: project.progress,
      issues: project.issues,
      members: project.members,
      status: project.status,
      dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      priority: project.priority,
    }));

  // Calculate upcoming deadlines
  const upcomingDeadlines = projects
    .filter(project => project.dueDate && project.status !== 'Completed')
    .map(project => {
      const dueDate = new Date(project.dueDate!);
      const today = new Date();
      const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: project._id,
        title: `${project.name} Completion`,
        project: project.name,
        dueDate: dueDate.toISOString().split('T')[0],
        priority: project.priority,
        daysLeft: Math.max(0, daysLeft),
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

    if (isLoading && projects.length === 0) {
    return (
      <div className="space-y-8 w-full">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-muted-foreground">Loading projects...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-8 w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchAllProjects()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 w-full ">
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your projects today.
            </p>
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
                  <p className={`text-sm font-medium ${stat.textColor}`}>
                    {stat.name}
                  </p>
                  <p
                    className={`text-3xl font-bold ${stat.textColor
                      .replace("text-", "text-")
                      .replace("dark:text-", "dark:text-")
                      .replace("-400", "-900")
                      .replace("dark:text-", "dark:text-")
                      .replace("-900", "-100")}`}
                  >
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${stat.textColor}`} />
                    <span className={`text-xs ${stat.textColor}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                >
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                  >
                    <div className="group p-4 rounded-xl border hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                            {project.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(project.priority)}
                          >
                            {project.priority}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-medium">
                              {project.progress}%
                            </span>
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
                              Due{" "}
                              {new Date(project.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex -space-x-2">
                            {project.members.slice(0, 3).map((member) => (
                              <Avatar
                                key={member._id}
                                className="h-6 w-6 border-2 border-white dark:border-gray-800"
                              >
                                <AvatarImage
                                  src={member.avatar || "/placeholder.svg"}
                                  alt={member.name}
                                />
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
                                <span className="text-xs text-muted-foreground">
                                  +{project.members.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                Don&apos;t miss these important dates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-3 rounded-lg border bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(deadline.priority)}
                    >
                      {deadline.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {deadline.project}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Due {new Date(deadline.dueDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`font-medium ${
                        deadline.daysLeft <= 7
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
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
              <CardTitle className="text-blue-900 dark:text-blue-100">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Get things done faster
              </CardDescription>
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
  );
}
