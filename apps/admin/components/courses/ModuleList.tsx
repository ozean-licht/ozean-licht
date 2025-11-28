'use client';

import { ModuleWithLessons } from '@/types/content';
import {
  CossUIAccordion,
  CossUIAccordionItem,
  CossUIAccordionTrigger,
  CossUIAccordionPanel,
  CossUIBadge,
  CossUIEmptyRoot,
  CossUIEmptyIcon,
  CossUIEmptyTitle,
  CossUIEmptyDescription,
  CossUIEmptyAction,
  CossUIButton,
  CossUIFolderIcon,
} from '@shared/ui';
import { ChevronDown, BookOpen, Clock, Plus } from 'lucide-react';
import LessonList from './LessonList';

interface ModuleListProps {
  modules: ModuleWithLessons[];
}

export default function ModuleList({ modules }: ModuleListProps) {
  // Format duration as hours and minutes
  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return '0 min';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  if (modules.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-8">
        <CossUIEmptyRoot className="text-center">
          <CossUIEmptyIcon>
            <CossUIFolderIcon className="w-12 h-12 text-muted-foreground" />
          </CossUIEmptyIcon>
          <CossUIEmptyTitle>No modules yet</CossUIEmptyTitle>
          <CossUIEmptyDescription>
            Get started by creating the first module for this course.
            Modules are sections that contain lessons.
          </CossUIEmptyDescription>
          <CossUIEmptyAction>
            <CossUIButton disabled title="Coming in Phase 3">
              <Plus className="h-4 w-4 mr-2" />
              Add First Module
            </CossUIButton>
          </CossUIEmptyAction>
        </CossUIEmptyRoot>
      </div>
    );
  }

  return (
    <CossUIAccordion type="multiple" defaultValue={modules.map((m) => m.id)}>
      <div className="space-y-3">
        {modules.map((module, index) => (
          <CossUIAccordionItem
            key={module.id}
            value={module.id}
            className="border rounded-lg bg-card/50 overflow-hidden"
          >
            <CossUIAccordionTrigger className="px-4 py-3 hover:bg-accent/50 transition-colors [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Module Number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                  {index + 1}
                </div>

                {/* Module Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{module.title}</h3>
                    <CossUIBadge
                      variant={module.status === 'published' ? 'default' : 'secondary'}
                      className="capitalize text-xs"
                    >
                      {module.status}
                    </CossUIBadge>
                  </div>
                  {module.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {module.description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{module.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(module.totalDurationSeconds || 0)}</span>
                  </div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200" />
            </CossUIAccordionTrigger>

            <CossUIAccordionPanel className="border-t">
              <div className="p-4">
                <LessonList lessons={module.lessons || []} moduleId={module.id} />
              </div>
            </CossUIAccordionPanel>
          </CossUIAccordionItem>
        ))}
      </div>
    </CossUIAccordion>
  );
}
