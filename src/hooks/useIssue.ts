import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  getIssuesByProject,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  clearError,
  setCurrentIssue,
  clearCurrentIssue,
  clearIssues,
  updateIssueLocally,
  addIssueLocally,
  removeIssueLocally,
  updateIssueStatus,
  type Issue,
  type CreateIssueFormData,
  type UpdateIssueFormData,
} from '../store/slices/issueSlice';

export const useIssue = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const {
    issues,
    currentIssue,
    isLoading,
    error,
    totalCount,
  } = useAppSelector((state) => state.issues);

  // Action creators
  const fetchIssuesByProject = useCallback(
    (projectId: string) => {
      return dispatch(getIssuesByProject(projectId));
    },
    [dispatch]
  );

  const fetchIssueById = useCallback(
    (id: string) => {
      return dispatch(getIssueById(id));
    },
    [dispatch]
  );

  const createNewIssue = useCallback(
    (formData: CreateIssueFormData) => {
      return dispatch(createIssue(formData));
    },
    [dispatch]
  );

  const updateExistingIssue = useCallback(
    (id: string, formData: UpdateIssueFormData) => {
      return dispatch(updateIssue({ id, formData }));
    },
    [dispatch]
  );

  const removeIssue = useCallback(
    (id: string) => {
      return dispatch(deleteIssue(id));
    },
    [dispatch]
  );

  // Utility actions
  const clearIssueError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const selectCurrentIssue = useCallback(
    (issue: Issue | null) => {
      dispatch(setCurrentIssue(issue));
    },
    [dispatch]
  );

  const clearSelectedIssue = useCallback(() => {
    dispatch(clearCurrentIssue());
  }, [dispatch]);

  const resetIssues = useCallback(() => {
    dispatch(clearIssues());
  }, [dispatch]);

  const updateIssueInPlace = useCallback(
    (id: string, updates: Partial<Issue>) => {
      dispatch(updateIssueLocally({ id, updates }));
    },
    [dispatch]
  );

  const addIssueToList = useCallback(
    (issue: Issue) => {
      dispatch(addIssueLocally(issue));
    },
    [dispatch]
  );

  const removeIssueFromList = useCallback(
    (id: string) => {
      dispatch(removeIssueLocally(id));
    },
    [dispatch]
  );

  const changeIssueStatus = useCallback(
    (id: string, status: Issue['status']) => {
      dispatch(updateIssueStatus({ id, status }));
    },
    [dispatch]
  );

  // Utility functions
  const getIssueByIdFromState = useCallback(
    (id: string): Issue | undefined => {
      return issues.find(issue => issue._id === id);
    },
    [issues]
  );

  const getIssuesByStatus = useCallback(
    (status: Issue['status']): Issue[] => {
      return issues.filter(issue => issue.status === status);
    },
    [issues]
  );

  const getIssuesByPriority = useCallback(
    (priority: Issue['priority']): Issue[] => {
      return issues.filter(issue => issue.priority === priority);
    },
    [issues]
  );

  const getIssuesByAssignee = useCallback(
    (assigneeEmail: string): Issue[] => {
      return issues.filter(issue => issue.assignee?.email === assigneeEmail);
    },
    [issues]
  );

  const getOverdueIssues = useCallback((): Issue[] => {
    const today = new Date();
    return issues.filter(issue => 
      issue.dueDate && 
      new Date(issue.dueDate) < today && 
      issue.status !== 'Done'
    );
  }, [issues]);

  const getIssuesCount = useCallback(() => {
    return {
      total: issues.length,
      toDo: issues.filter(i => i.status === 'To Do').length,
      inProgress: issues.filter(i => i.status === 'In Progress').length,
      inReview: issues.filter(i => i.status === 'In Review').length,
      done: issues.filter(i => i.status === 'Done').length,
      overdue: getOverdueIssues().length,
    };
  }, [issues, getOverdueIssues]);

  // Search and filter utilities
  const searchIssues = useCallback(
    (query: string): Issue[] => {
      const lowercaseQuery = query.toLowerCase();
      return issues.filter(issue =>
        issue.title.toLowerCase().includes(lowercaseQuery) ||
        issue.description.toLowerCase().includes(lowercaseQuery) ||
        issue.labels.some(label => label.toLowerCase().includes(lowercaseQuery)) ||
        issue.assignee?.name?.toLowerCase().includes(lowercaseQuery) ||
        issue.assignee?.email?.toLowerCase().includes(lowercaseQuery)
      );
    },
    [issues]
  );

  const filterIssues = useCallback(
    (filters: {
      status?: Issue['status'][];
      priority?: Issue['priority'][];
      assigneeEmail?: string[];
      labels?: string[];
      hasAssignee?: boolean;
      hasDueDate?: boolean;
      isOverdue?: boolean;
    }): Issue[] => {
      return issues.filter(issue => {
        // Status filter
        if (filters.status && filters.status.length > 0) {
          if (!filters.status.includes(issue.status)) return false;
        }

        // Priority filter
        if (filters.priority && filters.priority.length > 0) {
          if (!filters.priority.includes(issue.priority)) return false;
        }

        // Assignee filter
        if (filters.assigneeEmail && filters.assigneeEmail.length > 0) {
          if (!issue.assignee?.email || !filters.assigneeEmail.includes(issue.assignee.email)) {
            return false;
          }
        }

        // Labels filter
        if (filters.labels && filters.labels.length > 0) {
          const hasMatchingLabel = filters.labels.some(label => 
            issue.labels.includes(label)
          );
          if (!hasMatchingLabel) return false;
        }

        // Has assignee filter
        if (filters.hasAssignee !== undefined) {
          const hasAssignee = !!issue.assignee?.email;
          if (filters.hasAssignee !== hasAssignee) return false;
        }

        // Has due date filter
        if (filters.hasDueDate !== undefined) {
          const hasDueDate = !!issue.dueDate;
          if (filters.hasDueDate !== hasDueDate) return false;
        }

        // Is overdue filter
        if (filters.isOverdue !== undefined) {
          const isOverdue = issue.dueDate && 
            new Date(issue.dueDate) < new Date() && 
            issue.status !== 'Done';
          if (filters.isOverdue !== !!isOverdue) return false;
        }

        return true;
      });
    },
    [issues]
  );

  const sortIssues = useCallback(
    (sortBy: 'title' | 'priority' | 'status' | 'dueDate' | 'createdAt' | 'updatedAt', 
     order: 'asc' | 'desc' = 'asc'): Issue[] => {
      const sortedIssues = [...issues].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'priority':
            const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            break;
          case 'status':
            const statusOrder = { 'To Do': 1, 'In Progress': 2, 'In Review': 3, 'Done': 4 };
            comparison = statusOrder[a.status] - statusOrder[b.status];
            break;
          case 'dueDate':
            if (!a.dueDate && !b.dueDate) comparison = 0;
            else if (!a.dueDate) comparison = 1;
            else if (!b.dueDate) comparison = -1;
            else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            break;
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
          case 'updatedAt':
            comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            break;
        }

        return order === 'desc' ? -comparison : comparison;
      });

      return sortedIssues;
    },
    [issues]
  );

  return {
    // State
    issues,
    currentIssue,
    isLoading,
    error,
    totalCount,

    // API Actions
    fetchIssuesByProject,
    fetchIssueById,
    createNewIssue,
    updateExistingIssue,
    removeIssue,

    // Utility Actions
    clearIssueError,
    selectCurrentIssue,
    clearSelectedIssue,
    resetIssues,
    updateIssueInPlace,
    addIssueToList,
    removeIssueFromList,
    changeIssueStatus,

    // Utility Functions
    getIssueByIdFromState,
    getIssuesByStatus,
    getIssuesByPriority,
    getIssuesByAssignee,
    getOverdueIssues,
    getIssuesCount,
    searchIssues,
    filterIssues,
    sortIssues,
  };
};