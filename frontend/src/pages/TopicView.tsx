import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { topicsApi, tasksApi, submissionsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TopicView() {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'material' | 'tasks'>('material');

  const { data: topic, isLoading: topicLoading } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      const response = await topicsApi.getById(topicId!);
      return response.data;
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks', topicId],
    queryFn: async () => {
      const response = await tasksApi.getByTopic(topicId!);
      return response.data;
    },
  });

  const { data: completedTasks } = useQuery({
    queryKey: ['completed-tasks', topicId],
    queryFn: async () => {
      if (!user) return {};
      const results: Record<string, boolean> = {};
      if (tasks) {
        for (const task of tasks) {
          try {
            const response = await submissionsApi.isTaskCompleted(task.id);
            results[task.id] = response.data.completed;
          } catch {
            results[task.id] = false;
          }
        }
      }
      return results;
    },
    enabled: !!user && !!tasks && tasks.length > 0,
  });

  if (topicLoading) {
    return <div className="py-8 text-center">Загрузка...</div>;
  }

  const requiredTasks = tasks?.filter(t => t.isRequired) || [];
  const allRequiredCompleted = requiredTasks.every(t => completedTasks?.[t.id]);

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/courses/${topic?.courseId}`}
          className="inline-block mb-4 text-blue-600 hover:text-blue-700"
        >
          ← Назад к курсу
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{topic?.name}</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('material')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'material'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Материал
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'tasks'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Задания ({tasks?.length || 0})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'material' && (
            <div className="prose max-w-none">
              <MarkdownRenderer content={topic?.content || ''} />
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {tasks?.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 ${
                    completedTasks?.[task.id]
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        to={`/tasks/${task.id}`}
                        className="text-lg font-bold text-gray-900 hover:text-blue-600"
                      >
                        {task.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-600">
                        {task.type === 'auto' ? 'Автоматическая проверка' : 'Ручная проверка'}
                        {task.isRequired && ' • Обязательное'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {completedTasks?.[task.id] && (
                        <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded">
                          ✓ Выполнено
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {task.maxPoints} баллов
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/tasks/${task.id}`}
                    className="inline-block mt-2 text-blue-600 hover:text-blue-700"
                  >
                    {completedTasks?.[task.id] ? 'Просмотреть' : 'Выполнить'} →
                  </Link>
                </div>
              ))}
              {(!tasks || tasks.length === 0) && (
                <p className="py-8 text-center text-gray-600">
                  Задания пока не добавлены
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {user && activeTab === 'material' && allRequiredCompleted && (
        <div className="p-4 mt-6 border border-green-200 rounded-lg bg-green-50">
          <p className="text-green-800">
            ✓ Все обязательные задания выполнены! Вы можете переходить к следующей теме.
          </p>
        </div>
      )}
    </div>
  );
}
