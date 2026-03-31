import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursesApi, topicsApi, submissionsApi, progressApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [topicProgress, setTopicProgress] = useState<Record<string, { completed: number; total: number }>>({});

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
      if (!topics) return;
      
      const completed = new Set<string>();
      const progress: Record<string, { completed: number; total: number }> = {};
      
      for (const topic of topics) {
        progress[topic.id] = { completed: 0, total: 0 };
        
        if (!topic.tasks || topic.tasks.length === 0) {
          completed.add(topic.id);
          progress[topic.id] = { completed: 0, total: 0 };
          continue;
        }
        
        // Проверяем все задания (не только обязательные) для прогресса
        const requiredTasks = topic.tasks.filter(t => t.isRequired);
        let allRequiredCompleted = true;
        let completedCount = 0;
        
        for (const task of topic.tasks) {
          progress[topic.id].total++;
          try {
            const response = await submissionsApi.isTaskCompleted(task.id);
            if (response.data.completed) {
              completedCount++;
            } else if (task.isRequired) {
              allRequiredCompleted = false;
            }
          } catch {
            if (task.isRequired) {
              allRequiredCompleted = false;
            }
          }
        }
        
        progress[topic.id].completed = completedCount;
        
        if (allRequiredCompleted && requiredTasks.length > 0) {
          completed.add(topic.id);
        } else if (requiredTasks.length === 0) {
          completed.add(topic.id);
        }
      }
      
      setCompletedTopics(completed);
      setTopicProgress(progress);
    };
    
    checkCompletedTopics();
  }, [user, topics]);

  // Обновляем прогресс тем на сервере
  useEffect(() => {
    const updateProgress = async () => {
      if (!user || !courseId || !topics) return;
      try {
        await progressApi.updateTopicsProgress(courseId);
      } catch (e) {
        // Игнорируем ошибки
      }
    };
    updateProgress();
  }, [user, courseId, topics, completedTopics]);

  // Проверяем, можно ли перейти к теме (все предыдущие должны быть пройдены)
  const canAccessTopic = (topicIndex: number): boolean => {
    if (!user) return topicIndex === 0; // Неавторизованный может только первую
    
    // Все предыдущие темы должны быть пройдены
    for (let i = 0; i < topicIndex; i++) {
      if (topics && !completedTopics.has(topics[i].id)) {
        return false;
      }
    }
    return true;
  };

  if (courseLoading || topicsLoading) {
    return <div className="py-8 text-center">Загрузка...</div>;
  }

  const completedCount = completedTopics.size;
  const totalTopicsCount = topics?.length || 0;

  return (
    <div>
      <div className="mb-8">
        <Link to="/courses" className="inline-block mb-4 text-blue-600 hover:text-blue-700">
          ← Назад к курсам
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{course?.name}</h1>
        <p className="mt-2 text-gray-600">{course?.description}</p>
        {totalTopicsCount > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            Всего тем: {totalTopicsCount} • Пройдено: {completedCount}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {topics?.map((topic, index) => {
          const isAccessible = canAccessTopic(index);
          const isCompleted = completedTopics.has(topic.id);
          const progress = topicProgress[topic.id] || { completed: 0, total: 0 };
          
          return (
            <div
              key={topic.id}
              className={`bg-white rounded-lg shadow p-6 ${
                isCompleted ? 'border-l-4 border-green-500' : ''
              } ${!isAccessible ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-4 text-lg font-medium text-gray-500">
                    {index + 1}.
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {topic.name}
                  </span>
                  {isCompleted && (
                    <span className="px-2 py-1 ml-2 text-sm text-green-800 bg-green-100 rounded">
                      ✓ Пройдено
                    </span>
                  )}
                  {!isAccessible && (
                    <span className="px-2 py-1 ml-2 text-sm text-yellow-800 bg-yellow-100 rounded">
                      🔒 Закрыто
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {progress.completed}/{progress.total} заданий
                </div>
              </div>
              
              {progress.total > 0 && (
                <div className="mt-2 ml-12">
                  <div className="w-48 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-600 rounded-full" 
                      style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {isAccessible ? (
                <Link
                  to={`/topics/${topic.id}`}
                  className="inline-block mt-2 ml-12 text-blue-600 hover:text-blue-700"
                >
                  Перейти к теме →
                </Link>
              ) : (
                <p className="mt-2 ml-12 text-sm text-gray-500">
                  Выполните обязательные задания в предыдущих темах для разблокировки
                </p>
              )}
            </div>
          );
        })}
        {(!topics || topics.length === 0) && (
          <p className="py-8 text-center text-gray-600">Темы пока не добавлены</p>
        )}
      </div>
    </div>
  );
}
