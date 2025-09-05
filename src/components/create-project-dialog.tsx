"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, FolderOpen, X } from "lucide-react";
import { useProjects } from "@/hooks/useProject";
import type { CreateProjectFormData } from "@/store/slices/projectSlice";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const priorityOptions = [
  {
    value: "Low",
    label: "Low",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    value: "Medium",
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    value: "High",
    label: "High",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  {
    value: "Critical",
    label: "Critical",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
];

const projectTemplates = [
  "Web Development",
  "Mobile App",
  "API Development",
  "UI/UX Design",
  "Data Analysis",
  "Marketing Campaign",
  "Research",
  "Infrastructure",
];

export function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const { createNewProject, isLoading } = useProjects();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "",
    dueDate: "",
    template: "",
    tags: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const projectData: CreateProjectFormData = {
        name: formData.name,
        description: formData.description || undefined,
        priority: formData.priority
          ? (formData.priority as "Low" | "Medium" | "High" | "Critical")
          : undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        template: formData.template || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        members: [], // Initialize with empty array or add member selection logic
      };

      // Call the createNewProject function from useProjects hook
      const result = await createNewProject(projectData);

      // Check if the result was successful
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Project created successfully! 🎉", {
          description: "Your new project has been set up and is ready to go.",
        });

        // Reset form and close dialog
        setFormData({
          name: "",
          description: "",
          priority: "",
          dueDate: "",
          template: "",
          tags: [],
        });
        onOpenChange(false);
      } else {
        // Handle the rejection case
        const errorMessage =
          (result.payload as string) || "Failed to create project";
        toast.error("Failed to create project", {
          description: errorMessage,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          description: "Something went wrong. Please try again.",
        });
      } else {
        toast.error("Failed to create project", {
          description: "Something went wrong. Please try again.",
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <FolderOpen className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-xl">Create New Project</DialogTitle>
              <DialogDescription>
                Set up a new project to start tracking your work and
                collaborating with your team.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Project Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your project goals and objectives"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority *
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="transition-all duration-200">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${priority.color}`}
                        >
                          {priority.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template" className="text-sm font-medium">
              Project Template
            </Label>
            <Select
              value={formData.template}
              onValueChange={(value) => handleInputChange("template", value)}
            >
              <SelectTrigger className="transition-all duration-200">
                <SelectValue placeholder="Choose a template (optional)" />
              </SelectTrigger>
              <SelectContent>
                {projectTemplates.map((template) => (
                  <SelectItem
                    key={template}
                    value={template.toLowerCase().replace(/\s+/g, "-")}
                  >
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
                >
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {projectTemplates
                .filter((template) => !formData.tags.includes(template))
                .slice(0, 6)
                .map((template) => (
                  <Button
                    key={template}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(template)}
                    className="text-xs transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-950"
                  >
                    + {template}
                  </Button>
                ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.priority}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
