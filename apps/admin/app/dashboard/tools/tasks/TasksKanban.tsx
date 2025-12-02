'use client';

/**
 * Tasks Kanban Board - Phase 3 Implementation
 *
 * Kanban-style task management with:
 * - Real API data (replaces mock data)
 * - Drag-and-drop via @dnd-kit for status changes
 * - Role assignment badges on task cards
 * - Filters by project and assignee
 */

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Avatar,
  AvatarFallback,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/lib/ui';
import {
  Plus,
  Search,
  ListTodo,
  Clock,
  User,
  Filter,
  GripVertical,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { DBTask } from '@/lib/db/tasks';
import type { DBProject } from '@/lib/db/projects';

// Type for task with assignments
// Status extends DBTask status to include kanban-specific statuses
export interface KanbanTask extends Omit<DBTask, 'assignee_ids' | 'status'> {
  status: DBTask['status'] | 'backlog' | 'review';
  assignee_ids: string[];
  assignments?: Array<{
    id: string;
    user_name?: string;
    role_name?: string;
    role_color?: string;
  }>;
}

export interface KanbanProps {
  initialTasks: KanbanTask[];
  projects: DBProject[];
  users: Array<{ id: string; name: string; email: string }>;
  stats: {
    total: number;
    todo: number;
    in_progress: number;
    done: number;
    overdue: number;
  };
}

// Kanban status type
type KanbanStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

// Static Tailwind class mappings
const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  low: 'text-xs border-gray-500/30 bg-gray-500/10 text-gray-400',
  medium: 'text-xs border-blue-500/30 bg-blue-500/10 text-blue-400',
  high: 'text-xs border-orange-500/30 bg-orange-500/10 text-orange-400',
  urgent: 'text-xs border-red-500/30 bg-red-500/10 text-red-400',
  critical: 'text-xs border-red-500/30 bg-red-500/10 text-red-400',
};

const STATUS_HEADER_CLASSES: Record<KanbanStatus, string> = {
  backlog: 'glass-card rounded-t-xl p-4 border-b-2 border-gray-500/30',
  todo: 'glass-card rounded-t-xl p-4 border-b-2 border-blue-500/30',
  in_progress: 'glass-card rounded-t-xl p-4 border-b-2 border-yellow-500/30',
  review: 'glass-card rounded-t-xl p-4 border-b-2 border-purple-500/30',
  done: 'glass-card rounded-t-xl p-4 border-b-2 border-green-500/30',
};

// Drag-and-drop configuration
const DRAG_ACTIVATION_DISTANCE_PX = 8;

// Kanban columns configuration
const KANBAN_COLUMNS: Array<{ id: KanbanStatus; title: string }> = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

// Map database status to kanban status
function toKanbanStatus(status: string): KanbanStatus {
  const mapping: Record<string, KanbanStatus> = {
    backlog: 'backlog',
    todo: 'todo',
    in_progress: 'in_progress',
    review: 'review',
    done: 'done',
    completed: 'done',
    paused: 'backlog',
    blocked: 'backlog',
    planned: 'backlog',
    overdue: 'todo',
  };
  return mapping[status] || 'backlog';
}

// Map kanban status to API status (for updating via API)
function toApiStatus(kanbanStatus: KanbanStatus): DBTask['status'] {
  const mapping: Record<KanbanStatus, DBTask['status']> = {
    backlog: 'planned',
    todo: 'todo',
    in_progress: 'in_progress',
    review: 'in_progress', // API doesn't have 'review', use in_progress
    done: 'done',
  };
  return mapping[kanbanStatus];
}

// Derive priority from task (using target_date for demo)
function derivePriority(task: KanbanTask): string {
  if (!task.target_date) return 'medium';
  const daysUntilDue = Math.ceil(
    (new Date(task.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntilDue < 0) return 'critical';
  if (daysUntilDue <= 1) return 'urgent';
  if (daysUntilDue <= 3) return 'high';
  if (daysUntilDue <= 7) return 'medium';
  return 'low';
}

// Sortable Task Card
function SortableTaskCard({
  task,
  onNavigate,
}: {
  task: KanbanTask;
  onNavigate: (id: string) => void;
}) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCard
        task={task}
        onNavigate={onNavigate}
        dragHandleProps={listeners}
      />
    </div>
  );
}

