'use client';

/**
 * Tasks Kanban Board
 *
 * Kanban-style task management interface with columns for different statuses.
 * Features filters by project and assignee.
 */

import React, { useState } from 'react';
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
} from '@/lib/ui';
import {
  Plus,
  Search,
  ListTodo,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import type { Task, TaskStatus, Priority } from '@/types/projects';

// Static Tailwind class mappings to avoid dynamic class generation
// (Tailwind JIT needs to see complete class strings at build time)
const PRIORITY_BADGE_CLASSES: Record<Priority, string> = {
  low: 'text-xs border-gray-500/30 bg-gray-500/10 text-gray-400',
  medium: 'text-xs border-blue-500/30 bg-blue-500/10 text-blue-400',
  high: 'text-xs border-orange-500/30 bg-orange-500/10 text-orange-400',
  urgent: 'text-xs border-red-500/30 bg-red-500/10 text-red-400',
  critical: 'text-xs border-red-500/30 bg-red-500/10 text-red-400',
};

const STATUS_HEADER_CLASSES: Record<TaskStatus, string> = {
  backlog: 'glass-card rounded-t-xl p-4 border-b-2 border-gray-500/30',
  todo: 'glass-card rounded-t-xl p-4 border-b-2 border-blue-500/30',
  in_progress: 'glass-card rounded-t-xl p-4 border-b-2 border-yellow-500/30',
  review: 'glass-card rounded-t-xl p-4 border-b-2 border-purple-500/30',
  done: 'glass-card rounded-t-xl p-4 border-b-2 border-green-500/30',
  blocked: 'glass-card rounded-t-xl p-4 border-b-2 border-red-500/30',
  cancelled: 'glass-card rounded-t-xl p-4 border-b-2 border-gray-500/30',
};

// Mock task data
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new landing page',
    status: 'in_progress',
    priority: 'high',
    taskType: 'feature',
    projectId: 'proj-1',
    assigneeId: 'user-1',
    orderIndex: 0,
    actualHours: 4,
    dependsOn: [],
    tags: ['design', 'ui'],
    labels: [],
    createdAt: '2025-11-25T10:00:00Z',
    updatedAt: '2025-11-27T14:30:00Z',
    project: {
      id: 'proj-1',
      name: 'Website Redesign',
      status: 'active',
      priority: 'high',
      currency: 'EUR',
      actualCostCents: 0,
      progressPercent: 45,
      teamMembers: [],
      tags: [],
      createdAt: '2025-11-20T00:00:00Z',
      updatedAt: '2025-11-27T00:00:00Z',
    },
    assignee: {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
    },
  },
  {
    id: '2',
    title: 'Update course content structure',
    description: 'Reorganize course modules and lessons',
    status: 'todo',
    priority: 'medium',
    taskType: 'task',
    projectId: 'proj-2',
    assigneeId: 'user-2',
    orderIndex: 0,
    actualHours: 0,
    dependsOn: [],
    tags: ['content'],
    labels: [],
    createdAt: '2025-11-26T09:00:00Z',
    updatedAt: '2025-11-26T09:00:00Z',
    project: {
      id: 'proj-2',
      name: 'Course Platform',
      status: 'active',
      priority: 'medium',
      currency: 'EUR',
      actualCostCents: 0,
      progressPercent: 30,
      teamMembers: [],
      tags: [],
      createdAt: '2025-11-15T00:00:00Z',
      updatedAt: '2025-11-26T00:00:00Z',
    },
    assignee: {
      id: 'user-2',
      name: 'Michael Torres',
      email: 'michael@example.com',
    },
  },
  {
    id: '3',
    title: 'Fix authentication bug',
    description: 'Users getting logged out unexpectedly',
    status: 'review',
    priority: 'urgent',
    taskType: 'bug',
    projectId: 'proj-1',
    assigneeId: 'user-3',
    orderIndex: 0,
    actualHours: 6,
    dependsOn: [],
    tags: ['bug', 'auth'],
    labels: [],
    createdAt: '2025-11-24T15:00:00Z',
    updatedAt: '2025-11-27T16:00:00Z',
    project: {
      id: 'proj-1',
      name: 'Website Redesign',
      status: 'active',
      priority: 'high',
      currency: 'EUR',
      actualCostCents: 0,
      progressPercent: 45,
      teamMembers: [],
      tags: [],
      createdAt: '2025-11-20T00:00:00Z',
      updatedAt: '2025-11-27T00:00:00Z',
    },
    assignee: {
      id: 'user-3',
      name: 'Alex Kim',
      email: 'alex@example.com',
    },
  },
  {
    id: '4',
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples',
    status: 'backlog',
    priority: 'low',
    taskType: 'documentation',
    projectId: 'proj-3',
    assigneeId: 'user-1',
    orderIndex: 0,
    actualHours: 0,
    dependsOn: [],
    tags: ['docs'],
    labels: [],
    createdAt: '2025-11-23T11:00:00Z',
    updatedAt: '2025-11-23T11:00:00Z',
    project: {
      id: 'proj-3',
      name: 'API Development',
      status: 'active',
      priority: 'medium',
      currency: 'EUR',
      actualCostCents: 0,
      progressPercent: 60,
      teamMembers: [],
      tags: [],
      createdAt: '2025-11-10T00:00:00Z',
      updatedAt: '2025-11-25T00:00:00Z',
    },
    assignee: {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
    },
  },
  {
    id: '5',
    title: 'Implement payment gateway',
    description: 'Integrate Stripe for course purchases',
    status: 'in_progress',
    priority: 'high',
    taskType: 'feature',
    projectId: 'proj-2',
    assigneeId: 'user-3',
    orderIndex: 1,
    actualHours: 12,
    dependsOn: [],
    tags: ['payment', 'integration'],
    labels: [],
    createdAt: '2025-11-22T08:00:00Z',
    updatedAt: '2025-11-27T10:00:00Z',
    project: {
      id: 'proj-2',
      name: 'Course Platform',
      status: 'active',
      priority: 'medium',
      currency: 'EUR',
      actualCostCents: 0,
      progressPercent: 30,
      teamMembers: [],
      tags: [],
      createdAt: '2025-11-15T00:00:00Z',
      updatedAt: '2025-11-26T00:00:00Z',
    },
    assignee: {
      id: 'user-3',
      name: 'Alex Kim',
      email: 'alex@example.com',
    },
  },
  {
    id: '6',
    title: 'Add analytics dashboard',
    description: 'Create student progress analytics',
    status: 'done',
    priority: 'medium',
    taskType: 'feature',
    projectId: 'proj-2',
    assigneeId: 'user-2',
    orderIndex: 0,
    actualHours: 16,
    dependsOn: [],
    tags: ['analytics'],
    labels: [],
    createdAt: '2025-11-18T09:00:00Z',
    updatedAt: '2025-11-26T17:00:00Z',
    completedAt: '2025-11-26T17:00:00Z',
    project: {
      id: 'proj-2',
      name: 'Course Platform',
      status: 'active',
      priority: 'medium',
      currency: 'EUR',
      actualCostCents: 0,
      progressPercent: 30,
      teamMembers: [],
      tags: [],
      createdAt: '2025-11-15T00:00:00Z',
      updatedAt: '2025-11-26T00:00:00Z',
    },
    assignee: {
      id: 'user-2',
      name: 'Michael Torres',
      email: 'michael@example.com',
    },
  },
  {
    id: '7',
    title: 'Research competitor features',
    description: 'Analyze top 5 competitors for feature comparison',
    status: 'todo',
    priority: 'medium',
    taskType: 'research',
    projectId: 'proj-1',
    assigneeId: 'user-2',
    orderIndex: 1,
    actualHours: 0,
    dependsOn: [],
    tags: ['research'],
    labels: [],
    createdAt: '2025-11-27T10:00:00Z',
    updatedAt: '2025-11-27T10:00:00Z',
    project: {
      id: 'proj-1',
      name: 'Website Redesign',
      status: 'active',
      priority: 'high',
      currency: 'EUR',
      actualCostCents: 0,
      progressPercent: 45,
      teamMembers: [],
      tags: [],
      createdAt: '2025-11-20T00:00:00Z',
      updatedAt: '2025-11-27T00:00:00Z',
    },
    assignee: {
      id: 'user-2',
      name: 'Michael Torres',
      email: 'michael@example.com',
    },
  },
  {
    id: '8',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'done',
    priority: 'high',
    taskType: 'improvement',
    projectId: 'proj-3',
    assigneeId: 'user-3',
    orderIndex: 0,
    actualHours: 8,
    dependsOn: [],
    tags: ['devops', 'automation'],
    labels: [],
    createdAt: '2025-11-19T14:00:00Z',
    updatedAt: '2025-11-25T12:00:00Z',
    completedAt: '2025-11-25T12:00:00Z',
    project: {
      id: 'proj-3',
      name: 'API Development',
      status: 'active',
      priority: 'medium',
      currency: 'EUR',
      actualCostCents: 0,
      progressPercent: 60,
      teamMembers: [],
      tags: [],
      createdAt: '2025-11-10T00:00:00Z',
      updatedAt: '2025-11-25T00:00:00Z',
    },
    assignee: {
      id: 'user-3',
      name: 'Alex Kim',
      email: 'alex@example.com',
    },
  },
];

