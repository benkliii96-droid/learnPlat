import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../services/api';

const courseSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  order: z.coerce.number().min(0),
  isPublished: z.boolean().optional(),
});

type CourseForm = z.infer<typeof courseSchema>;

export default function AdminCourseEdit() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !courseId;

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await coursesApi.getById(courseId!);
      return response.data;
    },
    enabled: !isNew,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      isPublished: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CourseForm) => {
      const payload = {
        name: data.name,
        description: data.description || '',
        order: data.order,
      };
      const response = await coursesApi.create(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-admin'] });
      navigate('/admin');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CourseForm) => {
      const payload = {
        name: data.name,
        description: data.description || '',
        order: data.order,
        isPublished: data.isPublished,
      };
      const response = await coursesApi.update(courseId!, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-admin'] });
      navigate('/admin');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await coursesApi.delete(courseId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-admin'] });
      navigate('/admin');
    },
  });

  const onSubmit = (data: CourseForm) => {
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
        {isNew ? 'Создание курса' : 'Редактирование курса'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название</label>
          <input
            {...register('name')}
            defaultValue={course?.name}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Описание</label>
          <textarea
            {...register('description')}
            defaultValue={course?.description}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Порядок</label>
          <input
            {...register('order')}
            type="number"
            defaultValue={course?.order || 0}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <input
            {...register('isPublished')}
            type="checkbox"
            defaultChecked={course?.isPublished ?? true}
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
                if (confirm('Вы уверены, что хотите удалить курс?')) {
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
