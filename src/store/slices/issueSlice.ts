import axios from "@/lib/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Assignee {
  name: string;
  email?: string;
  avatar?: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: Assignee;
  projectId: string;
  dueDate: Date;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IssueState {
  issues: Issue[];
  currentIssue: Issue | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface CreateIssueFormData {
  title: string;
  description?: string;
  status?: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee?: Assignee;
  projectId: string;
  dueDate?: Date;
  labels?: string[];
}

export interface UpdateIssueFormData {
  title?: string;
  description?: string;
  status?: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee?: Assignee;
  dueDate?: Date;
  labels?: string[];
}

// API Response interfaces to match controller responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  errors?: string[];
  error?: string;
}

const initialState: IssueState = {
  issues: [],
  currentIssue: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

// Get all issues for a project
export const getIssuesByProject = createAsyncThunk(
  "issues/getIssuesByProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/issues/project/${projectId}`);
      const data: ApiResponse<Issue[]> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch issues");
      }
      
      return {
        data: data.data || [],
        count: data.count || 0
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to fetch issues";
      return rejectWithValue(errorMessage);
    }
  }
);

// Get issue by ID
export const getIssueById = createAsyncThunk(
  "issues/getIssueById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/issues/${id}`);
      const data: ApiResponse<Issue> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch issue");
      }
      
      return data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to fetch issue";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create new issue
