'use client';

/**
 * Projects Dashboard
 *
 * Main dashboard view for project management showing:
 * - Overview stats (active projects, tasks, completion rate)
 * - My Tasks widget
 * - Tabbed view for Projects and Process Templates
 * - Collapsible Recent Activity
 */

import React, { useState } from 'react';
// Card components available from @/components/ui/card if needed
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Filter,
  LayoutGrid,
  List,
  ArrowUpRight,
  Activity,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import { MyTasksWidget, ProjectCard, ProcessTemplatesWidget } from '@/components/projects';
import type { Project } from '@/components/projects';

interface ProjectsDashboardProps {
  user: {
    id: string;
    email: string;
    adminRole: string;
    permissions: string[];
  };
}

// Mock projects data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Admin Dashboard v2',
    description: 'Redesign and enhancement of the admin dashboard with new features and improved UX.',
    status: 'active',
    type: 'one-time',
    progress: 65,
    totalTasks: 48,
    completedTasks: 31,
    startDate: '2025-11-01',
    endDate: '2025-12-15',
    teamMembers: 4,
    templateName: 'Feature Development',
  },
  {
    id: '2',
    name: 'Weekly Content Review',
    description: 'Recurring weekly review of all new course content submissions.',
    status: 'active',
    type: 'recurring',
    recurrencePattern: 'weekly',
    progress: 80,
    totalTasks: 10,
    completedTasks: 8,
    startDate: '2025-11-01',
    nextOccurrence: '2025-11-29',
    teamMembers: 3,
  },
  {
    id: '3',
    name: 'Ozean Licht Course Launch',
    description: 'Launch of the new "Spiritual Awakening" course series including marketing campaign.',
    status: 'active',
    type: 'one-time',
    progress: 45,
    totalTasks: 36,
    completedTasks: 16,
    startDate: '2025-11-10',
    endDate: '2025-12-20',
    teamMembers: 6,
    templateName: 'Course Launch Workflow',
  },
  {
    id: '4',
    name: 'Monthly Analytics Report',
    description: 'Generate and distribute monthly platform analytics and KPI reports.',
    status: 'active',
    type: 'recurring',
    recurrencePattern: 'monthly',
    progress: 25,
    totalTasks: 8,
    completedTasks: 2,
    startDate: '2025-11-01',
    nextOccurrence: '2025-12-01',
    teamMembers: 2,
  },
  {
    id: '5',
    name: 'Shared UI Library',
    description: 'Development of the shared component library for cross-platform consistency.',
    status: 'paused',
    type: 'one-time',
    progress: 70,
    totalTasks: 24,
    completedTasks: 17,
    startDate: '2025-10-15',
    endDate: '2025-11-30',
    teamMembers: 3,
    templateName: 'Feature Development',
  },
  {
    id: '6',
    name: 'User Feedback Collection',
    description: 'Quarterly user feedback collection and analysis initiative.',
    status: 'planning',
    type: 'recurring',
    recurrencePattern: 'quarterly',
    progress: 0,
    totalTasks: 12,
    completedTasks: 0,
    startDate: '2025-12-01',
    nextOccurrence: '2025-12-01',
    teamMembers: 4,
  },
];

// Mock recent activity
const recentActivity = [
  { id: '1', action: 'Task completed', project: 'Admin Dashboard v2', user: 'Maria S.', time: '10 min ago' },
  { id: '2', action: 'Comment added', project: 'Ozean Licht Course Launch', user: 'Alex K.', time: '25 min ago' },
  { id: '3', action: 'Project updated', project: 'Weekly Content Review', user: 'System', time: '1 hour ago' },
  { id: '4', action: 'New task created', project: 'Admin Dashboard v2', user: 'You', time: '2 hours ago' },
  { id: '5', action: 'Milestone reached', project: 'Shared UI Library', user: 'Team', time: '3 hours ago' },
];

export default function ProjectsDashboard({ user: _user }: ProjectsDashboardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projectFilter, setProjectFilter] = useState<'all' | 'active' | 'recurring' | 'completed'>('all');
  const [mainTab, setMainTab] = useState<'projects' | 'templates'>('projects');
  const [activityExpanded, setActivityExpanded] = useState(false);

  // Calculate stats
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const recurringProjects = mockProjects.filter(p => p.type === 'recurring').length;
  const totalTasks = mockProjects.reduce((sum, p) => sum + p.totalTasks, 0);
  const completedTasks = mockProjects.reduce((sum, p) => sum + p.completedTasks, 0);
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // Filter projects
  const filteredProjects = mockProjects.filter(project => {
    if (projectFilter === 'all') return true;
    if (projectFilter === 'active') return project.status === 'active';
    if (projectFilter === 'recurring') return project.type === 'recurring';
    if (projectFilter === 'completed') return project.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-decorative text-white mb-2">
            Project Management
          </h1>
          <p className="text-lg font-sans text-[#C4C8D4]">
            Manage projects, tasks, and process templates
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
          <Button className="bg-primary text-white hover:bg-primary/90">
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
                {totalProjects}
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
                {activeProjects}
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
                {recurringProjects}
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
                {completionRate}%
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* My Tasks Widget */}
      <div className="mb-8">
        <MyTasksWidget
          maxTasks={5}
          onTaskClick={(taskId) => console.log('Task clicked:', taskId)}
          onTaskToggle={(taskId, completed) => console.log('Task toggled:', taskId, completed)}
          onViewAll={() => console.log('View all tasks')}
        />
      </div>

      {/* Main Tabbed Section - Projects & Templates */}
      <div className="glass-card-strong rounded-2xl overflow-hidden mb-8">
        <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as typeof mainTab)}>
          {/* Tab Header */}
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

              {/* Projects tab controls */}
              {mainTab === 'projects' && (
                <div className="flex items-center gap-3">
                  {/* Filter tabs */}
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

                  {/* View mode toggle */}
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

          {/* Projects Tab Content */}
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
                      project={project}
                      onClick={(id) => console.log('Project clicked:', id)}
                      onActionClick={(id, action) => console.log('Action:', id, action)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      compact
                      onClick={(id) => console.log('Project clicked:', id)}
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
                  <Button className="mt-4 bg-primary text-white hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Templates Tab Content */}
          <TabsContent value="templates" className="mt-0">
            <div className="p-6">
              <ProcessTemplatesWidget
                maxTemplates={8}
                onTemplateClick={(templateId) => console.log('Template clicked:', templateId)}
                onCreateFromTemplate={(templateId) => console.log('Create from template:', templateId)}
                onViewAll={() => console.log('View all templates')}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recent Activity Section - Collapsible */}
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
                {activityExpanded ? 'Latest updates across all projects' : `${recentActivity.length} recent updates`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!activityExpanded && (
              <span className="text-xs text-[#C4C8D4] hidden sm:inline">Click to expand</span>
            )}
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
            <div className="divide-y divide-primary/10">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="px-6 py-4 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm text-white">
                          <span className="font-medium">{activity.action}</span>
                          <span className="text-[#C4C8D4]"> in </span>
                          <span className="text-primary">{activity.project}</span>
                        </p>
                        <p className="text-xs text-[#C4C8D4] mt-0.5">
                          by {activity.user}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#C4C8D4]">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-primary/20 flex justify-end">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All Activity
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
