import { useAppSelector, useAppDispatch } from './redux';
import { useCallback } from 'react';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  clearError,
  setCurrentProject,
  clearCurrentProject,
  updateProjectLocally,
  addProjectLocally,
  removeProjectLocally,
  type CreateProjectFormData,
  type UpdateProjectFormData,
  type AddMemberFormData,
  type Project,
} from '../store/slices/projectSlice';

export const useProjects = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects);

  // Fetch all projects
  const fetchAllProjects = useCallback(async () => {
    const result = await dispatch(getAllProjects());
    return result;
  }, [dispatch]);

  // Fetch project by ID
  const fetchProjectById = useCallback(
    async (id: string) => {
      const result = await dispatch(getProjectById(id));
      return result;
    },
    [dispatch]
  );

  // Create new project
  const createNewProject = useCallback(
    async (formData: CreateProjectFormData) => {
      const result = await dispatch(createProject(formData));
      return result;
    },
    [dispatch]
  );

  // Update existing project
  const updateExistingProject = useCallback(
    async (id: string, formData: UpdateProjectFormData) => {
      const result = await dispatch(updateProject({ id, formData }));
      return result;
    },
    [dispatch]
  );

  // Delete project
  const deleteExistingProject = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteProject(id));
      return result;
    },
    [dispatch]
  );

  // Add member to project
  const addMemberToProject = useCallback(
    async (projectId: string, memberData: AddMemberFormData) => {
      const result = await dispatch(addMember({ projectId, memberData }));
      return result;
    },
    [dispatch]
  );

  // Remove member from project
  const removeMemberFromProject = useCallback(
    async (projectId: string, memberId: string) => {
      const result = await dispatch(removeMember({ projectId, memberId }));
      return result;
    },
    [dispatch]
  );

  // Set current project
  const selectCurrentProject = useCallback(
    (project: Project | null) => {
      dispatch(setCurrentProject(project));
    },
    [dispatch]
  );

  // Clear current project
  const clearCurrentProjectSelection = useCallback(() => {
    dispatch(clearCurrentProject());
  }, [dispatch]);

  // Update project locally (optimistic updates)
  const updateProjectInState = useCallback(
    (id: string, updates: Partial<Project>) => {
      dispatch(updateProjectLocally({ id, updates }));
    },
    [dispatch]
  );

  // Add project locally (optimistic updates)
  const addProjectToState = useCallback(
    (project: Project) => {
      dispatch(addProjectLocally(project));
    },
    [dispatch]
  );

  // Remove project locally (optimistic updates)
  const removeProjectFromState = useCallback(
    (id: string) => {
      dispatch(removeProjectLocally(id));
    },
    [dispatch]
  );

  // Clear error
  const clearProjectError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper functions for common operations
  const getProjectByIdFromState = useCallback(
    (id: string) => {
      return projects.projects.find(project => project._id === id);
    },
    [projects.projects]
  );

  const getProjectsByStatus = useCallback(
    (status: Project['status']) => {
      return projects.projects.filter(project => project.status === status);
    },
    [projects.projects]
  );

  const getProjectsByPriority = useCallback(
    (priority: Project['priority']) => {
      return projects.projects.filter(project => project.priority === priority);
    },
    [projects.projects]
  );

  const getProjectsByTag = useCallback(
    (tag: string) => {
      return projects.projects.filter(project => 
        project.tags.includes(tag)
      );
    },
    [projects.projects]
  );

  const searchProjects = useCallback(
    (searchTerm: string) => {
      const term = searchTerm.toLowerCase();
      return projects.projects.filter(project =>
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.tags.some(tag => tag.toLowerCase().includes(term))
      );
    },
    [projects.projects]
  );

  // Get projects with overdue dates
  const getOverdueProjects = useCallback(() => {
    const now = new Date();
    return projects.projects.filter(project => 
      project.dueDate && 
      new Date(project.dueDate) < now && 
      project.status !== 'Completed'
    );
  }, [projects.projects]);

  // Get projects by member
  const getProjectsByMember = useCallback(
    (memberEmail: string) => {
      return projects.projects.filter(project =>
        project.members.some(member => member.email === memberEmail)
      );
    },
    [projects.projects]
  );

  return {
    // State
    ...projects,
    
    // Actions
    fetchAllProjects,
    fetchProjectById,
    createNewProject,
    updateExistingProject,
    deleteExistingProject,
    addMemberToProject,
    removeMemberFromProject,
    selectCurrentProject,
    clearCurrentProjectSelection,
    updateProjectInState,
    addProjectToState,
    removeProjectFromState,
    clearProjectError,
    
    // Helper functions
    getProjectByIdFromState,
    getProjectsByStatus,
    getProjectsByPriority,
    getProjectsByTag,
    searchProjects,
    getOverdueProjects,
    getProjectsByMember,
  };
};