import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import TopicView from './pages/TopicView';
import TaskView from './pages/TaskView';
import Profile from './pages/Profile';
import MySubmissions from './pages/MySubmissions';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourseEdit from './pages/AdminCourseEdit';
import AdminTopicEdit from './pages/AdminTopicEdit';
import AdminTaskEdit from './pages/AdminTaskEdit';
import AdminSubmissions from './pages/AdminSubmissions';
import AdminSubmissionReview from './pages/AdminSubmissionReview';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<CourseView />} />
        <Route path="topics/:topicId" element={<TopicView />} />
        <Route path="tasks/:taskId" element={<TaskView />} />
        
        <Route path="profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
        <Route path="my-submissions" element={
          <PrivateRoute><MySubmissions /></PrivateRoute>
        } />
        
        {/* Admin routes */}
        <Route path="admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="admin/courses/new" element={
          <AdminRoute><AdminCourseEdit /></AdminRoute>
        } />
        <Route path="admin/courses/:courseId/edit" element={
          <AdminRoute><AdminCourseEdit /></AdminRoute>
        } />
        <Route path="admin/topics/new" element={
          <AdminRoute><AdminTopicEdit /></AdminRoute>
        } />
        <Route path="admin/topics/:topicId/edit" element={
          <AdminRoute><AdminTopicEdit /></AdminRoute>
        } />
        <Route path="admin/tasks/new" element={
          <AdminRoute><AdminTaskEdit /></AdminRoute>
        } />
        <Route path="admin/tasks/:taskId/edit" element={
          <AdminRoute><AdminTaskEdit /></AdminRoute>
        } />
        <Route path="admin/submissions" element={
          <AdminRoute><AdminSubmissions /></AdminRoute>
        } />
        <Route path="admin/submissions/:submissionId" element={
          <AdminRoute><AdminSubmissionReview /></AdminRoute>
        } />
      </Route>
    </Routes>
  );
}