// Task Card Component
function TaskCard({
  task,
  onNavigate,
  dragHandleProps,
}: {
  task: KanbanTask;
  onNavigate: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
}) {
  const router = useRouter();
  const priority = derivePriority(task);

  // Get initials for avatar
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const handleClick = () => {
    onNavigate(task.id);
    router.push(`/dashboard/tools/tasks/${task.id}`);
  };

  return (
    <Card
      className="group cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {/* Header with drag handle */}
        <div className="flex items-start gap-2 mb-3">
          {dragHandleProps && (
            <button
              type="button"
              className="p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder task"
              {...dragHandleProps}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4 text-[#C4C8D4]" />
            </button>
          )}
          <Badge
            variant="outline"
            className={PRIORITY_BADGE_CLASSES[priority] || PRIORITY_BADGE_CLASSES.medium}
          >
            {priority}
          </Badge>
        </div>

        {/* Task title */}
        <h4 className="text-sm font-sans font-medium text-white mb-2 line-clamp-2">
          {task.name}
        </h4>

        {/* Project tag */}
        {task.project_title && (
          <p className="text-xs text-[#C4C8D4] mb-3">{task.project_title}</p>
        )}

        {/* Role Assignments */}
        {task.assignments && task.assignments.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.assignments.slice(0, 3).map((assignment) => (
              <TooltipProvider key={assignment.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{
                        backgroundColor: assignment.role_color
                          ? `${assignment.role_color}20`
                          : 'rgba(14, 194, 188, 0.1)',
                        color: assignment.role_color || '#0ec2bc',
                        borderColor: assignment.role_color
                          ? `${assignment.role_color}40`
                          : 'rgba(14, 194, 188, 0.25)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                      }}
                    >
                      {assignment.role_name?.slice(0, 10) || 'Role'}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {assignment.user_name || 'Unassigned'} - {assignment.role_name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {task.assignments.length > 3 && (
              <span className="text-[10px] text-[#C4C8D4] self-center">
                +{task.assignments.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-primary/10">
          {/* Task type icon and due date */}
          <div className="flex items-center gap-2 text-xs text-[#C4C8D4]">
            <ListTodo className="w-3.5 h-3.5" />
            {task.target_date && (
              <span className={derivePriority(task) === 'critical' ? 'text-red-400' : ''}>
                {new Date(task.target_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Assignee avatars */}
          {task.assignments && task.assignments.length > 0 && (
            <div className="flex -space-x-1">
              {task.assignments.slice(0, 2).map((assignment) => (
                <Avatar
                  key={assignment.id}
                  className="w-6 h-6 border-2 border-card"
                >
                  <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                    {assignment.user_name ? getInitials(assignment.user_name) : '?'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignments.length > 2 && (
                <Avatar className="w-6 h-6 border-2 border-card">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                    +{task.assignments.length - 2}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Kanban Column Component
function KanbanColumn({
  title,
  status,
  tasks,
  onNavigate,
}: {
  title: string;
  status: KanbanStatus;
  tasks: KanbanTask[];
  onNavigate: (id: string) => void;
}) {
  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="flex-shrink-0 w-72 flex flex-col">
      {/* Column header */}
      <div className={STATUS_HEADER_CLASSES[status]}>
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-medium text-white">{title}</h3>
          <Badge
            variant="secondary"
            className="bg-primary/20 text-primary border-primary/30"
          >
            {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Task cards with sortable context */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          className="glass-card rounded-b-xl p-3 flex-1 space-y-3 min-h-[500px] max-h-[calc(100vh-280px)] overflow-y-auto"
          data-status={status}
        >
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onNavigate={onNavigate} />
          ))}

          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-[#C4C8D4] text-sm border-2 border-dashed border-primary/10 rounded-lg">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10 border-primary/20',
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl border ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <dt className="text-sm font-sans text-[#C4C8D4] mb-1">{label}</dt>
          <dd className="text-2xl font-sans font-medium text-white">{value}</dd>
        </div>
      </div>
    </div>
  );
}

// Main Kanban Component
export default function TasksKanban({
  initialTasks,
  projects,
  users,
  stats,
}: KanbanProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_ACTIVATION_DISTANCE_PX,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Project filter
    if (selectedProject !== 'all' && task.project_id !== selectedProject) {
      return false;
    }

    // Assignee filter
    if (selectedAssignee !== 'all') {
      const hasAssignee =
        task.assignee_ids?.includes(selectedAssignee) ||
        task.assignments?.some((a) => a.id === selectedAssignee);
      if (!hasAssignee) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.name.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project_title?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Group tasks by status
  const tasksByStatus = KANBAN_COLUMNS.map((column) => ({
    ...column,
    tasks: filteredTasks.filter(
      (task) => toKanbanStatus(task.status) === column.id
    ),
  }));

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  // Handle drag end - update task status
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;

      if (!over) return;

      const taskId = active.id as string;
      const overElement = over.id as string;

      // Find the target column by checking if we dropped over a task or column
      let newStatus: KanbanStatus | null = null;

      // Check if dropped directly on a column
      if (KANBAN_COLUMNS.some((col) => col.id === overElement)) {
        newStatus = overElement as KanbanStatus;
      } else {
        // Find which column the target task belongs to
        const targetTask = tasks.find((t) => t.id === overElement);
        if (targetTask) {
          newStatus = toKanbanStatus(targetTask.status);
        }
      }

      if (!newStatus) return;

      const task = tasks.find((t) => t.id === taskId);
      if (!task || toKanbanStatus(task.status) === newStatus) return;

      // Convert kanban status to API status
      const apiStatus = toApiStatus(newStatus);

      // Optimistic update - use kanban status for UI
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: newStatus,
                is_done: newStatus === 'done',
              }
            : t
        )
      );

      // API update - use API-compatible status
      setIsUpdating(true);
      setUpdateError(null);

      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: apiStatus,
            is_done: newStatus === 'done',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task status');
        }
      } catch (error) {
        // Rollback on error
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? task : t))
        );

        // Log error safely (sanitize in production)
        const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
        if (process.env.NODE_ENV === 'development') {
          console.error('[TasksKanban] Failed to update task status:', error);
        } else {
          // In production, log sanitized message only
          console.error('[TasksKanban] Task update failed:', errorMessage);
        }

        setUpdateError(errorMessage);
      } finally {
        setIsUpdating(false);
      }
    },
    [tasks]
  );

  // Navigate to task detail
  const handleNavigate = (taskId: string) => {
    router.push(`/dashboard/tools/tasks/${taskId}`);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {updateError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{updateError}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-decorative text-white mb-2">Tasks</h1>
            <p className="text-lg font-sans text-[#C4C8D4]">
              Kanban board for task management
              {isUpdating && (
                <span className="ml-2 text-primary text-sm">Saving...</span>
              )}
            </p>
          </div>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => router.push('/dashboard/tools/tasks/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={ListTodo} label="Total Tasks" value={stats.total} />
          <StatCard
            icon={Clock}
            label="In Progress"
            value={stats.in_progress}
            iconColor="text-yellow-400"
            iconBg="bg-yellow-500/10 border-yellow-500/20"
          />
          <StatCard
            icon={User}
            label="Completed"
            value={stats.done}
            iconColor="text-green-400"
            iconBg="bg-green-500/10 border-green-500/20"
          />
          <StatCard
            icon={Filter}
            label="Overdue"
            value={stats.overdue}
            iconColor="text-red-400"
            iconBg="bg-red-500/10 border-red-500/20"
          />
        </div>

        {/* Filters */}
        <div className="glass-card-strong rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4C8D4]" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#0F1419] border-primary/20 text-white placeholder:text-[#C4C8D4]"
              />
            </div>

            {/* Project filter */}
            <Select
              value={selectedProject}
              onValueChange={setSelectedProject}
              name="project-filter"
            >
              <SelectTrigger
                className="w-full md:w-[200px] bg-[#0F1419] border-primary/20 text-white"
                id="project-filter"
              >
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F1419] border-primary/20">
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Assignee filter */}
            <Select
              value={selectedAssignee}
              onValueChange={setSelectedAssignee}
              name="assignee-filter"
            >
              <SelectTrigger
                className="w-full md:w-[200px] bg-[#0F1419] border-primary/20 text-white"
                id="assignee-filter"
              >
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F1419] border-primary/20">
                <SelectItem value="all">All Assignees</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-max">
            {tasksByStatus.map((column) => (
              <KanbanColumn
                key={column.id}
                title={column.title}
                status={column.id}
                tasks={column.tasks}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} onNavigate={() => {}} />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
