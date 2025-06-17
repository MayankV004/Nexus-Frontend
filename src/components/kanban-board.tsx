"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, MessageSquare, Paperclip } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Issue {
  id: number
  title: string
  description: string
  priority: "Low" | "Medium" | "High" | "Critical"
  assignee: {
    id: number
    name: string
    avatar: string
  }
  labels: string[]
  comments: number
  attachments: number
  createdAt: string
}

interface Column {
  id: string
  title: string
  issues: Issue[]
}

// Mock data
const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    issues: [
      {
        id: 1,
        title: "Implement user authentication",
        description: "Add login and registration functionality",
        priority: "High",
        assignee: {
          id: 1,
          name: "John Doe",
          avatar: "/placeholder-user.jpg",
        },
        labels: ["Backend", "Security"],
        comments: 3,
        attachments: 1,
        createdAt: "2024-01-15",
      },
      {
        id: 2,
        title: "Design product catalog page",
        description: "Create responsive product listing with filters",
        priority: "Medium",
        assignee: {
          id: 2,
          name: "Jane Smith",
          avatar: "/placeholder-user.jpg",
        },
        labels: ["Frontend", "UI/UX"],
        comments: 1,
        attachments: 2,
        createdAt: "2024-01-16",
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    issues: [
      {
        id: 3,
        title: "Payment gateway integration",
        description: "Integrate Stripe payment processing",
        priority: "Critical",
        assignee: {
          id: 3,
          name: "Mike Johnson",
          avatar: "/placeholder-user.jpg",
        },
        labels: ["Backend", "Payment"],
        comments: 5,
        attachments: 0,
        createdAt: "2024-01-14",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    issues: [
      {
        id: 4,
        title: "Shopping cart functionality",
        description: "Add/remove items, quantity updates",
        priority: "High",
        assignee: {
          id: 4,
          name: "Sarah Wilson",
          avatar: "/placeholder-user.jpg",
        },
        labels: ["Frontend", "Cart"],
        comments: 2,
        attachments: 1,
        createdAt: "2024-01-13",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    issues: [
      {
        id: 5,
        title: "Setup project structure",
        description: "Initialize Next.js project with TypeScript",
        priority: "Medium",
        assignee: {
          id: 1,
          name: "John Doe",
          avatar: "/placeholder-user.jpg",
        },
        labels: ["Setup", "Infrastructure"],
        comments: 0,
        attachments: 0,
        createdAt: "2024-01-10",
      },
    ],
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-800 border-red-200"
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getLabelColor = (label: string) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-cyan-100 text-cyan-800",
  ]
  return colors[label.length % colors.length]
}

interface KanbanBoardProps {
  projectId: number
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null)
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null)

  const handleDragStart = (issue: Issue, columnId: string) => {
    setDraggedIssue(issue)
    setDraggedFromColumn(columnId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()

    if (!draggedIssue || !draggedFromColumn) return

    if (draggedFromColumn === targetColumnId) {
      setDraggedIssue(null)
      setDraggedFromColumn(null)
      return
    }

    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((column) => {
        if (column.id === draggedFromColumn) {
          return {
            ...column,
            issues: column.issues.filter((issue) => issue.id !== draggedIssue.id),
          }
        }
        if (column.id === targetColumnId) {
          return {
            ...column,
            issues: [...column.issues, draggedIssue],
          }
        }
        return column
      })

      // TODO: Update issue status via API
      console.log(`Moving issue ${draggedIssue.id} from ${draggedFromColumn} to ${targetColumnId}`)

      return newColumns
    })

    setDraggedIssue(null)
    setDraggedFromColumn(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, column.id)}>
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
                key={issue.id}
                className="cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={() => handleDragStart(issue, column.id)}
              >
                <CardHeader className="pb-1">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium leading-tight">{issue.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Issue</DropdownMenuItem>
                        <DropdownMenuItem>Assign to...</DropdownMenuItem>
                        <DropdownMenuItem>Add Label</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-gray-600 line-clamp-2">{issue.description}</p>

                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </Badge>
                  </div>

                  {issue.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {issue.labels.map((label, index) => (
                        <Badge key={index} variant="secondary" className={`text-xs ${getLabelColor(label)}`}>
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
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
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} alt={issue.assignee.name} />
                      <AvatarFallback className="text-xs">
                        {issue.assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
