import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../services/api';

export default function Courses() {
  const { data: courses, isLoading } = useQuery({
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

  if (isLoading) {
    return <div className="py-8 text-center">Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Курсы</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-lg"
          >
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              {course.name}
            </h2>
            <p className="mb-4 text-gray-600">{course.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="px-2 py-1 text-blue-800 bg-blue-100 rounded">
                {course.totalTopics || 0} тем
              </span>
              <span className="px-2 py-1 ml-2 text-green-800 bg-green-100 rounded">
                {course.totalTasks || 0} заданий
              </span>
            </div>
          </Link>
        ))}
      </div>
      {(!courses || courses.length === 0) && (
        <p className="py-8 text-center text-gray-600">Курсы пока не добавлены</p>
      )}
    </div>
  );
}
