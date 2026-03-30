import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursesApi, topicsApi, submissionsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await coursesApi.getById(courseId!);
      return response.data;
    },
  });

  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics', courseId],
    queryFn: async () => {
      const response = await topicsApi.getByCourse(courseId!);
      return response.data;
    },
  });

  // Проверяем выполненные задания для каждой темы
  useEffect(() => {
    const checkCompletedTopics = async () => {
      if (!user || !topics) return;
      
      const completed = new Set<string>();
      
      for (const topic of topics) {
        if (!topic.tasks || topic.tasks.length === 0) {
          // Если у темы нет заданий, считаем её пройденной
          completed.add(topic.id);
          continue;
        }
        
        // Проверяем, выполнены ли все обязательные задания
        const requiredTasks = topic.tasks.filter(t => t.isRequired);
        let allRequiredCompleted = true;
        
        for (const task of requiredTasks) {
          try {
            const response = await submissionsApi.isTaskCompleted(task.id);
            if (!response.data.completed) {
              allRequiredCompleted = false;
              break;
            }
          } catch {
            allRequiredCompleted = false;
            break;
          }
        }
        
        if (allRequiredCompleted && requiredTasks.length > 0) {
          completed.add(topic.id);
        } else if (requiredTasks.length === 0) {
          completed.add(topic.id);
        }
      }
      
      setCompletedTopics(completed);
    };
    
    checkCompletedTopics();
  }, [user, topics]);

  if (courseLoading || topicsLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <Link to="/courses" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Назад к курсам
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{course?.name}</h1>
        <p className="text-gray-600 mt-2">{course?.description}</p>
      </div>

      <div className="space-y-4">
        {topics?.map((topic, index) => (
          <div
            key={topic.id}
            className={`bg-white rounded-lg shadow p-6 ${
              completedTopics.has(topic.id) ? 'border-l-4 border-green-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-500 mr-4">
                  {index + 1}.
                </span>
                <Link
                  to={`/topics/${topic.id}`}
                  className="text-xl font-bold text-gray-900 hover:text-blue-600"
                >
                  {topic.name}
                </Link>
                {completedTopics.has(topic.id) && (
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    ✓ Пройдено
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {topic.tasks?.length || 0} заданий
              </div>
            </div>
            <Link
              to={`/topics/${topic.id}`}
              className="mt-2 ml-12 text-blue-600 hover:text-blue-700 inline-block"
            >
              Перейти к теме →
            </Link>
          </div>
        ))}
        {(!topics || topics.length === 0) && (
          <p className="text-gray-600 text-center py-8">Темы пока не добавлены</p>
        )}
      </div>
    </div>
  );
}
