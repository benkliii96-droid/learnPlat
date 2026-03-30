import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../services/api';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  newPassword: z.string().min(6, 'Новый пароль должен быть не менее 6 символов'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await usersApi.getStats();
      return response.data;
    },
    enabled: !!user,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordForm) => {
      const response = await usersApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      setMessage('Пароль успешно изменён');
      reset();
    },
    onError: () => {
      setMessage('Ошибка при смене пароля');
    },
  });

  const onSubmit = (data: PasswordForm) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Профиль</h1>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Информация о пользователе</h2>
        <div className="space-y-3">
          <div>
            <span className="text-gray-600">Имя:</span>{' '}
            <span className="font-medium">{user?.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>{' '}
            <span className="font-medium">{user?.email}</span>
          </div>
          <div>
            <span className="text-gray-600">Роль:</span>{' '}
            <span className="font-medium">{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</span>
          </div>
        </div>
      </div>

      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Статистика</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 text-center rounded-lg bg-blue-50">
            <div className="text-3xl font-bold text-blue-600">
              {stats?.completedTopics || 0}
            </div>
            <div className="text-sm text-gray-600">Тем пройдено</div>
          </div>
          <div className="p-4 text-center rounded-lg bg-green-50">
            <div className="text-3xl font-bold text-green-600">
              {stats?.completedTasks || 0}
            </div>
            <div className="text-sm text-gray-600">Заданий выполнено</div>
          </div>
          <div className="p-4 text-center rounded-lg bg-purple-50">
            <div className="text-3xl font-bold text-purple-600">
              {stats?.totalPoints || 0}
            </div>
            <div className="text-sm text-gray-600">Баллов</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Смена пароля</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('успешно') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Текущий пароль
            </label>
            <input
              {...register('currentPassword')}
              type="password"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Новый пароль
            </label>
            <input
              {...register('newPassword')}
              type="password"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Подтверждение пароля
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {changePasswordMutation.isPending ? 'Сохранение...' : 'Изменить пароль'}
          </button>
        </form>
      </div>
    </div>
  );
}
