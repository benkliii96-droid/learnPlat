import axios from 'axios';
import type { AuthResponse, User, Course, Topic, Task, Submission } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  me: () => api.get<User>('/auth/me'),
};

// Users
export const usersApi = {
  getProfile: () => api.get<User>('/users/profile'),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/password', data),
  getStats: () => api.get('/users/stats'),
  getLeaderboard: () => api.get('/users/leaderboard'),
};

// Courses
export const coursesApi = {
  getAll: () => api.get<Course[]>('/courses'),
  getAllAdmin: () => api.get<Course[]>('/courses/all'),
  getById: (id: string) => api.get<Course>(`/courses/${id}`),
  getWithProgress: () => api.get('/courses/with-progress/user'),
  create: (data: { name: string; description: string; order: number }) =>
    api.post<Course>('/courses', data),
  update: (id: string, data: Partial<Course>) =>
    api.put<Course>(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
};

// Topics
export const topicsApi = {
  getByCourse: (courseId: string) => api.get<Topic[]>(`/topics/course/${courseId}`),
  getAllAdmin: () => api.get<Topic[]>('/topics/all'),
  getById: (id: string) => api.get<Topic>(`/topics/${id}`),
  create: (data: { courseId: string; name: string; content: string; order: number }) =>
    api.post<Topic>('/topics', data),
  update: (id: string, data: Partial<Topic>) =>
    api.put<Topic>(`/topics/${id}`, data),
  delete: (id: string) => api.delete(`/topics/${id}`),
};

// Tasks
export const tasksApi = {
  getByTopic: (topicId: string) => api.get<Task[]>(`/tasks/topic/${topicId}`),
  getAllAdmin: () => api.get<Task[]>('/tasks/all'),
  getById: (id: string) => api.get<Task>(`/tasks/${id}`),
  create: (data: any) => api.post<Task>('/tasks', data),
  update: (id: string, data: Partial<Task>) => api.put<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  search: (query: string) => api.get<Task[]>(`/tasks/search?q=${query}`),
};

// Submissions
export const submissionsApi = {
  create: (data: { taskId: string; code?: string; solutionText?: string }) =>
    api.post<Submission>('/submissions', data),
  getMy: () => api.get<Submission[]>('/submissions/my'),
  getByTask: (taskId: string) => api.get<Submission[]>(`/submissions/task/${taskId}`),
  getMyByTask: (taskId: string) => api.get<Submission[]>(`/submissions/task/${taskId}/my`),
  isTaskCompleted: (taskId: string) => api.get<{ completed: boolean }>(`/submissions/task/${taskId}/completed`),
  getPending: () => api.get<Submission[]>('/submissions/pending'),
  getById: (id: string) => api.get<Submission>(`/submissions/${id}`),
  runTest: (id: string) => api.post(`/submissions/${id}/run`),
  approve: (id: string, data: { points: number; comment: string }) =>
    api.put(`/submissions/${id}/approve`, data),
  reject: (id: string, data: { comment: string }) =>
    api.put(`/submissions/${id}/reject`, data),
};

// Progress
export const progressApi = {
  getCourseProgress: (courseId: string) => api.get(`/progress/course/${courseId}`),
  getOverall: () => api.get('/progress/overall'),
  updateTopicsProgress: (courseId: string) => api.post(`/progress/update-topics/${courseId}`),
};

export default api;
