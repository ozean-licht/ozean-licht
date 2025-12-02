# Code Examples for Project Management MVP

> Production-ready code patterns for implementing the PM system.

**Generated:** 2025-12-02

---

## 1. Task Form Modal with react-hook-form + Zod

```tsx
// components/projects/TaskFormModal.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

// Zod schema - shared with API for consistency
const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(5000).optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done', 'blocked']),
  priority: z.enum(['low', 'medium', 'high', 'urgent', 'critical']),
  taskType: z.enum(['task', 'bug', 'feature', 'improvement', 'documentation', 'research']),
  projectId: z.string().uuid().optional().nullable(),
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  estimatedHours: z.coerce.number().min(0).max(1000).optional().nullable(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskFormData & { id: string };
  projectId?: string;
  onSuccess?: () => void;
}

export function TaskFormModal({
  open,
  onOpenChange,
  task,
  projectId,
  onSuccess,
}: TaskFormModalProps) {
  const isEditing = !!task?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task ?? {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      taskType: 'task',
      projectId: projectId || null,
      assigneeId: null,
      dueDate: null,
      estimatedHours: null,
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const url = isEditing ? `/api/tasks/${task.id}` : '/api/tasks';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save task');
      }

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save task:', error);
      // TODO: Show toast notification
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-16 border-primary/30 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {isEditing ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#C4C8D4]">Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="What needs to be done?"
              className="bg-[#00111A] border-primary/20 text-white"
            />
            {errors.title && (
              <p className="text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#C4C8D4]">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Add details..."
              rows={3}
              className="bg-[#00111A] border-primary/20 text-white resize-none"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#C4C8D4]">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as TaskFormData['status'])}
              >
                <SelectTrigger className="bg-[#00111A] border-primary/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#C4C8D4]">Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value as TaskFormData['priority'])}
              >
                <SelectTrigger className="bg-[#00111A] border-primary/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Task Type */}
          <div className="space-y-2">
            <Label className="text-[#C4C8D4]">Type</Label>
            <Select
              value={watch('taskType')}
              onValueChange={(value) => setValue('taskType', value as TaskFormData['taskType'])}
            >
              <SelectTrigger className="bg-[#00111A] border-primary/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/20">
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="improvement">Improvement</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estimated Hours */}
          <div className="space-y-2">
            <Label htmlFor="estimatedHours" className="text-[#C4C8D4]">
              Estimated Hours
            </Label>
            <Input
              id="estimatedHours"
              type="number"
              step="0.5"
              min="0"
              {...register('estimatedHours')}
              placeholder="e.g., 2.5"
              className="bg-[#00111A] border-primary/20 text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-primary/30 text-[#C4C8D4]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 2. Sortable Kanban Board with @dnd-kit

```tsx
// components/projects/KanbanBoard.tsx
'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { SortableTaskCard, TaskCard } from './SortableTaskCard';
import type { DBTask } from '@/lib/db/tasks';

interface KanbanBoardProps {
  initialTasks: DBTask[];
  onTaskUpdate: (taskId: string, updates: Partial<DBTask>) => Promise<void>;
  onTaskClick: (taskId: string) => void;
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
] as const;

type ColumnId = typeof COLUMNS[number]['id'];

export function KanbanBoard({ initialTasks, onTaskUpdate, onTaskClick }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<DBTask[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Group tasks by status
  const tasksByColumn = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks
      .filter((t) => t.status === col.id)
      .sort((a, b) => a.task_order - b.task_order);
    return acc;
  }, {} as Record<ColumnId, DBTask[]>);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumn = (taskId: string): ColumnId | null => {
    for (const [columnId, columnTasks] of Object.entries(tasksByColumn)) {
      if (columnTasks.some((t) => t.id === taskId)) {
        return columnId as ColumnId;
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumn = findColumn(active.id as string);
    const overColumn = over.id in tasksByColumn
      ? (over.id as ColumnId)
      : findColumn(over.id as string);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    // Move task to new column
    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id
          ? { ...task, status: overColumn }
          : task
      )
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const newColumn = over.id in tasksByColumn
      ? (over.id as ColumnId)
      : findColumn(over.id as string);

    if (!newColumn) return;

    // Calculate new order
    const columnTasks = tasksByColumn[newColumn].filter((t) => t.id !== active.id);
    const overIndex = columnTasks.findIndex((t) => t.id === over.id);
    const newOrder = overIndex === -1 ? columnTasks.length : overIndex;

    // Persist to API
    try {
      await onTaskUpdate(active.id as string, {
        status: newColumn,
        task_order: newOrder,
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert on error
      setTasks(initialTasks);
    }
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            taskCount={tasksByColumn[column.id].length}
          >
            <SortableContext
              items={tasksByColumn[column.id].map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasksByColumn[column.id].map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task.id)}
                />
              ))}
            </SortableContext>
          </KanbanColumn>
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
```

---

## 3. Sortable Task Card

```tsx
// components/projects/SortableTaskCard.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GripVertical, Bug, Star, Wrench, FileText, Search, CheckSquare } from 'lucide-react';
import type { DBTask } from '@/lib/db/tasks';

