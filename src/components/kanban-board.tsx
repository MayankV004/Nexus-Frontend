"use client";

import type React from "react";
import { useIssue } from "@/hooks/useIssue";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, UserPlus } from "lucide-react";
import { useProjects } from "@/hooks/useProject";

interface EditForm {
  title: string;
  description: string;
  priority: string;
  status: string;
}


const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getLabelColor = (label: string) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-cyan-100 text-cyan-800",
  ];
  return colors[label.length % colors.length];
};

interface KanbanBoardProps {
  projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const {
    issues,
    isLoading,
    fetchIssuesByProject,
    updateExistingIssue,
    updateIssueInPlace,
    removeIssue,
  } = useIssue();
  const { currentProject, getProjectByIdFromState, fetchProjectById } =
    useProjects();

  const [editingIssue, setEditingIssue] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<any>(false);
  const [assigningIssue, setAssigningIssue] = useState<any>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "",
    description: "",
    priority: "",
    status: "",
  });

  const [selectedAssigneeEmail, setSelectedAssigneeEmail] =
    useState<string>("");
  const [draggedIssue, setDraggedIssue] = useState<any>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(
    null
  );
  const projectData = currentProject || getProjectByIdFromState(projectId);
  const projectMembers = projectData?.members || [];

  // Fetch issues when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchIssuesByProject(projectId);
    }
  }, [projectId, fetchIssuesByProject]);

  useEffect(() => {
    if (projectId && !currentProject) {
      fetchProjectById(projectId);
    }
  }, [projectId, currentProject, fetchProjectById]);
  // Transform issues into columns based on status
  const columns = [
    {
      id: "todo",
      title: "To Do",
      status: "To Do" as const,
      issues: issues.filter((issue) => issue.status === "To Do"),
    },
    {
      id: "inprogress",
      title: "In Progress",
      status: "In Progress" as const,
      issues: issues.filter((issue) => issue.status === "In Progress"),
    },
    {
      id: "review",
      title: "In Review",
      status: "In Review" as const,
      issues: issues.filter((issue) => issue.status === "In Review"),
    },
    {
      id: "done",
      title: "Done",
      status: "Done" as const,
      issues: issues.filter((issue) => issue.status === "Done"),
    },
  ];

  const handleDragStart = (issue: any, columnId: string) => {
    setDraggedIssue(issue);
    setDraggedFromColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedIssue || !draggedFromColumn) return;

    if (draggedFromColumn === targetColumnId) {
      setDraggedIssue(null);
      setDraggedFromColumn(null);
      return;
    }

    // Find the target column to get the new status
    const targetColumn = columns.find((col) => col.id === targetColumnId);
    if (!targetColumn) return;

    const newStatus = targetColumn.status;

    try {
      //update UI immediately
      updateIssueInPlace(draggedIssue._id, { status: newStatus });

      // API call to update the issue
      await updateExistingIssue(draggedIssue._id, { status: newStatus });

      console.log(`Issue ${draggedIssue._id} moved to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update issue status:", error);
      updateIssueInPlace(draggedIssue._id, { status: draggedIssue.status });
    }

    setDraggedIssue(null);
    setDraggedFromColumn(null);
  };
  const handleEditIssue = (issue: any) => {
    setEditingIssue(issue);
    setEditForm({
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      status: issue.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingIssue) return;

    try {
      await updateExistingIssue(editingIssue._id, {
        ...editForm,
        status: editForm.status as
          | "To Do"
          | "In Progress"
          | "In Review"
          | "Done"
          | undefined,
        priority: editForm.priority as
          | "Low"
          | "Medium"
          | "High"
          | "Critical"
          | undefined,
      });
      setIsEditDialogOpen(false);
      setEditingIssue(null);
      console.log("Issue updated successfully");
    } catch (error) {
      console.error("Failed to update issue:", error);
    }
  };

  const handleAssignTo = (issue: any) => {
    setAssigningIssue(issue);
    // Set current assignee if exists
    const currentAssignee = issue.assignee?._id || issue.assignee?.email;
    const currentMember = projectMembers.find(
      (member) =>
        member._id === currentAssignee || member.email === currentAssignee
    );
    setSelectedAssigneeEmail(issue.assignee?.email || "");
    setIsAssignDialogOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!assigningIssue) return;

    try {
      let assigneeData = null;

      if (selectedAssigneeEmail) {
        const selectedMember = projectMembers.find(
          (member) => member.email === selectedAssigneeEmail
        );
        if (selectedMember) {
          assigneeData = {
            name: selectedMember.name,
            email: selectedMember.email,
            avatar: selectedMember.avatar,
          };
        }
      }

      await updateExistingIssue(assigningIssue._id, {
        assignee: assigneeData ?? undefined,
      });
      setIsAssignDialogOpen(false);
      setAssigningIssue(null);
      setSelectedAssigneeEmail("");
      console.log("Issue assignment updated successfully");
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  };

  const handleDeleteIssue = async (issue: any) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;

    try {
      await removeIssue(issue._id);
      console.log("Issue deleted successfully");
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div
          key={column.id}
          className="space-y-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {column.title}
              <Badge variant="secondary" className="text-xs">
                {column.issues.length}
              </Badge>
            </h3>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 min-h-[400px]">
            {column.issues.map((issue) => (
              <Card
                key={issue._id} // Use _id instead of id
                className="cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={() => handleDragStart(issue, column.id)}
              >
                <CardHeader className="pb-1">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium leading-tight">
                      {issue.title}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditIssue(issue)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Issue
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignTo(issue)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign to...
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteIssue(issue)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(issue.status)}`}
                    >
                      {issue.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(issue.priority)}`}
                    >
                      {issue.priority}
                    </Badge>
                    <p className="text-red-50">{issue?.assignee?.name}</p>
                  </div>

                  {issue.labels && issue.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {issue.labels.map((label, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className={`text-xs ${getLabelColor(label)}`}
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {/* Remove comments and attachments for now since they're not in your Issue interface */}
                    </div>
                    {issue.assignee && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={issue.assignee.avatar || "/placeholder.svg"}
                          alt={issue.assignee.name}
                        />
                        <AvatarFallback className="text-xs">
                          {issue.assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Issue title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Issue description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={editForm.priority}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Issue Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assignee-select" className="mb-2">Select Assignee</Label>
              <Select
                value={selectedAssigneeEmail}
                onValueChange={setSelectedAssigneeEmail}
  
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {projectMembers.map((member) => (
                    <SelectItem
                      key={member._id || member.email}
                      value={member.email}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
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
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {member.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {projectMembers.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No team members found. Add members to the project first.
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAssignment}>
                {selectedAssigneeEmail && selectedAssigneeEmail !== 'unassigned'  ? "Assign" : "Unassign"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
