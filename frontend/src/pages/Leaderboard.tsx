import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface LeaderboardUser {
  id: string;
  name: string;
  totalPoints: number;
  completedTasks: number;
  completedTopics: number;
}

export default function Leaderboard() {
  const { user } = useAuth();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const response = await usersApi.getLeaderboard();
      return response.data as LeaderboardUser[];
    },
  });

  const currentUserRank = leaderboard?.findIndex(u => u.id === user?.id) ?? -1;

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← На главную
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Таблица лидеров</h1>
        <p className="text-gray-600 mt-2">Рейтинг пользователей по баллам</p>
      </div>

      {currentUserRank >= 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            Ваше место в рейтинге: <strong>#{currentUserRank + 1}</strong> 
            {' '}({user?.name} - {leaderboard?.[currentUserRank].totalPoints} баллов)
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Место
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Баллы
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Заданий
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Тем
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard?.map((userItem, index) => (
              <tr 
                key={userItem.id} 
                className={userItem.id === user?.id ? 'bg-blue-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-lg font-bold ${
                    index === 0 ? 'text-yellow-500' : 
                    index === 1 ? 'text-gray-400' : 
                    index === 2 ? 'text-amber-600' : 
                    'text-gray-600'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {userItem.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {userItem.name}
                        {userItem.id === user?.id && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Вы</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-bold text-purple-600">
                    {userItem.totalPoints}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {userItem.completedTasks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {userItem.completedTopics}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!leaderboard || leaderboard.length === 0) && (
          <p className="text-center py-8 text-gray-600">
            Пока нет данных для рейтинга
          </p>
        )}
      </div>
    </div>
  );
}
