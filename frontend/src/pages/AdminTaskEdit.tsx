import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { tasksApi, topicsApi } from '../services/api';

const taskSchema = z.object({
  topicId: z.string().min(1, 'Выберите тему'),
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  type: z.enum(['auto', 'manual']),
  starterCode: z.string().optional(),
  tests: z.string().optional(),
  criteria: z.string().optional(),
  maxPoints: z.coerce.number().min(1),
  isRequired: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

export default function AdminTaskEdit() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !taskId;
  const [showPreview, setShowPreview] = useState(false);

  const { data: topics } = useQuery({
    queryKey: ['topics-admin'],
    queryFn: async () => {
      const response = await topicsApi.getAllAdmin();
      return response.data;
    },
  });

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await tasksApi.getById(taskId!);
      return response.data;
    },
    enabled: !isNew,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: 'manual',
      maxPoints: 10,
      isRequired: false,
      isPublished: true,
    },
  });

  const taskType = watch('type');

  const createMutation = useMutation({
    mutationFn: async (data: TaskForm) => {
      const payload: any = { ...data };
      if (data.type === 'auto' && data.tests) {
        try {
          payload.tests = JSON.parse(data.tests);
        } catch {
          payload.tests = [];
        }
      }
      const response = await tasksApi.create(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-admin'] });
      navigate('/admin');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TaskForm) => {
      const payload: any = { ...data };
      if (data.type === 'auto' && data.tests) {
        try {
          payload.tests = JSON.parse(data.tests);
        } catch {
          payload.tests = [];
        }
      }
      const response = await tasksApi.update(taskId!, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-admin'] });
      navigate('/admin');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await tasksApi.delete(taskId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-admin'] });
      navigate('/admin');
    },
  });

  const onSubmit = (data: TaskForm) => {
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
        {isNew ? 'Создание задания' : 'Редактирование задания'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Тема</label>
          <select
            {...register('topicId')}
            defaultValue={task?.topicId}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
          >
            <option value="">Выберите тему</option>
            {topics?.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.course?.name} - {topic.name}
              </option>
            ))}
          </select>
          {errors.topicId && (
            <p className="mt-1 text-sm text-red-600">{errors.topicId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Название</label>
          <input
            {...register('name')}
            defaultValue={task?.name}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Описание</label>
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
            <div className="mt-1 p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px]">
              <div className="prose max-w-none">
                <MarkdownRenderer content={watch('description') || task?.description || ''} />
              </div>
            </div>
          ) : (
            <textarea
              {...register('description')}
              defaultValue={task?.description}
              rows={4}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Тип проверки</label>
          <select
            {...register('type')}
            defaultValue={task?.type || 'manual'}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
          >
            <option value="manual">Ручная проверка</option>
            <option value="auto">Автоматическая проверка</option>
          </select>
        </div>

        {taskType === 'auto' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Стартовый код</label>
              <textarea
                {...register('starterCode')}
                defaultValue={task?.starterCode}
                rows={6}
                className="block w-full px-3 py-2 mt-1 font-mono text-sm border border-gray-300 rounded-lg"
                placeholder="// Начальный код для задания"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Тесты (JSON)
              </label>
              <textarea
                {...register('tests')}
                defaultValue={task?.tests ? JSON.stringify(task.tests, null, 2) : ''}
                rows={8}
                className="block w-full px-3 py-2 mt-1 font-mono text-sm border border-gray-300 rounded-lg"
                placeholder='[{"name": "Test 1", "testCode": "...", "expected": ...}]'
              />
            </div>
          </>
        )}

        {taskType === 'manual' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Критерии оценки</label>
            <textarea
              {...register('criteria')}
              defaultValue={task?.criteria}
              rows={3}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Максимальный балл</label>
            <input
              {...register('maxPoints')}
              type="number"
              defaultValue={task?.maxPoints || 10}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                {...register('isRequired')}
                type="checkbox"
                defaultChecked={task?.isRequired || false}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Обязательное</label>
            </div>

            <div className="flex items-center">
              <input
                {...register('isPublished')}
                type="checkbox"
                defaultChecked={task?.isPublished ?? true}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Опубликовано</label>
            </div>
          </div>
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
                if (confirm('Вы уверены, что хотите удалить задание?')) {
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
