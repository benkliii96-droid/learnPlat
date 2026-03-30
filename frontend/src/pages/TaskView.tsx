import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { tasksApi, submissionsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TaskView() {
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [code, setCode] = useState('');
  const [solutionText, setSolutionText] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await tasksApi.getById(taskId!);
      return response.data;
    },
  });

  const { data: mySubmissions } = useQuery({
    queryKey: ['my-submissions', taskId],
    queryFn: async () => {
      const response = await submissionsApi.getMyByTask(taskId!);
      return response.data;
    },
    enabled: !!user,
  });

  const { data: isCompleted } = useQuery({
    queryKey: ['task-completed', taskId],
    queryFn: async () => {
      const response = await submissionsApi.isTaskCompleted(taskId!);
      return response.data.completed;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (task?.starterCode) {
      setCode(task.starterCode);
    }
  }, [task]);

  const submitMutation = useMutation({
    mutationFn: async (data: { code?: string; solutionText?: string }) => {
      const response = await submissionsApi.create({
        taskId: taskId!,
        ...data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-submissions', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-completed', taskId] });
    },
  });

  const runTestMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const response = await submissionsApi.runTest(submissionId);
      return response.data;
    },
    onSuccess: (data) => {
      setTestResults(data);
      queryClient.invalidateQueries({ queryKey: ['task-completed', taskId] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task?.type === 'auto') {
      // Сначала создаём submission, потом запускаем тест
      const submission = await submitMutation.mutateAsync({ code });
      setIsRunning(true);
      try {
        await runTestMutation.mutateAsync(submission.id);
      } finally {
        setIsRunning(false);
      }
    } else {
      await submitMutation.mutateAsync({ solutionText });
      setSolutionText('');
    }
  };

  if (taskLoading) {
    return <div className="py-8 text-center">Загрузка...</div>;
  }

  const lastSubmission = mySubmissions?.[0];

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/topics/${task?.topicId}`}
          className="inline-block mb-4 text-blue-600 hover:text-blue-700"
        >
          ← Назад к теме
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{task?.name}</h1>
        <div className="flex items-center mt-2 space-x-4">
          <span className="px-3 py-1 text-gray-800 bg-gray-100 rounded">
            {task?.type === 'auto' ? 'Автоматическая проверка' : 'Ручная проверка'}
          </span>
          <span className="text-gray-600">{task?.maxPoints} баллов</span>
          {isCompleted && (
            <span className="px-3 py-1 text-green-800 bg-green-100 rounded">
              ✓ Выполнено
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Описание</h2>
          <div className="prose text-gray-700 max-w-none">
            <ReactMarkdown>{task?.description || ''}</ReactMarkdown>
          </div>
          
          {task?.criteria && (
            <div className="mt-6">
              <h3 className="mb-2 font-bold text-gray-900">Критерии оценки:</h3>
              <p className="text-gray-700">{task.criteria}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            {task?.type === 'auto' ? 'Решение' : 'Отправка решения'}
          </h2>
          
          {task?.type === 'auto' ? (
            <form onSubmit={handleSubmit}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-4 font-mono text-sm text-gray-100 bg-gray-900 border border-gray-300 rounded-lg"
                placeholder="// Введите ваш код здесь..."
              />
              <button
                type="submit"
                disabled={isRunning || submitMutation.isPending}
                className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunning ? 'Запуск тестов...' : 'Отправить и запустить тесты'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg"
                placeholder="Введите текст решения или описание"
              />
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitMutation.isPending ? 'Отправка...' : 'Отправить на проверку'}
              </button>
            </form>
          )}

          {testResults && (
            <div className="mt-6">
              <h3 className="mb-2 font-bold text-gray-900">Результаты тестов:</h3>
              <div className="space-y-2">
                {testResults.results?.map((result: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded ${
                      result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                        {result.passed ? '✓' : '✗'}
                      </span>
                      <span className="ml-2 font-medium">{result.name}</span>
                    </div>
                    {result.error && (
                      <p className="mt-1 text-sm text-red-600">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
              {testResults.passed && (
                <div className="p-4 mt-4 font-bold text-center text-green-800 bg-green-100 rounded-lg">
                  Все тесты пройдены! +{task?.maxPoints} баллов
                </div>
              )}
            </div>
          )}

          {lastSubmission && task?.type === 'manual' && (
            <div className="p-4 mt-6 rounded-lg bg-gray-50">
              <h3 className="mb-2 font-bold text-gray-900">Последняя отправка:</h3>
              <p className="text-gray-600">
                Статус:{' '}
                <span
                  className={`font-medium ${
                    lastSubmission.status === 'approved'
                      ? 'text-green-600'
                      : lastSubmission.status === 'rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {lastSubmission.status === 'approved'
                    ? 'Принято'
                    : lastSubmission.status === 'rejected'
                    ? 'Отклонено'
                    : 'На проверке'}
                </span>
              </p>
              {lastSubmission.points > 0 && (
                <p className="text-gray-600">Баллы: {lastSubmission.points}</p>
              )}
              {lastSubmission.adminComment && (
                <p className="mt-2 text-gray-600">
                  Комментарий: {lastSubmission.adminComment}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
