'use client';

/**
 * Process Templates Widget Component
 *
 * Displays available process templates that can be used to create new projects.
 * Templates define standard workflows, tasks, and milestones.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Plus,
  Clock,
  CheckSquare,
  Layers,
  ArrowRight,
  Sparkles,
  Briefcase,
  GraduationCap,
  Code,
  Megaphone,
  Settings,
} from 'lucide-react';

// Template categories
type TemplateCategory = 'course' | 'marketing' | 'development' | 'operations' | 'onboarding';

export interface ProcessTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  taskCount: number;
  estimatedDuration: string;
  milestones: number;
  usageCount: number;
  isPopular?: boolean;
  isNew?: boolean;
}

interface ProcessTemplatesWidgetProps {
  /** Maximum number of templates to display */
  maxTemplates?: number;
  /** Callback when template is clicked */
  onTemplateClick?: (templateId: string) => void;
  /** Callback when "Create from Template" is clicked */
  onCreateFromTemplate?: (templateId: string) => void;
  /** Callback when "View All Templates" is clicked */
  onViewAll?: () => void;
}

// Mock data for demonstration
const mockTemplates: ProcessTemplate[] = [
  {
    id: '1',
    name: 'Course Launch Workflow',
    description: 'Complete workflow for launching a new course including content review, marketing, and deployment.',
    category: 'course',
    taskCount: 24,
    estimatedDuration: '4 weeks',
    milestones: 5,
    usageCount: 12,
    isPopular: true,
  },
  {
    id: '2',
    name: 'Marketing Campaign',
    description: 'Standard marketing campaign process from planning to execution and analysis.',
    category: 'marketing',
    taskCount: 18,
    estimatedDuration: '2 weeks',
    milestones: 4,
    usageCount: 8,
  },
  {
    id: '3',
    name: 'Feature Development',
    description: 'Software development workflow including planning, implementation, testing, and deployment.',
    category: 'development',
    taskCount: 32,
    estimatedDuration: '3 weeks',
    milestones: 6,
    usageCount: 15,
    isPopular: true,
  },
  {
    id: '4',
    name: 'Team Onboarding',
    description: 'New team member onboarding checklist and training workflow.',
    category: 'onboarding',
    taskCount: 16,
    estimatedDuration: '1 week',
    milestones: 3,
    usageCount: 6,
    isNew: true,
  },
  {
    id: '5',
    name: 'Monthly Operations Review',
    description: 'Recurring template for monthly operational reviews and reporting.',
    category: 'operations',
    taskCount: 12,
    estimatedDuration: '3 days',
    milestones: 2,
    usageCount: 24,
  },
];

/**
 * Get category icon and color
 */
const getCategoryConfig = (category: TemplateCategory): { icon: React.ReactNode; bgColor: string; borderColor: string } => {
  switch (category) {
    case 'course':
      return {
        icon: <GraduationCap className="w-4 h-4" />,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
      };
    case 'marketing':
      return {
        icon: <Megaphone className="w-4 h-4" />,
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
      };
    case 'development':
      return {
        icon: <Code className="w-4 h-4" />,
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
      };
    case 'operations':
      return {
        icon: <Settings className="w-4 h-4" />,
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
      };
    case 'onboarding':
      return {
        icon: <Briefcase className="w-4 h-4" />,
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/20',
      };
    default:
      return {
        icon: <FileText className="w-4 h-4" />,
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20',
      };
  }
};

export default function ProcessTemplatesWidget({
  maxTemplates = 4,
  onTemplateClick,
  onCreateFromTemplate,
  onViewAll,
}: ProcessTemplatesWidgetProps) {
  const displayTemplates = mockTemplates.slice(0, maxTemplates);
  const totalTemplates = mockTemplates.length;

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#C4C8D4]">
          {totalTemplates} templates available
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80 hover:bg-primary/10"
          onClick={onViewAll}
        >
          Browse All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div>
        <div className="space-y-3">
          {displayTemplates.map((template) => {
            const categoryConfig = getCategoryConfig(template.category);
            return (
              <div
                key={template.id}
                className="group p-4 rounded-xl border transition-all duration-200 cursor-pointer
                  bg-[#00111A]/50 border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                onClick={() => onTemplateClick?.(template.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Category icon */}
                  <div className={`p-2 rounded-lg ${categoryConfig.bgColor} border ${categoryConfig.borderColor} text-primary`}>
                    {categoryConfig.icon}
                  </div>

                  {/* Template content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-sans font-medium text-white">
                          {template.name}
                        </h4>
                        {template.isPopular && (
                          <Badge variant="default" className="text-xs bg-primary/20 text-primary border-primary/30">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {template.isNew && (
                          <Badge variant="success" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-white hover:bg-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateFromTemplate?.(template.id);
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Use
                      </Button>
                    </div>

                    <p className="text-xs text-[#C4C8D4] mt-1 line-clamp-1">
                      {template.description}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-[#C4C8D4]">
                      <div className="flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-primary" />
                        {template.taskCount} tasks
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" />
                        {template.estimatedDuration}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-primary" />
                        {template.milestones} milestones
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {displayTemplates.length === 0 && (
            <div className="text-center py-8">
              <Layers className="w-12 h-12 text-primary/40 mx-auto mb-3" />
              <p className="text-[#C4C8D4]">No templates available</p>
              <p className="text-sm text-[#C4C8D4]/60 mt-1">
                Create your first process template
              </p>
            </div>
          )}
        </div>

        {/* Create new template button */}
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
          onClick={() => onViewAll?.()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </Button>
      </div>
    </div>
  );
}
