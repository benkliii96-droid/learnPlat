import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../services/api';

export default function Courses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await coursesApi.getAll();
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Курсы</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {course.name}
            </h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {course.totalTopics || 0} тем
              </span>
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded">
                {course.totalTasks || 0} заданий
              </span>
            </div>
          </Link>
        ))}
      </div>
      {(!courses || courses.length === 0) && (
        <p className="text-gray-600 text-center py-8">Курсы пока не добавлены</p>
      )}
    </div>
  );
}
