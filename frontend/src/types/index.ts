export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  totalPoints: number;
  completedTopics: number;
  completedTasks: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  order: number;
  isPublished: boolean;
  topics?: Topic[];
  totalTopics?: number;
  totalTasks?: number;
}

export interface Topic {
  id: string;
  name: string;
  content: string;
  order: number;
  isPublished: boolean;
  courseId: string;
  course?: Course;
  tasks?: Task[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  type: 'auto' | 'manual';
  starterCode?: string;
  tests?: Test[];
  solution?: string;
  criteria?: string;
  maxPoints: number;
  isRequired: boolean;
  isPublished: boolean;
  topicId: string;
  topic?: Topic;
}

export interface Test {
  name: string;
  testCode: string;
  expected: any;
}

export interface Submission {
  id: string;
  userId: string;
  user?: User;
  taskId: string;
  task?: Task;
  code?: string;
  solutionText?: string;
  filePath?: string;
  status: 'pending' | 'approved' | 'rejected';
  points: number;
  testResults?: string;
  adminComment?: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