export const createIssue = createAsyncThunk(
  "issues/createIssue",
  async (formData: CreateIssueFormData, { rejectWithValue }) => {
    try {
      // Frontend validation to match backend requirements
      if (!formData.title || formData.title.trim() === '') {
        return rejectWithValue("Issue title is required");
      }

      if (formData.title.trim().length < 3) {
        return rejectWithValue("Issue title must be at least 3 characters long");
      }

      if (formData.title.trim().length > 200) {
        return rejectWithValue("Issue title cannot exceed 200 characters");
      }

      if (!formData.projectId) {
        return rejectWithValue("Project ID is required");
      }

      if (formData.description && formData.description.length > 2000) {
        return rejectWithValue("Description cannot exceed 2000 characters");
      }

      // Validate assignee email if provided
      if (formData.assignee?.email) {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.assignee.email)) {
          return rejectWithValue("Please enter a valid email for assignee");
        }
      }

      // Validate due date if provided
      if (formData.dueDate && new Date(formData.dueDate) <= new Date()) {
        return rejectWithValue("Due date must be in the future");
      }

      // Validate labels if provided
      if (formData.labels && Array.isArray(formData.labels)) {
        for (const label of formData.labels) {
          if (label.length > 30) {
            return rejectWithValue("Label cannot exceed 30 characters");
          }
        }
      }

      const response = await axios.post("/api/v1/issues", formData);
      const data: ApiResponse<Issue> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to create issue");
      }
      
      return data.data;
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        return rejectWithValue(error.response.data.errors.join(", "));
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to create issue";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update issue
export const updateIssue = createAsyncThunk(
  "issues/updateIssue",
  async (
    { id, formData }: { id: string; formData: UpdateIssueFormData },
    { rejectWithValue }
  ) => {
    try {
      // Frontend validation for updates
      if (formData.title !== undefined) {
        if (!formData.title || formData.title.trim() === '') {
          return rejectWithValue("Issue title cannot be empty");
        }
        
        if (formData.title.trim().length < 3) {
          return rejectWithValue("Issue title must be at least 3 characters long");
        }

        if (formData.title.trim().length > 200) {
          return rejectWithValue("Issue title cannot exceed 200 characters");
        }
      }

      if (formData.description !== undefined && formData.description.length > 2000) {
        return rejectWithValue("Description cannot exceed 2000 characters");
      }

      // Validate assignee email if provided
      if (formData.assignee?.email) {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.assignee.email)) {
          return rejectWithValue("Please enter a valid email for assignee");
        }
      }

      // Validate due date if provided
      if (formData.dueDate && new Date(formData.dueDate) <= new Date()) {
        return rejectWithValue("Due date must be in the future");
      }

      // Validate labels if provided
      if (formData.labels && Array.isArray(formData.labels)) {
        for (const label of formData.labels) {
          if (label.length > 30) {
            return rejectWithValue("Label cannot exceed 30 characters");
          }
        }
      }

      const response = await axios.put(`/api/v1/issues/${id}`, formData);
      const data: ApiResponse<Issue> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to update issue");
      }
      
      return data.data;
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        return rejectWithValue(error.response.data.errors.join(", "));
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to update issue";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete issue
export const deleteIssue = createAsyncThunk(
  "issues/deleteIssue",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/v1/issues/${id}`);
      const data: ApiResponse<any> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to delete issue");
      }
      
      return { id, message: data.message };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to delete issue";
      return rejectWithValue(errorMessage);
    }
  }
);

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentIssue: (state, action: PayloadAction<Issue | null>) => {
      state.currentIssue = action.payload;
    },
    clearCurrentIssue: (state) => {
      state.currentIssue = null;
    },
    clearIssues: (state) => {
      state.issues = [];
      state.totalCount = 0;
    },
    updateIssueLocally: (state, action: PayloadAction<{ id: string; updates: Partial<Issue> }>) => {
      const { id, updates } = action.payload;
      const issueIndex = state.issues.findIndex(i => i._id === id);
      if (issueIndex !== -1) {
        state.issues[issueIndex] = { ...state.issues[issueIndex], ...updates };
      }
      if (state.currentIssue && state.currentIssue._id === id) {
        state.currentIssue = { ...state.currentIssue, ...updates };
      }
    },
    addIssueLocally: (state, action: PayloadAction<Issue>) => {
      state.issues.unshift(action.payload);
      state.totalCount += 1;
    },
    removeIssueLocally: (state, action: PayloadAction<string>) => {
      state.issues = state.issues.filter(i => i._id !== action.payload);
      state.totalCount -= 1;
      if (state.currentIssue && state.currentIssue._id === action.payload) {
        state.currentIssue = null;
      }
    },
    // Utility action to update issue status (commonly used in Kanban boards)
    updateIssueStatus: (state, action: PayloadAction<{ id: string; status: Issue['status'] }>) => {
      const { id, status } = action.payload;
      const issueIndex = state.issues.findIndex(i => i._id === id);
      if (issueIndex !== -1) {
        state.issues[issueIndex].status = status;
      }
      if (state.currentIssue && state.currentIssue._id === id) {
        state.currentIssue.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    // Get issues by project
    builder
      .addCase(getIssuesByProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIssuesByProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.issues = action.payload.data;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(getIssuesByProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get issue by ID
    builder
      .addCase(getIssueById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIssueById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentIssue = action.payload!;
        state.error = null;
      })
      .addCase(getIssueById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create issue
    builder
      .addCase(createIssue.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.issues.unshift(action.payload!);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update issue
    builder
      .addCase(updateIssue.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedIssue = action.payload!;
        const issueIndex = state.issues.findIndex(i => i._id === updatedIssue._id);
        if (issueIndex !== -1) {
          state.issues[issueIndex] = updatedIssue;
        }
        if (state.currentIssue && state.currentIssue._id === updatedIssue._id) {
          state.currentIssue = updatedIssue;
        }
        state.error = null;
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete issue
    builder
      .addCase(deleteIssue.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload.id;
        state.issues = state.issues.filter(i => i._id !== deletedId);
        state.totalCount -= 1;
        if (state.currentIssue && state.currentIssue._id === deletedId) {
          state.currentIssue = null;
        }
        state.error = null;
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentIssue,
  clearCurrentIssue,
  clearIssues,
  updateIssueLocally,
  addIssueLocally,
  removeIssueLocally,
  updateIssueStatus,
} = issueSlice.actions;

export default issueSlice.reducer;