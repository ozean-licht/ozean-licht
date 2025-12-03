'use client';

/**
 * Projects Dashboard
 *
 * Main dashboard view for project management showing:
 * - Overview stats (active projects, tasks, completion rate) from real data
 * - My Tasks widget with real tasks
 * - Tabbed view for Projects and Process Templates
 * - Collapsible Recent Activity
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Filter,
  LayoutGrid,
  List,
  Activity,
  ChevronDown,
  ChevronUp,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { MyTasksWidget, ProjectCard, ProcessTemplatesWidget } from '@/components/projects';
import type { DBProject } from '@/lib/types';
import type { TaskItem, Project } from '@/components/projects';

interface ProjectsDashboardProps {
  user: {
    id: string;
    email: string;
    adminRole: string;
    permissions: string[];
  };
}

// Map DBProject to the Project type expected by ProjectCard
function mapToProjectCard(project: DBProject): Project {
  return {
    id: project.id,
    name: project.title,
    description: project.description || '',
    status: (project.status as Project['status']) || 'planning',
    type: project.interval_type === 'Fortlaufend' ? 'recurring' : 'one-time',
    projectType: project.project_type || undefined,
    progress: project.progress_percent || 0,
    totalTasks: project.tasks_total || 0,
    completedTasks: project.tasks_done || 0,
    startDate: project.start_date || '',
    endDate: project.target_date || undefined,
    teamMembers: project.assignee_ids?.length || 0,
    templateName: project.used_template ? 'From Template' : undefined,
  };
}

export default function ProjectsDashboard({ user: _user }: ProjectsDashboardProps) {
  const router = useRouter();

  // State
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [_tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    recurringProjects: 0,
    completionRate: 0,
    overdueTasks: 0,
  });

  // UI state - default to list view and active filter
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [projectFilter, setProjectFilter] = useState<'all' | 'active' | 'recurring' | 'completed'>('active');
  const [mainTab, setMainTab] = useState<'projects' | 'templates'>('projects');
  const [activityExpanded, setActivityExpanded] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch projects and tasks in parallel
        const [projectsRes, tasksRes] = await Promise.all([
          fetch('/api/projects?includeStats=true&limit=100'),
          fetch('/api/tasks?tab=active&limit=50&includeStats=true'),
        ]);

        if (!projectsRes.ok || !tasksRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();

        setProjects(projectsData.projects || []);
        setTasks(tasksData.tasks || []);

        // Calculate stats
        const allProjects = projectsData.projects || [];
        const totalProjects = projectsData.total || allProjects.length;
        const activeProjects = allProjects.filter((p: DBProject) => p.status === 'active').length;
        const recurringProjects = allProjects.filter((p: DBProject) => p.interval_type === 'Fortlaufend').length;

        const totalTasks = allProjects.reduce((sum: number, p: DBProject) => sum + (p.tasks_total || 0), 0);
        const completedTasks = allProjects.reduce((sum: number, p: DBProject) => sum + (p.tasks_done || 0), 0);
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const overdueTasks = tasksData.stats?.overdue || 0;

        setStats({
          totalProjects,
          activeProjects,
          recurringProjects,
          completionRate,
          overdueTasks,
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    if (projectFilter === 'all') return true;
    if (projectFilter === 'active') return project.status === 'active';
    if (projectFilter === 'recurring') return project.interval_type === 'Fortlaufend';
    if (projectFilter === 'completed') return project.status === 'completed';
    return true;
  });

  // Handle project click
  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/tools/projects/${projectId}`);
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
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Handle task navigation
  const handleTaskNavigate = (taskId: string) => {
    router.push(`/dashboard/tools/tasks/${taskId}`);
  };

  // Handle new project
  const handleNewProject = () => {
    router.push('/dashboard/tools/projects/new');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl mb-8" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl text-white mb-2">Failed to Load</h2>
          <p className="text-[#C4C8D4] mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-decorative text-white mb-2">
            Project Management
          </h1>
          <p className="text-lg font-sans text-[#C4C8D4]">
            {stats.totalProjects} projects • {stats.overdueTasks > 0 ? (
              <span className="text-red-400">{stats.overdueTasks} overdue tasks</span>
            ) : 'All tasks on track'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={handleNewProject}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <FolderKanban className="w-6 h-6 text-primary" />
            </div>
            <div>
              <dt className="text-sm font-sans text-[#C4C8D4] mb-1">
                Total Projects
              </dt>
              <dd className="text-2xl font-sans font-medium text-white">
                {stats.totalProjects}
              </dd>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <dt className="text-sm font-sans text-[#C4C8D4] mb-1">
                Active Projects
              </dt>
              <dd className="text-2xl font-sans font-medium text-white">
                {stats.activeProjects}
              </dd>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <RefreshCw className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <dt className="text-sm font-sans text-[#C4C8D4] mb-1">
                Recurring
              </dt>
              <dd className="text-2xl font-sans font-medium text-white">
                {stats.recurringProjects}
              </dd>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <dt className="text-sm font-sans text-[#C4C8D4] mb-1">
                Completion Rate
              </dt>
              <dd className="text-2xl font-sans font-medium text-white">
                {stats.completionRate}%
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* My Tasks Widget - now with real data */}
      <div className="mb-8">
        <MyTasksWidget
          maxTasks={5}
          onTaskClick={handleTaskNavigate}
          onTaskToggle={(taskId, completed) => handleTaskUpdate(taskId, { is_done: completed })}
          onViewAll={() => router.push('/dashboard/tools/tasks')}
        />
      </div>

      {/* Main Tabbed Section */}
      <div className="glass-card-strong rounded-2xl overflow-hidden mb-8">
        <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as typeof mainTab)}>
          <div className="px-6 py-4 border-b border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList className="bg-[#00111A] border border-primary/20 p-1">
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6"
                >
                  <FolderKanban className="w-4 h-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="templates"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Templates
                </TabsTrigger>
              </TabsList>

              {mainTab === 'projects' && (
                <div className="flex items-center gap-3">
                  <Tabs value={projectFilter} onValueChange={(v) => setProjectFilter(v as typeof projectFilter)}>
                    <TabsList className="bg-[#00111A] border border-primary/20">
                      <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="active" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs">
                        Active
                      </TabsTrigger>
                      <TabsTrigger value="recurring" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs">
                        Recurring
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-[#C4C8D4] hover:text-white'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-[#C4C8D4] hover:text-white'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="projects" className="mt-0">
            <div className="px-6 py-2 border-b border-primary/10">
              <p className="text-sm font-sans text-[#C4C8D4]">
                {filteredProjects.length} projects found
              </p>
            </div>
            <div className="p-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={mapToProjectCard(project)}
                      onClick={handleProjectClick}
                      onActionClick={(id, action) => console.log('Action:', id, action)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={mapToProjectCard(project)}
                      compact
                      onClick={handleProjectClick}
                    />
                  ))}
                </div>
              )}

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <FolderKanban className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                  <p className="text-lg text-[#C4C8D4]">No projects found</p>
                  <p className="text-sm text-[#C4C8D4]/60 mt-1">
                    Try adjusting your filters or create a new project
                  </p>
                  <Button
                    className="mt-4 bg-primary text-white hover:bg-primary/90"
                    onClick={handleNewProject}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <div className="p-6">
              <ProcessTemplatesWidget
                maxTemplates={8}
                onTemplateClick={(templateId) => console.log('Template clicked:', templateId)}
                onCreateFromTemplate={(templateId) => router.push(`/dashboard/tools/projects/new?template=${templateId}`)}
                onViewAll={() => console.log('View all templates')}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recent Activity - keep existing implementation */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setActivityExpanded(!activityExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-sans font-medium text-white">Recent Activity</h2>
              <p className="text-sm text-[#C4C8D4]">
                {activityExpanded ? 'Latest updates across all projects' : 'Click to expand'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activityExpanded ? (
              <ChevronUp className="w-5 h-5 text-[#C4C8D4]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#C4C8D4]" />
            )}
          </div>
        </button>

        {activityExpanded && (
          <>
            <div className="border-t border-primary/20" />
            <div className="px-6 py-8 text-center">
              <Activity className="w-12 h-12 text-primary/40 mx-auto mb-3" />
              <p className="text-[#C4C8D4]">Activity tracking coming soon</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
