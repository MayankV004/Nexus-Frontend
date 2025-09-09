"use client";

import { useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Users,
  AlertCircle,
  Plus,
  Calendar,
  MessageSquare,
  Loader2,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { KanbanBoard } from "@/components/kanban-board";
import { CreateIssueDialog } from "@/components/create-issue-dialog";
import { useProjects } from "@/hooks/useProject";
import { UpdateProjectDialog } from "@/components/update-project-dialog";
import { AddMemberDialog } from "@/components/add-member-dialog";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Planning":
      return "bg-gray-100 text-gray-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Review":
      return "bg-orange-100 text-orange-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-800";
    case "High":
      return "bg-orange-100 text-orange-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchProjectById, currentProject, isLoading, error } = useProjects();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [isUpdateProjectOpen, setIsUpdateProjectOpen] = useState(false);

  useEffect(() => {
    const projectId = params.id as string;
    if (projectId) {
      fetchProjectById(projectId);
    }
  }, [params.id, fetchProjectById]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Handle project not found
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Project not found</p>
          <Link href="/dashboard/projects">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const project = currentProject;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUpdateProjectOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Update Details
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
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

              <div className="grid grid-cols-2 gap-4 text-sm ">
                <div className="flex items-center text-gray-600 dark:text-gray-100 ">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due:{" "}
                  {project.dueDate
                    ? new Date(project.dueDate).toLocaleDateString()
                    : "N/A"}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-100">
                  <Users className="h-4 w-4 mr-2" />
                  {project.members.length} team members
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 ">
              {project.members.map((member) => (
                <div key={member._id} className="flex items-center gap-3 ">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                    />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate dark:text-gray-300 ">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={() => setIsAddMemberOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Content */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            {/* <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger> */}
          </TabsList>
          <Button onClick={() => setIsCreateIssueOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Issue
          </Button>
        </div>

        <TabsContent value="kanban" className="space-y-4">
          <KanbanBoard projectId={project._id} />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Issues</CardTitle>
              <CardDescription>
                Track and manage all project issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Issues list will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and changes in this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Activity feed will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateIssueDialog
        open={isCreateIssueOpen}
        onOpenChange={setIsCreateIssueOpen}
        projectId={project._id}
        projectMembers={project.members}
      />
      {currentProject && (
        <UpdateProjectDialog
          open={isUpdateProjectOpen}
          onOpenChange={setIsUpdateProjectOpen}
          project={currentProject}
        />
      )}
      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        projectId={project._id}
      />
    </div>
  );
}
