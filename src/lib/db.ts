import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Project, Task, User, Role } from '../types';

// Users
export const createUserProfile = async (uid: string, data: Omit<User, 'id' | 'createdAt'>) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...data,
    id: uid,
    createdAt: Date.now()
  });
};

export const approveUser = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { isApproved: true });
};

export const getUsers = async (): Promise<User[]> => {
  const q = query(collection(db, 'users'), orderBy('displayName'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as User);
};

// Projects
export const createProject = async (data: Omit<Project, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: Date.now()
  });
  
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
};

export const getProjects = async (): Promise<Project[]> => {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Project);
};

// Tasks
export const createTask = async (data: Omit<Task, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...data,
    createdAt: Date.now()
  });
  
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
};

export const updateTask = async (taskId: string, data: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, data);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};

export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const q = query(collection(db, 'tasks'), where('projectId', '==', projectId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Task);
};

export const getTasksByAssignee = async (assigneeId: string): Promise<Task[]> => {
  const q = query(collection(db, 'tasks'), where('assigneeId', '==', assigneeId), orderBy('dueDate', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Task);
};

export const getAllTasks = async (): Promise<Task[]> => {
  const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Task);
};
