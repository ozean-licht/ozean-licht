'use client';

/**
 * Templates Dashboard
 *
 * Process templates management interface.
 * Focus on UX, uses shared-ui components.
 */

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  Button,
} from '@/lib/ui';
import {
  FileText,
  Clock,
  Users,
  MoreVertical,
  Plus,
  Layers,
  CheckSquare,
  GitBranch,
  ListChecks,
  Zap,
} from 'lucide-react';
import type { ProcessTemplate, TemplateType } from '@/types/projects';

// Mock template data
const MOCK_TEMPLATES: ProcessTemplate[] = [
  {
    id: '1',
    name: 'Content Creation Sprint',
    description: 'Complete workflow for creating and publishing course content from ideation to launch.',
    category: 'Content',
    templateType: 'sprint',
    steps: [
      { id: '1', title: 'Define content objectives', orderIndex: 1, estimatedHours: 2 },
      { id: '2', title: 'Create content outline', orderIndex: 2, estimatedHours: 4 },
      { id: '3', title: 'Write first draft', orderIndex: 3, estimatedHours: 8 },
      { id: '4', title: 'Review and edit content', orderIndex: 4, estimatedHours: 4 },
      { id: '5', title: 'Design supporting materials', orderIndex: 5, estimatedHours: 6 },
      { id: '6', title: 'Final review and publishing', orderIndex: 6, estimatedHours: 2 },
    ],
    defaultAssignees: {},
    estimatedDurationHours: 26,
    estimatedDurationDays: 7,
    isActive: true,
    isPublic: true,
    usageCount: 24,
    entityScope: 'ozean_licht',
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-11-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Website Feature Launch',
    description: 'End-to-end project template for developing and launching new website features.',
    category: 'Development',
    templateType: 'project',
    steps: [
      { id: '1', title: 'Requirements gathering', orderIndex: 1, estimatedHours: 4 },
      { id: '2', title: 'Technical design', orderIndex: 2, estimatedHours: 8 },
      { id: '3', title: 'Frontend development', orderIndex: 3, estimatedHours: 20 },
      { id: '4', title: 'Backend development', orderIndex: 4, estimatedHours: 16 },
      { id: '5', title: 'Integration testing', orderIndex: 5, estimatedHours: 8 },
      { id: '6', title: 'User acceptance testing', orderIndex: 6, estimatedHours: 4 },
      { id: '7', title: 'Deployment and monitoring', orderIndex: 7, estimatedHours: 4 },
    ],
    defaultAssignees: {},
    estimatedDurationHours: 64,
    estimatedDurationDays: 14,
    isActive: true,
    isPublic: true,
    usageCount: 18,
    entityScope: 'shared',
    createdAt: '2025-09-20T09:00:00Z',
    updatedAt: '2025-11-15T16:45:00Z',
  },
  {
    id: '3',
    name: 'Marketing Campaign Checklist',
    description: 'Comprehensive checklist for planning and executing marketing campaigns.',
    category: 'Marketing',
    templateType: 'checklist',
    steps: [
      { id: '1', title: 'Define campaign goals and KPIs', orderIndex: 1, estimatedHours: 2 },
      { id: '2', title: 'Identify target audience', orderIndex: 2, estimatedHours: 3 },
      { id: '3', title: 'Create content calendar', orderIndex: 3, estimatedHours: 4 },
      { id: '4', title: 'Design campaign assets', orderIndex: 4, estimatedHours: 12 },
      { id: '5', title: 'Set up tracking and analytics', orderIndex: 5, estimatedHours: 4 },
      { id: '6', title: 'Launch campaign', orderIndex: 6, estimatedHours: 2 },
      { id: '7', title: 'Monitor and optimize', orderIndex: 7, estimatedHours: 8 },
      { id: '8', title: 'Report results', orderIndex: 8, estimatedHours: 3 },
    ],
    defaultAssignees: {},
    estimatedDurationHours: 38,
    estimatedDurationDays: 10,
    isActive: true,
    isPublic: true,
    usageCount: 32,
    entityScope: 'ozean_licht',
    createdAt: '2025-10-01T11:00:00Z',
    updatedAt: '2025-11-22T10:15:00Z',
  },
  {
    id: '4',
    name: 'Blog Post Publishing Workflow',
    description: 'Simple workflow template for creating and publishing blog posts.',
    category: 'Content',
    templateType: 'workflow',
    steps: [
      { id: '1', title: 'Research topic and keywords', orderIndex: 1, estimatedHours: 2 },
      { id: '2', title: 'Write article', orderIndex: 2, estimatedHours: 4 },
      { id: '3', title: 'Create featured image', orderIndex: 3, estimatedHours: 1 },
      { id: '4', title: 'SEO optimization', orderIndex: 4, estimatedHours: 1 },
      { id: '5', title: 'Editorial review', orderIndex: 5, estimatedHours: 1 },
      { id: '6', title: 'Schedule and publish', orderIndex: 6, estimatedHours: 0.5 },
    ],
    defaultAssignees: {},
    estimatedDurationHours: 9.5,
    estimatedDurationDays: 3,
    isActive: true,
    isPublic: true,
    usageCount: 56,
    entityScope: 'ozean_licht',
    createdAt: '2025-09-10T08:00:00Z',
    updatedAt: '2025-11-25T12:00:00Z',
  },
  {
    id: '5',
    name: 'Student Onboarding Process',
    description: 'Complete onboarding workflow for new students joining Kids Ascension platform.',
    category: 'Operations',
    templateType: 'workflow',
    steps: [
      { id: '1', title: 'Welcome email and account setup', orderIndex: 1, estimatedHours: 0.5 },
      { id: '2', title: 'Parent orientation call', orderIndex: 2, estimatedHours: 1 },
      { id: '3', title: 'Platform walkthrough video', orderIndex: 3, estimatedHours: 0.5 },
      { id: '4', title: 'Initial assessment', orderIndex: 4, estimatedHours: 2 },
      { id: '5', title: 'Create personalized learning path', orderIndex: 5, estimatedHours: 1.5 },
      { id: '6', title: 'Schedule first session', orderIndex: 6, estimatedHours: 0.5 },
      { id: '7', title: 'Follow-up after first week', orderIndex: 7, estimatedHours: 0.5 },
    ],
    defaultAssignees: {},
    estimatedDurationHours: 6.5,
    estimatedDurationDays: 5,
    isActive: true,
    isPublic: false,
    usageCount: 12,
    entityScope: 'kids_ascension',
    createdAt: '2025-10-25T14:00:00Z',
    updatedAt: '2025-11-18T09:30:00Z',
  },
];

