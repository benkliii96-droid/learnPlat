import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    return <div className="text-center py-8">Загрузка...</div>;
  }

  const lastSubmission = mySubmissions?.[0];

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/topics/${task?.topicId}`}
          className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
        >
          ← Назад к теме
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{task?.name}</h1>
        <div className="flex items-center space-x-4 mt-2">
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
            {task?.type === 'auto' ? 'Автоматическая проверка' : 'Ручная проверка'}
          </span>
          <span className="text-gray-600">{task?.maxPoints} баллов</span>
          {isCompleted && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
              ✓ Выполнено
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Описание</h2>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: task?.description || '' }}
          />
          
          {task?.criteria && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Критерии оценки:</h3>
              <p className="text-gray-700">{task.criteria}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {task?.type === 'auto' ? 'Решение' : 'Отправка решения'}
          </h2>
          
          {task?.type === 'auto' ? (
            <form onSubmit={handleSubmit}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-900 text-gray-100"
                placeholder="// Введите ваш код здесь..."
              />
              <button
                type="submit"
                disabled={isRunning || submitMutation.isPending}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitMutation.isPending ? 'Отправка...' : 'Отправить на проверку'}
              </button>
            </form>
          )}

          {testResults && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Результаты тестов:</h3>
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
                      <p className="text-red-600 text-sm mt-1">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
              {testResults.passed && (
                <div className="mt-4 p-4 bg-green-100 rounded-lg text-green-800 font-bold text-center">
                  Все тесты пройдены! +{task?.maxPoints} баллов
                </div>
              )}
            </div>
          )}

          {lastSubmission && task?.type === 'manual' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Последняя отправка:</h3>
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
                <p className="text-gray-600 mt-2">
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
