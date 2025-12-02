'use client';

/**
 * Tasks Page Client Component
 *
 * Displays all tasks with:
 * - Tab navigation (Active, Overdue, Planned, Done)
 * - Search input
 * - Project filter dropdown
 * - DataTable with pagination
 * - Task statistics
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarCheck,
  FolderKanban,
  Plus,
  X,
} from 'lucide-react';
import { TaskList, type TaskItem } from '@/components/projects';
import type { DBProject } from '@/lib/db/projects';

interface TasksPageClientProps {
  tasks: TaskItem[];
  total: number;
  stats: {
    total: number;
    todo: number;
    in_progress: number;
    done: number;
    overdue: number;
  };
  projects: DBProject[];
  currentPage: number;
  pageSize: number;
  filters: {
    status?: string;
    projectId?: string;
    search?: string;
    tab?: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export default function TasksPageClient({
  tasks: initialTasks,
  total,
  stats,
  projects,
  currentPage,
  pageSize,
  filters,
  user: _user,
}: TasksPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tasks, setTasks] = useState(initialTasks);
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [activeTab, setActiveTab] = useState<'active' | 'overdue' | 'planned' | 'done'>(
    (filters.tab as any) || 'active'
  );
  const [selectedProject, setSelectedProject] = useState(filters.projectId || 'all');

  // Update URL params
  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page when filters change
    if (!updates.page) {
      params.delete('page');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        updateParams({ search: searchValue || undefined });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as typeof activeTab);
    updateParams({ tab });
  };

  // Handle project filter
  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    updateParams({ projectId: projectId === 'all' ? undefined : projectId });
  };

  // Handle task update
  const handleTaskUpdate = async (taskId: string, updates: Partial<TaskItem>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Update local state
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Navigate to task detail
  const handleTaskNavigate = (taskId: string) => {
    router.push(`/dashboard/tools/tasks/${taskId}`);
  };

  // Pagination
  const totalPages = Math.ceil(total / pageSize);
  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchValue('');
    setSelectedProject('all');
    setActiveTab('active');
    router.push(pathname);
  };

  const hasFilters = filters.search || filters.projectId || (filters.tab && filters.tab !== 'active');

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-decorative text-white mb-2">All Tasks</h1>
          <p className="text-lg text-[#C4C8D4]">
            {total} tasks total
            {stats.overdue > 0 && (
              <span className="text-red-400 ml-2">• {stats.overdue} overdue</span>
            )}
          </p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/70 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-[#C4C8D4]">To Do</p>
              <p className="text-lg font-medium text-white">{stats.todo}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/70 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CalendarCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-[#C4C8D4]">In Progress</p>
              <p className="text-lg font-medium text-white">{stats.in_progress}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/70 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-[#C4C8D4]">Done</p>
              <p className="text-lg font-medium text-white">{stats.done}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/70 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-[#C4C8D4]">Overdue</p>
              <p className="text-lg font-medium text-white">{stats.overdue}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-shrink-0">
            <TabsList className="bg-[#00111A] border border-primary/20">
              <TabsTrigger value="active" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Active
              </TabsTrigger>
              <TabsTrigger value="overdue" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                Overdue
                {stats.overdue > 0 && (
                  <Badge variant="destructive" className="ml-1.5 h-5 px-1.5">
                    {stats.overdue}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="planned" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Planned
              </TabsTrigger>
              <TabsTrigger value="done" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Done
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4C8D4]" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10 bg-[#00111A] border-primary/20 text-white"
            />
          </div>

          {/* Project filter */}
          <Select value={selectedProject} onValueChange={handleProjectChange}>
            <SelectTrigger className="w-48 bg-[#00111A] border-primary/20 text-white">
              <FolderKanban className="w-4 h-4 mr-2 text-[#C4C8D4]" />
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/20 max-h-[300px]">
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-[#C4C8D4] hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Task list */}
      <div className="glass-card rounded-2xl p-6">
        <TaskList
          tasks={tasks}
          isLoading={false}
          onTaskUpdate={handleTaskUpdate}
          onTaskNavigate={handleTaskNavigate}
          activeTab={activeTab}
          onTabChange={(tab) => handleTabChange(tab)}
          showProjects={true}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-primary/10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-primary/30 text-primary"
            >
              Previous
            </Button>
            <span className="text-sm text-[#C4C8D4] px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-primary/30 text-primary"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