const PRIORITY_COLORS = {
  low: 'border-gray-500/30 bg-gray-500/10 text-gray-400',
  medium: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  high: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  urgent: 'border-red-500/30 bg-red-500/10 text-red-400',
  critical: 'border-red-500/30 bg-red-500/10 text-red-400',
};

const TASK_TYPE_ICONS = {
  task: CheckSquare,
  bug: Bug,
  feature: Star,
  improvement: Wrench,
  documentation: FileText,
  research: Search,
};

interface SortableTaskCardProps {
  task: DBTask;
  onClick?: () => void;
}

export function SortableTaskCard({ task, onClick }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCard
        task={task}
        isDragging={isDragging}
        dragHandleProps={listeners}
        onClick={onClick}
      />
    </div>
  );
}

interface TaskCardProps {
  task: DBTask;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
  onClick?: () => void;
}

export function TaskCard({ task, isDragging, dragHandleProps, onClick }: TaskCardProps) {
  const TypeIcon = TASK_TYPE_ICONS[task.task_type as keyof typeof TASK_TYPE_ICONS] || CheckSquare;

  return (
    <Card
      className={`group cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'opacity-50 shadow-lg shadow-primary/20 rotate-2'
          : 'hover:border-primary/40 hover:shadow-md hover:shadow-primary/10'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Drag handle + Priority */}
        <div className="flex items-center justify-between mb-2">
          <button
            className="p-1 -ml-1 text-[#C4C8D4] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            {...dragHandleProps}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <Badge variant="outline" className={PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}>
            {task.priority}
          </Badge>
        </div>

        {/* Title */}
        <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
          {task.name}
        </h4>

        {/* Project */}
        {task.project_title && (
          <p className="text-xs text-[#C4C8D4] mb-3 truncate">
            {task.project_title}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-primary/10">
          <div className="flex items-center gap-2 text-xs text-[#C4C8D4]">
            <TypeIcon className="w-3.5 h-3.5" />
            <span className="capitalize">{task.task_type || 'task'}</span>
          </div>

          {task.assignee_ids?.[0] && (
            <Avatar className="w-6 h-6 border border-primary/20">
              <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                {task.created_by_name?.slice(0, 2).toUpperCase() || '??'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 4. Kanban Column

```tsx
// components/projects/KanbanColumn.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';

const COLUMN_COLORS: Record<string, string> = {
  backlog: 'border-gray-500/30',
  todo: 'border-blue-500/30',
  in_progress: 'border-yellow-500/30',
  review: 'border-purple-500/30',
  done: 'border-green-500/30',
  blocked: 'border-red-500/30',
};

interface KanbanColumnProps {
  id: string;
  title: string;
  taskCount: number;
  children: React.ReactNode;
}

export function KanbanColumn({ id, title, taskCount, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-shrink-0 w-72 flex flex-col">
      {/* Header */}
      <div className={`glass-card rounded-t-xl p-4 border-b-2 ${COLUMN_COLORS[id] || COLUMN_COLORS.backlog}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">{title}</h3>
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            {taskCount}
          </Badge>
        </div>
      </div>

      {/* Cards container */}
      <div
        ref={setNodeRef}
        className={`glass-card rounded-b-xl p-3 flex-1 space-y-3 min-h-[400px] max-h-[calc(100vh-280px)] overflow-y-auto transition-colors ${
          isOver ? 'bg-primary/5 border-primary/40' : ''
        }`}
      >
        {children}

        {taskCount === 0 && (
          <div className="flex items-center justify-center h-24 text-[#C4C8D4] text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 5. Assignee Picker Component

```tsx
// components/projects/AssigneePicker.tsx
'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface AssigneePickerProps {
  value?: string | null;
  onChange: (userId: string | null) => void;
  placeholder?: string;
}

export function AssigneePicker({ value, onChange, placeholder = 'Select assignee...' }: AssigneePickerProps) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/admin-users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const selectedUser = users.find((u) => u.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-[#00111A] border-primary/20 text-white hover:bg-primary/10"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{selectedUser.name}</span>
            </div>
          ) : (
            <span className="text-[#C4C8D4]">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-card border-primary/20">
        <Command>
          <CommandInput placeholder="Search users..." className="bg-transparent border-primary/20" />
          <CommandList>
            <CommandEmpty>
              {loading ? 'Loading...' : 'No users found.'}
            </CommandEmpty>
            <CommandGroup>
              {/* Unassigned option */}
              <CommandItem
                value="unassigned"
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="text-[#C4C8D4]"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Unassigned</span>
                {!value && <Check className="ml-auto h-4 w-4 text-primary" />}
              </CommandItem>

              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => {
                    onChange(user.id);
                    setOpen(false);
                  }}
                >
                  <Avatar className="mr-2 w-5 h-5">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-white">{user.name}</span>
                    <span className="text-xs text-[#C4C8D4]">{user.email}</span>
                  </div>
                  {value === user.id && <Check className="ml-auto h-4 w-4 text-primary" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

---

## 6. API Route: Task Reorder

```tsx
// app/api/tasks/reorder/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { z } from 'zod';
import { transaction } from '@/lib/db';

const reorderSchema = z.object({
  taskId: z.string().uuid(),
  newStatus: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done', 'blocked']),
  newOrder: z.number().int().min(0),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, newStatus, newOrder } = reorderSchema.parse(body);

    await transaction(async (client) => {
      // Get current task
      const { rows: [task] } = await client.query(
        'SELECT id, status, task_order, project_id FROM tasks WHERE id = $1',
        [taskId]
      );

      if (!task) {
        throw new Error('Task not found');
      }

      const oldStatus = task.status;
      const oldOrder = task.task_order;

      // If status changed, update order in both columns
      if (oldStatus !== newStatus) {
        // Decrease order of tasks after old position
        await client.query(
          `UPDATE tasks
           SET task_order = task_order - 1
           WHERE status = $1 AND task_order > $2`,
          [oldStatus, oldOrder]
        );

        // Increase order of tasks at and after new position
        await client.query(
          `UPDATE tasks
           SET task_order = task_order + 1
           WHERE status = $1 AND task_order >= $2`,
          [newStatus, newOrder]
        );
      } else {
        // Same column reorder
        if (newOrder < oldOrder) {
          await client.query(
            `UPDATE tasks
             SET task_order = task_order + 1
             WHERE status = $1 AND task_order >= $2 AND task_order < $3`,
            [newStatus, newOrder, oldOrder]
          );
        } else if (newOrder > oldOrder) {
          await client.query(
            `UPDATE tasks
             SET task_order = task_order - 1
             WHERE status = $1 AND task_order > $2 AND task_order <= $3`,
            [newStatus, oldOrder, newOrder]
          );
        }
      }

      // Update the moved task
      await client.query(
        `UPDATE tasks
         SET status = $1, task_order = $2, updated_at = NOW()
         WHERE id = $3`,
        [newStatus, newOrder, taskId]
      );

      // Recalculate project progress if task has project
      if (task.project_id) {
        await client.query(
          `UPDATE projects SET
            tasks_done = (SELECT COUNT(*) FROM tasks WHERE project_id = $1 AND is_done = true),
            progress_percent = (
              CASE
                WHEN (SELECT COUNT(*) FROM tasks WHERE project_id = $1) = 0 THEN 0
                ELSE (SELECT COUNT(*) FILTER (WHERE is_done = true) * 100.0 / COUNT(*) FROM tasks WHERE project_id = $1)
              END
            )
          WHERE id = $1`,
          [task.project_id]
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder task:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to reorder task' }, { status: 500 });
  }
}
```

---

## Usage Notes

1. **Install dependencies first:**
   ```bash
   pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities react-hook-form @hookform/resolvers zod
   ```

2. **All components follow design system** - See `/design-system.md`

3. **Type safety** - All components are fully typed with TypeScript

4. **Accessibility** - Keyboard navigation supported via @dnd-kit sensors
