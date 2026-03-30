import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursesApi, topicsApi, tasksApi, submissionsApi } from '../services/api';

export default function AdminDashboard() {
  const { data: courses } = useQuery({
    queryKey: ['courses-admin'],
    queryFn: async () => {
      const response = await coursesApi.getAllAdmin();
      return response.data;
    },
  });

  const { data: topics } = useQuery({
    queryKey: ['topics-admin'],
    queryFn: async () => {
      const response = await topicsApi.getAllAdmin();
      return response.data;
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks-admin'],
    queryFn: async () => {
      const response = await tasksApi.getAllAdmin();
      return response.data;
    },
  });

  const { data: pendingSubmissions } = useQuery({
    queryKey: ['pending-submissions'],
    queryFn: async () => {
      const response = await submissionsApi.getPending();
      return response.data;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Админ-панель</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{courses?.length || 0}</div>
          <div className="text-gray-600">Курсов</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">{topics?.length || 0}</div>
          <div className="text-gray-600">Тем</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-purple-600">{tasks?.length || 0}</div>
          <div className="text-gray-600">Заданий</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-yellow-600">{pendingSubmissions?.length || 0}</div>
          <div className="text-gray-600">На проверке</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Управление курсами</h2>
            <Link
              to="/admin/courses/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Добавить курс
            </Link>
          </div>
          <div className="space-y-2">
            {courses?.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{course.name}</div>
                  <div className="text-sm text-gray-500">
                    {course.topics?.length || 0} тем
                  </div>
                </div>
                <Link
                  to={`/admin/courses/${course.id}/edit`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Редактировать
                </Link>
              </div>
            ))}
            {(!courses || courses.length === 0) && (
              <p className="text-gray-600">Курсы не созданы</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Управление темами</h2>
            <Link
              to="/admin/topics/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Добавить тему
            </Link>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {topics?.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{topic.name}</div>
                  <div className="text-sm text-gray-500">
                    {topic.course?.name} • {topic.tasks?.length || 0} заданий
                  </div>
                </div>
                <Link
                  to={`/admin/topics/${topic.id}/edit`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Редактировать
                </Link>
              </div>
            ))}
            {(!topics || topics.length === 0) && (
              <p className="text-gray-600">Темы не созданы</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Управление заданиями</h2>
            <Link
              to="/admin/tasks/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Добавить задание
            </Link>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tasks?.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{task.name}</div>
                  <div className="text-sm text-gray-500">
                    {task.topic?.name} • {task.type === 'auto' ? 'Авто' : 'Ручная'} • {task.maxPoints} баллов
                  </div>
                </div>
                <Link
                  to={`/admin/tasks/${task.id}/edit`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Редактировать
                </Link>
              </div>
            ))}
            {(!tasks || tasks.length === 0) && (
              <p className="text-gray-600">Задания не созданы</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Проверка заданий</h2>
            <Link
              to="/admin/submissions"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Все решения
            </Link>
          </div>
          <div className="space-y-2">
            {pendingSubmissions?.length === 0 && (
              <p className="text-gray-600">Нет заданий на проверку</p>
            )}
            {pendingSubmissions?.slice(0, 5).map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{submission.user?.name}</div>
                  <div className="text-sm text-gray-500">
                    {submission.task?.name}
                  </div>
                </div>
                <Link
                  to={`/admin/submissions/${submission.id}`}
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Проверить
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
