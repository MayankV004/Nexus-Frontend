"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { X } from "lucide-react"
import {type Member} from '@/store/slices/projectSlice'
import { useIssue } from "@/hooks/useIssue"
import type { CreateIssueFormData } from "@/store/slices/issueSlice"

interface CreateIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  projectMembers: Member[]
}

const priorityOptions = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "Critical", label: "Critical", color: "bg-red-100 text-red-800" },
] as const

const issueTypes = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
  { value: "task", label: "Task" },
]

const predefinedLabels = [
  "Frontend",
  "Backend",
  "UI/UX",
  "Bug",
  "Feature",
  "Security",
  "Performance",
  "Documentation",
  "Testing",
  "Infrastructure",
]

export function CreateIssueDialog({ open, onOpenChange, projectId, projectMembers }: CreateIssueDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    priority: "" as "Low" | "Medium" | "High" | "Critical" | "",
    assigneeId: "",
    labels: [] as string[],
  })
  
  const { createNewIssue, isLoading } = useIssue()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    if (!formData.type) {
      toast.error("Issue type is required")
      return
    }

    if (!formData.priority) {
      toast.error("Priority is required")
      return
    }

    try {
      // Find the selected assignee from project members
      const selectedAssignee = formData.assigneeId 
        ? projectMembers.find((member) => member._id?.toString() === formData.assigneeId)
        : undefined

      // Prepare the issue data according to CreateIssueFormData interface
      const issueData: CreateIssueFormData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        projectId,
        labels: formData.labels.length > 0 ? formData.labels : undefined,
        assignee: selectedAssignee ? {
          name: selectedAssignee.name,
          email: selectedAssignee.email,
          avatar: selectedAssignee.avatar
        } : undefined,
        status: "To Do", // Default status
      }

      console.log("Creating issue:", issueData)

      // Create the issue using Redux thunk
      const result = await createNewIssue(issueData)
      
      // Check if the action was fulfilled
      if (result.type === 'issues/createIssue/fulfilled') {
        toast.success("Issue created successfully", {
          description: "The issue has been added to the project.",
        })

        // Reset form and close dialog
        setFormData({
          title: "",
          description: "",
          type: "",
          priority: "",
          assigneeId: "",
          labels: [],
        })
        onOpenChange(false)
      } else {
        // Handle rejection case
        const errorMessage = result.payload as string || "Failed to create issue"
        toast.error("Failed to create issue", {
          description: errorMessage,
        })
      }
    } catch (error) {
      console.error("Error creating issue:", error)
      toast.error("Failed to create issue", {
        description: "Something went wrong. Please try again.",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addLabel = (label: string) => {
    if (!formData.labels.includes(label)) {
      setFormData((prev) => ({
        ...prev,
        labels: [...prev.labels, label],
      }))
    }
  }

  const removeLabel = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l !== label),
    }))
  }

  const selectedAssignee = projectMembers.find((member) => member._id?.toString() === formData.assigneeId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>Add a new issue to track bugs, features, or tasks in your project.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter issue title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-xs ${priority.color}`}>
                          {priority.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={formData.assigneeId} onValueChange={(value) => handleInputChange("assigneeId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Assign to team member">
                  {selectedAssignee && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={selectedAssignee.avatar || "/placeholder.svg"} alt={selectedAssignee.name} />
                        <AvatarFallback className="text-xs">
                          {selectedAssignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{selectedAssignee.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projectMembers
                  .filter((member) => member._id !== undefined && member._id !== null)
                  .map((member) => (
                    <SelectItem key={member._id!.toString()} value={member._id!.toString()}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.role}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.labels.map((label) => (
                <Badge key={label} variant="secondary" className="flex items-center gap-1">
                  {label}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeLabel(label)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {predefinedLabels
                .filter((label) => !formData.labels.includes(label))
                .map((label) => (
                  <Button
                    key={label}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addLabel(label)}
                    className="text-xs"
                  >
                    + {label}
                  </Button>
                ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title || !formData.type || !formData.priority}>
              {isLoading ? "Creating..." : "Create Issue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}