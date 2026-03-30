import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicsApi, coursesApi } from '../services/api';

const topicSchema = z.object({
  courseId: z.string().min(1, 'Выберите курс'),
  name: z.string().min(1, 'Название обязательно'),
  content: z.string().optional(),
  order: z.coerce.number().min(0),
  isPublished: z.boolean().optional(),
});

type TopicForm = z.infer<typeof topicSchema>;

export default function AdminTopicEdit() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !topicId;

  const { data: courses } = useQuery({
    queryKey: ['courses-admin'],
    queryFn: async () => {
      const response = await coursesApi.getAllAdmin();
      return response.data;
    },
  });

  const { data: topic, isLoading } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      const response = await topicsApi.getById(topicId!);
      return response.data;
    },
    enabled: !isNew,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TopicForm>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      isPublished: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TopicForm) => {
      const payload = {
        courseId: data.courseId,
        name: data.name,
        content: data.content || '',
        order: data.order,
      };
      const response = await topicsApi.create(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics-admin'] });
      navigate('/admin');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TopicForm) => {
      const payload = {
        courseId: data.courseId,
        name: data.name,
        content: data.content || '',
        order: data.order,
        isPublished: data.isPublished,
      };
      const response = await topicsApi.update(topicId!, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics-admin'] });
      navigate('/admin');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await topicsApi.delete(topicId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics-admin'] });
      navigate('/admin');
    },
  });

  const onSubmit = (data: TopicForm) => {
    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  if (!isNew && isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isNew ? 'Создание темы' : 'Редактирование темы'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Курс</label>
          <select
            {...register('courseId')}
            defaultValue={topic?.courseId}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Выберите курс</option>
            {courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p className="mt-1 text-sm text-red-600">{errors.courseId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Название</label>
          <input
            {...register('name')}
            defaultValue={topic?.name}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Содержание (Markdown)</label>
          <textarea
            {...register('content')}
            defaultValue={topic?.content}
            rows={10}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="Введите учебный материал в формате Markdown..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Порядок</label>
          <input
            {...register('order')}
            type="number"
            defaultValue={topic?.order || 0}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <input
            {...register('isPublished')}
            type="checkbox"
            defaultChecked={topic?.isPublished ?? true}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Опубликовано</label>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isNew ? 'Создать' : 'Сохранить'}
          </button>
          
          {!isNew && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Вы уверены, что хотите удалить тему?')) {
                  deleteMutation.mutate();
                }
              }}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Удалить
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
