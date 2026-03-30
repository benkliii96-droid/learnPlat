import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MarkdownRenderer from '../components/MarkdownRenderer';
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
  const [showPreview, setShowPreview] = useState(false);

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
    watch,
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
    return <div className="py-8 text-center">Загрузка...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        {isNew ? 'Создание темы' : 'Редактирование темы'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Курс</label>
          <select
            {...register('courseId')}
            defaultValue={topic?.courseId}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
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
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Содержание (Markdown)</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`px-3 py-1 text-sm rounded ${
                  !showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Редактор
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`px-3 py-1 text-sm rounded ${
                  showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Предпросмотр
              </button>
            </div>
          </div>
          
          {showPreview ? (
            <div className="mt-1 p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[250px]">
              <div className="prose max-w-none">
                <MarkdownRenderer content={watch('content') || topic?.content || ''} />
              </div>
            </div>
          ) : (
            <textarea
              {...register('content')}
              defaultValue={topic?.content}
              rows={10}
              className="block w-full px-3 py-2 mt-1 font-mono text-sm border border-gray-300 rounded-lg"
              placeholder="Введите учебный материал в формате Markdown..."
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Порядок</label>
          <input
            {...register('order')}
            type="number"
            defaultValue={topic?.order || 0}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <input
            {...register('isPublished')}
            type="checkbox"
            defaultChecked={topic?.isPublished ?? true}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Опубликовано</label>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Удалить
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
