import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { coursesApi, usersApi } from '../services/api';

export default function Home() {
  const { user } = useAuth();

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await coursesApi.getAll();
      return response.data.map((course: any) => ({
        ...course,
        totalTopics: course.topics?.length || 0,
        totalTasks: course.topics?.reduce((acc: number, topic: any) => acc + (topic.tasks?.length || 0), 0) || 0,
      }));
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await usersApi.getStats();
      return response.data;
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Добро пожаловать на платформу обучения программированию
        </h1>
        <p className="text-xl text-gray-600">
          Изучайте JavaScript, HTML+CSS, PHP и другие языки программирования
        </p>
      </div>

      {user && (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Ваш прогресс, {user.name}!
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats?.completedTopics || 0}
              </div>
              <div className="text-sm text-gray-600">Тем пройдено</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats?.completedTasks || 0}
              </div>
              <div className="text-sm text-gray-600">Заданий выполнено</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats?.totalPoints || 0}
              </div>
              <div className="text-sm text-gray-600">Баллов набрано</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Доступные курсы</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {courses?.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-lg"
            >
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {course.name}
              </h3>
              <p className="text-gray-600">{course.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                {course.totalTopics || 0} тем • {course.totalTasks || 0} заданий
              </div>
            </Link>
          ))}
          {(!courses || courses.length === 0) && (
            <p className="text-gray-600">Курсы пока не добавлены</p>
          )}
        </div>
      </div>
    </div>
  );
}