type TemplateFilterType = 'all' | TemplateType;
type CategoryFilter = 'all' | string;

// Template type icons
const TEMPLATE_TYPE_ICONS: Record<TemplateType, React.ElementType> = {
  project: Layers,
  workflow: GitBranch,
  checklist: ListChecks,
  sprint: Zap,
};

// Template type colors
const TEMPLATE_TYPE_COLORS: Record<TemplateType, string> = {
  project: 'text-blue-400',
  workflow: 'text-purple-400',
  checklist: 'text-green-400',
  sprint: 'text-amber-400',
};

function TemplateCard({ template }: { template: ProcessTemplate }) {
  const TypeIcon = TEMPLATE_TYPE_ICONS[template.templateType];
  const typeColor = TEMPLATE_TYPE_COLORS[template.templateType];

  return (
    <Card className="group cursor-pointer">
      {/* Header with icon */}
      <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center border-b border-primary/10">
        <TypeIcon className={`w-10 h-10 ${typeColor}`} />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
          <button className="p-1 rounded-md hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4 text-[#C4C8D4]" />
          </button>
        </div>
        <CardDescription className="line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="secondary" className="capitalize">
            {template.templateType}
          </Badge>
          {template.category && (
            <Badge variant="outline">{template.category}</Badge>
          )}
          {!template.isActive && (
            <Badge variant="destructive">Inactive</Badge>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-[#C4C8D4]">
          <div className="flex items-center gap-1.5" title="Number of steps">
            <CheckSquare className="w-4 h-4" />
            <span>{template.steps.length} steps</span>
          </div>
          <div className="flex items-center gap-1.5" title="Estimated duration">
            <Clock className="w-4 h-4" />
            <span>
              {template.estimatedDurationDays
                ? `${template.estimatedDurationDays}d`
                : template.estimatedDurationHours
                ? `${template.estimatedDurationHours}h`
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-1.5" title="Times used">
            <Users className="w-4 h-4" />
            <span>{template.usageCount} uses</span>
          </div>
        </div>
      </CardContent>
    </Card>
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

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
        <FileText className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-sans text-white mb-2">No templates yet</h3>
      <p className="text-[#C4C8D4] mb-6 max-w-sm mx-auto">
        Create your first process template to standardize workflows and boost productivity.
      </p>
      <Button className="bg-primary text-white hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" />
        Create Template
      </Button>
    </div>
  );
}

export default function TemplatesDashboard() {
  const [activeTab, setActiveTab] = useState<TemplateFilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      MOCK_TEMPLATES.filter(t => t.category).map(t => t.category!)
    );
    return ['all', ...Array.from(uniqueCategories)];
  }, []);

  // Calculate stats
  const totalTemplates = MOCK_TEMPLATES.length;
  const activeTemplates = MOCK_TEMPLATES.filter(t => t.isActive).length;
  const totalUsage = MOCK_TEMPLATES.reduce((sum, t) => sum + t.usageCount, 0);
  const projectTemplates = MOCK_TEMPLATES.filter(t => t.templateType === 'project').length;
  const workflowTemplates = MOCK_TEMPLATES.filter(t => t.templateType === 'workflow').length;
  const checklistTemplates = MOCK_TEMPLATES.filter(t => t.templateType === 'checklist').length;
  const sprintTemplates = MOCK_TEMPLATES.filter(t => t.templateType === 'sprint').length;

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter(template => {
      // Filter by type tab
      if (activeTab !== 'all' && template.templateType !== activeTab) {
        return false;
      }

      // Filter by category
      if (categoryFilter !== 'all' && template.category !== categoryFilter) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          template.name.toLowerCase().includes(query) ||
          template.description?.toLowerCase().includes(query) ||
          template.category?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [activeTab, categoryFilter, searchQuery]);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-decorative text-white mb-2">Process Templates</h1>
          <p className="text-lg font-sans text-[#C4C8D4]">
            Standardize workflows and boost team productivity
          </p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={FileText}
          label="Total Templates"
          value={totalTemplates}
        />
        <StatCard
          icon={CheckSquare}
          label="Active Templates"
          value={activeTemplates}
          iconColor="text-green-400"
          iconBg="bg-green-500/10 border-green-500/20"
        />
        <StatCard
          icon={Users}
          label="Total Usage"
          value={totalUsage}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
        />
        <StatCard
          icon={Layers}
          label="Categories"
          value={categories.length - 1}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Template List */}
      <div className="glass-card-strong rounded-2xl overflow-hidden">
        <Tabs defaultValue="all" onValueChange={(v: string | null) => v && setActiveTab(v as TemplateFilterType)}>
          {/* Tab Header */}
          <div className="px-6 py-4 border-b border-primary/20">
            <div className="flex flex-col gap-4">
              <TabsList>
                <TabsTab value="all">All Types</TabsTab>
                <TabsTab value="project">
                  <Layers className="w-4 h-4 mr-1.5" />
                  Projects ({projectTemplates})
                </TabsTab>
                <TabsTab value="workflow">
                  <GitBranch className="w-4 h-4 mr-1.5" />
                  Workflows ({workflowTemplates})
                </TabsTab>
                <TabsTab value="checklist">
                  <ListChecks className="w-4 h-4 mr-1.5" />
                  Checklists ({checklistTemplates})
                </TabsTab>
                <TabsTab value="sprint">
                  <Zap className="w-4 h-4 mr-1.5" />
                  Sprints ({sprintTemplates})
                </TabsTab>
              </TabsList>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Category filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#C4C8D4] whitespace-nowrap">Category:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          categoryFilter === category
                            ? 'bg-primary text-white'
                            : 'bg-primary/10 text-[#C4C8D4] hover:bg-primary/20'
                        }`}
                      >
                        {category === 'all' ? 'All' : category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="flex-1 sm:ml-auto sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-white placeholder:text-[#C4C8D4]/50 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>

              <p className="text-sm text-[#C4C8D4]">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <TabsPanel value="all">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsPanel>

            <TabsPanel value="project">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsPanel>

            <TabsPanel value="workflow">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsPanel>

            <TabsPanel value="checklist">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsPanel>

            <TabsPanel value="sprint">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </TabsPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
