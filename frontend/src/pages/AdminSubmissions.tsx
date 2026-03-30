import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { submissionsApi } from '../services/api';

export default function AdminSubmissions() {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['all-submissions'],
    queryFn: async () => {
      const response = await submissionsApi.getPending();
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Проверка заданий</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Задание
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Тип
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
                  <div className="font-medium text-gray-900">
                    {submission.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {submission.user?.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{submission.task?.name}</div>
                  <div className="text-sm text-gray-500">
                    {submission.task?.topic?.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      submission.task?.type === 'auto'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {submission.task?.type === 'auto' ? 'Авто' : 'Ручная'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(submission.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/submissions/${submission.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Проверить
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!submissions || submissions.length === 0) && (
          <p className="text-center py-8 text-gray-600">
            Нет заданий на проверку
          </p>
        )}
      </div>
    </div>
  );
}
