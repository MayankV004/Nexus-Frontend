"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderOpen, Users, AlertCircle, Search, Plus, MoreHorizontal, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { useProjects } from "@/hooks/useProject"


const getStatusColor = (status: string) => {
  switch (status) {
    case "Planning":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200 border-gray-200 dark:border-gray-700"
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    case "Review":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800"
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200 border-gray-200 dark:border-gray-700"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
    case "High":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200 border-gray-200 dark:border-gray-700"
  }
}

export default function ProjectsPage() {
  const { projects , fetchAllProjects,clearProjectError,  error } = useProjects()
 

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

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
    
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">Manage and track all your projects</p>
        </div>
        <Button
          onClick={() => setIsCreateProjectOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Projects</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{projects.length}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 dark:border-green-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {projects.filter((p) => p.status === "In Progress").length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 dark:border-orange-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">In Review</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {projects.filter((p) => p.status === "Review").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 dark:border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completed</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {projects.filter((p) => p.status === "Completed").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">All Status</SelectItem>
                  <SelectItem value="Planning" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Planning</SelectItem>
                  <SelectItem value="In Progress" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">In Progress</SelectItem>
                  <SelectItem value="Review" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Review</SelectItem>
                  <SelectItem value="Completed" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">All Priority</SelectItem>
                  <SelectItem value="Critical" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Critical</SelectItem>
                  <SelectItem value="High" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">High</SelectItem>
                  <SelectItem value="Medium" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="Low" className="dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Link key={project._id} href={`/dashboard/projects/${project._id}`}>
            <Card className="border-0 shadow-md hover:shadow-xl dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 transition-all duration-300 cursor-pointer transform hover:scale-105 group dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <FolderOpen className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 dark:text-gray-100">
                        {project.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm line-clamp-2 dark:text-gray-300">{project.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 dark:hover:bg-gray-700"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuItem className="dark:text-gray-100 dark:hover:bg-gray-700">Edit Project</DropdownMenuItem>
                      <DropdownMenuItem className="dark:text-gray-100 dark:hover:bg-gray-700">Archive Project</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700">Delete Project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(project.status)} transition-all duration-200`}>
                    {project.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${getPriorityColor(project.priority)} transition-all duration-200`}
                  >
                    {project.priority}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground dark:text-gray-400">Progress</span>
                    <span className="font-medium dark:text-gray-200">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2 dark:bg-gray-700" />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {project.issues} issues
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {project.members.length} members
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-xs text-muted-foreground dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No due date"}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="border-0 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <FolderOpen className="h-8 w-8 text-muted-foreground dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">No projects found</h3>
            <p className="text-muted-foreground dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters or search terms."
                : "Get started by creating your first project."}
            </p>
            <Button
              onClick={() => setIsCreateProjectOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateProjectDialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen} />
    </div>
  )
}