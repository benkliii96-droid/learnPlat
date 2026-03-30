import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsApi } from '../services/api';

export default function AdminSubmissionReview() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [points, setPoints] = useState(10);
  const [comment, setComment] = useState('');

  const { data: submission, isLoading } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      const response = await submissionsApi.getById(submissionId!);
      return response.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (data: { points: number; comment: string }) => {
      const response = await submissionsApi.approve(submissionId!, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] });
      navigate('/admin/submissions');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (comment: string) => {
      const response = await submissionsApi.reject(submissionId!, { comment });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] });
      navigate('/admin/submissions');
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  const testResults = submission?.testResults ? JSON.parse(submission.testResults) : null;

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/submissions"
          className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
        >
          ← Назад к списку
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Проверка решения
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Информация о решении</h2>
          
          <div className="space-y-3 mb-6">
            <div>
              <span className="text-gray-600">Пользователь:</span>{' '}
              <span className="font-medium">{submission?.user?.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>{' '}
              <span className="font-medium">{submission?.user?.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Задание:</span>{' '}
              <span className="font-medium">{submission?.task?.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Тип проверки:</span>{' '}
              <span className="font-medium">
                {submission?.task?.type === 'auto' ? 'Автоматическая' : 'Ручная'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Максимальный балл:</span>{' '}
              <span className="font-medium">{submission?.task?.maxPoints}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-gray-900 mb-2">Решение:</h3>
            {submission?.code ? (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {submission.code}
              </pre>
            ) : (
              <p className="text-gray-600">{submission?.solutionText}</p>
            )}
          </div>

          {testResults && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold text-gray-900 mb-2">Результаты тестов:</h3>
              <div className="space-y-2">
                {testResults.map((result: any, index: number) => (
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
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Оценка</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Баллы (из {submission?.task?.maxPoints})
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                max={submission?.task?.maxPoints}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Комментарий к решению..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => approveMutation.mutate({ points, comment })}
                disabled={approveMutation.isPending}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {approveMutation.isPending ? 'Сохранение...' : 'Принять'}
              </button>
              <button
                onClick={() => rejectMutation.mutate(comment)}
                disabled={rejectMutation.isPending}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Сохранение...' : 'Отклонить'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
