import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { submissionsApi } from '../services/api';

export default function MySubmissions() {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: async () => {
      const response = await submissionsApi.getMy();
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Мои решения</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Задание
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Баллы
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions?.map((submission) => (
              <tr key={submission.id}>
                <td className="px-6 py-4">
                  <Link
                    to={`/tasks/${submission.taskId}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {submission.task?.name || 'Задание'}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {submission.task?.topic?.name}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      submission.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : submission.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {submission.status === 'approved'
                      ? 'Принято'
                      : submission.status === 'rejected'
                      ? 'Отклонено'
                      : 'На проверке'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900">
                  {submission.points} / {submission.task?.maxPoints}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(submission.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/tasks/${submission.taskId}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Подробнее
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!submissions || submissions.length === 0) && (
          <p className="text-center py-8 text-gray-600">
            Вы пока не отправляли решения
          </p>
        )}
      </div>
    </div>
  );
}
