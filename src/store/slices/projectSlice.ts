import axios from "@/lib/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Member {
  _id?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  progress: number;
  issues: number;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: Date;
  template: string;
  tags: string[];
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface CreateProjectFormData {
  name: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: Date;
  template?: string;
  tags?: string[];
  members?: Member[];
}

export interface UpdateProjectFormData {
  name?: string;
  description?: string;
  progress?: number;
  issues?: number;
  status?: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: Date;
  template?: string;
  tags?: string[];
}

export interface AddMemberFormData {
  name: string;
  email: string;
  role: string;
  avatar?: string;
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

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

// Get all projects
export const getAllProjects = createAsyncThunk(
  "projects/getAllProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/projects");
      const data: ApiResponse<Project[]> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch projects");
      }
      
      return {
        data: data.data || [],
        count: data.count || 0
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to fetch projects";
      return rejectWithValue(errorMessage);
    }
  }
);

// Get project by ID
export const getProjectById = createAsyncThunk(
  "projects/getProjectById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/projects/${id}`);
      const data: ApiResponse<Project> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch project");
      }
      
      return data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to fetch project";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create new project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (formData: CreateProjectFormData, { rejectWithValue }) => {
    try {
      // Validate required fields on frontend before sending
      if (!formData.name || formData.name.trim() === '') {
        return rejectWithValue("Project name is required");
      }

      // Validate members if provided
      if (formData.members && Array.isArray(formData.members)) {
        for (const member of formData.members) {
          if (!member.name || !member.email || !member.role) {
            return rejectWithValue("All members must have name, email, and role");
          }
        }
      }

      const response = await axios.post("/api/v1/projects", formData);
      const data: ApiResponse<Project> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to create project");
      }
      
      return data.data;
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        return rejectWithValue(error.response.data.errors.join(", "));
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to create project";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (
    { id, formData }: { id: string; formData: UpdateProjectFormData },
    { rejectWithValue }
  ) => {
    try {
      // Validate name if provided
      if (formData.name !== undefined && (!formData.name || formData.name.trim() === '')) {
        return rejectWithValue("Project name cannot be empty");
      }

      const response = await axios.put(`/api/v1/projects/${id}`, formData);
      const data: ApiResponse<Project> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to update project");
      }
      
      return data.data;
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        return rejectWithValue(error.response.data.errors.join(", "));
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to update project";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/v1/projects/${id}`);
      const data: ApiResponse<any> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to delete project");
      }
      
      return { id, message: data.message };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to delete project";
      return rejectWithValue(errorMessage);
    }
  }
);

// Add member to project
export const addMember = createAsyncThunk(
  "projects/addMember",
  async (
    { projectId, memberData }: { projectId: string; memberData: AddMemberFormData },
    { rejectWithValue }
  ) => {
    try {
      // Validate required fields
      if (!memberData.name || !memberData.email || !memberData.role) {
        return rejectWithValue("Name, email, and role are required for member");
      }

      const response = await axios.post(
        `/api/v1/projects/${projectId}/members`,
        memberData
      );
      const data: ApiResponse<Project> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to add member");
      }
      
      return data.data;
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        return rejectWithValue(error.response.data.errors.join(", "));
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to add member";
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove member from project
export const removeMember = createAsyncThunk(
  "projects/removeMember",
  async (
    { projectId, memberId }: { projectId: string; memberId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete(
        `/api/v1/projects/${projectId}/members/${memberId}`
      );
      const data: ApiResponse<Project> = response.data;
      
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to remove member");
      }
      
      return data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to remove member";
      return rejectWithValue(errorMessage);
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    updateProjectLocally: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const { id, updates } = action.payload;
      const projectIndex = state.projects.findIndex(p => p._id === id);
      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...updates };
      }
      if (state.currentProject && state.currentProject._id === id) {
        state.currentProject = { ...state.currentProject, ...updates };
      }
    },
    addProjectLocally: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload);
      state.totalCount += 1;
    },
    removeProjectLocally: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p._id !== action.payload);
      state.totalCount -= 1;
      if (state.currentProject && state.currentProject._id === action.payload) {
        state.currentProject = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Get all projects
    builder
      .addCase(getAllProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.data;
        state.totalCount = action.payload.count;
        state.error = null;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get project by ID
    builder
      .addCase(getProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload!;
        state.error = null;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.unshift(action.payload!);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update project
    builder
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProject = action.payload!;
        const projectIndex = state.projects.findIndex(p => p._id === updatedProject._id);
        if (projectIndex !== -1) {
          state.projects[projectIndex] = updatedProject;
        }
        if (state.currentProject && state.currentProject._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload.id;
        state.projects = state.projects.filter(p => p._id !== deletedId);
        state.totalCount -= 1;
        if (state.currentProject && state.currentProject._id === deletedId) {
          state.currentProject = null;
        }
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add member
    builder
      .addCase(addMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProject = action.payload!;
        const projectIndex = state.projects.findIndex(p => p._id === updatedProject._id);
        if (projectIndex !== -1) {
          state.projects[projectIndex] = updatedProject;
        }
        if (state.currentProject && state.currentProject._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
        state.error = null;
      })
      .addCase(addMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove member
    builder
      .addCase(removeMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProject = action.payload!;
        const projectIndex = state.projects.findIndex(p => p._id === updatedProject._id);
        if (projectIndex !== -1) {
          state.projects[projectIndex] = updatedProject;
        }
        if (state.currentProject && state.currentProject._id === updatedProject._id) {
          state.currentProject = updatedProject;
        }
        state.error = null;
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentProject,
  clearCurrentProject,
  updateProjectLocally,
  addProjectLocally,
  removeProjectLocally,
} = projectSlice.actions;

export default projectSlice.reducer;