// Kanban columns configuration
const KANBAN_COLUMNS: Array<{ id: TaskStatus; title: string }> = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

// Extract unique projects and assignees for filters
const PROJECTS = Array.from(
  new Map(
    MOCK_TASKS.filter(t => t.project)
      .map(t => [t.project!.id, t.project!])
  ).values()
);

const ASSIGNEES = Array.from(
  new Map(
    MOCK_TASKS.filter(t => t.assignee)
      .map(t => [t.assignee!.id, t.assignee!])
  ).values()
);

function TaskCard({ task }: { task: Task }) {
  // Get initials for avatar
  const initials = task.assignee?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <Card className="group cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
      <CardContent className="p-4">
        {/* Priority badge */}
        <div className="mb-3">
          <Badge
            variant="outline"
            className={PRIORITY_BADGE_CLASSES[task.priority]}
          >
            {task.priority}
          </Badge>
        </div>

        {/* Task title */}
        <h4 className="text-sm font-sans font-medium text-white mb-2 line-clamp-2">
          {task.title}
        </h4>

        {/* Project tag */}
        {task.project && (
          <p className="text-xs text-[#C4C8D4] mb-3">
            {task.project.name}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-primary/10">
          {/* Task type icon */}
          <div className="flex items-center gap-2 text-xs text-[#C4C8D4]">
            <ListTodo className="w-3.5 h-3.5" />
            <span className="capitalize">{task.taskType}</span>
          </div>

          {/* Assignee avatar */}
          {task.assignee && (
            <Avatar className="w-6 h-6 border border-primary/20">
              <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanColumn({
  title,
  status,
  tasks
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[]
}) {
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

      {/* Task cards */}
      <div className="glass-card rounded-b-xl p-3 flex-1 space-y-3 min-h-[500px] max-h-[calc(100vh-280px)] overflow-y-auto">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-[#C4C8D4] text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

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

export default function TasksKanban() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks
  const filteredTasks = MOCK_TASKS.filter(task => {
    // Project filter
    if (selectedProject !== 'all' && task.projectId !== selectedProject) {
      return false;
    }

    // Assignee filter
    if (selectedAssignee !== 'all' && task.assigneeId !== selectedAssignee) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project?.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate stats
  const totalTasks = filteredTasks.length;
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = filteredTasks.filter(t => t.status === 'done').length;
  const urgentTasks = filteredTasks.filter(t => t.priority === 'urgent' || t.priority === 'critical').length;

  // Group tasks by status
  const tasksByStatus = KANBAN_COLUMNS.map(column => ({
    ...column,
    tasks: filteredTasks.filter(task => task.status === column.id),
  }));

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-decorative text-white mb-2">Tasks</h1>
          <p className="text-lg font-sans text-[#C4C8D4]">
            Kanban board for task management
          </p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={ListTodo}
          label="Total Tasks"
          value={totalTasks}
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={inProgressTasks}
          iconColor="text-yellow-400"
          iconBg="bg-yellow-500/10 border-yellow-500/20"
        />
        <StatCard
          icon={User}
          label="Completed"
          value={completedTasks}
          iconColor="text-green-400"
          iconBg="bg-green-500/10 border-green-500/20"
        />
        <StatCard
          icon={Filter}
          label="Urgent"
          value={urgentTasks}
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
          <Select value={selectedProject} onValueChange={setSelectedProject} name="project-filter">
            <SelectTrigger className="w-full md:w-[200px] bg-[#0F1419] border-primary/20 text-white" id="project-filter">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F1419] border-primary/20">
              <SelectItem value="all">All Projects</SelectItem>
              {PROJECTS.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assignee filter */}
          <Select value={selectedAssignee} onValueChange={setSelectedAssignee} name="assignee-filter">
            <SelectTrigger className="w-full md:w-[200px] bg-[#0F1419] border-primary/20 text-white" id="assignee-filter">
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F1419] border-primary/20">
              <SelectItem value="all">All Assignees</SelectItem>
              {ASSIGNEES.map(assignee => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-max">
          {tasksByStatus.map(column => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              status={column.id}
              tasks={column.tasks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
