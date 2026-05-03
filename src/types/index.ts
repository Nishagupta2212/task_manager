export type Role = 'admin' | 'member';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  isApproved: boolean;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string | null;
  status: TaskStatus;
  dueDate: number | null;
  createdBy: string;
  createdAt: number;
}
