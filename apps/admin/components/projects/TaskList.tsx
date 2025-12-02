'use client';

/**
 * TaskList Component
 *
 * Container for task list with:
 * - Tab navigation (Active, Overdue, Planned, Done)
 * - Task count badges on each tab
 * - "My Tasks" section header followed by "All Tasks"
 * - Loading skeleton during fetch
 * - Empty state for no tasks
 *
 * Phase 5: Tasks stay in order, completed tasks move to separate "Completed" group below
 */

import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Clock, CalendarCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskListItem, { type TaskItem } from './TaskListItem';

type TabValue = 'active' | 'overdue' | 'planned' | 'done';

interface TaskListProps {
  /** All tasks to display */
  tasks: TaskItem[];
  /** Tasks assigned to current user (shown in "My Tasks" section) */
  myTasks?: TaskItem[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when task is updated */
  onTaskUpdate: (id: string, updates: Partial<TaskItem>) => void;
  /** Callback to navigate to task detail */
  onTaskNavigate?: (id: string) => void;
  /** Current active tab (controlled) */
  activeTab?: TabValue;
  /** Callback when tab changes */
  onTabChange?: (tab: TabValue) => void;
  /** Whether to show project badges */
  showProjects?: boolean;
  /** ID of the current/highlighted task */
  currentTaskId?: string;
  /** Keep completed tasks visible in active tab (grouped separately) */
  keepCompletedVisible?: boolean;
}

/**
 * Filter tasks by tab
 */
function filterTasksByTab(tasks: TaskItem[], tab: TabValue): TaskItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    const targetDate = task.target_date ? new Date(task.target_date) : null;
    const startDate = task.start_date ? new Date(task.start_date) : null;

    if (targetDate) targetDate.setHours(0, 0, 0, 0);
    if (startDate) startDate.setHours(0, 0, 0, 0);

    switch (tab) {
      case 'active':
        // Active: status in (todo, in_progress) AND NOT done AND NOT overdue
        return (
          ['todo', 'in_progress'].includes(task.status) &&
          !task.is_done &&
          (!targetDate || targetDate >= today)
        );
      case 'overdue':
        // Overdue: target_date < today AND NOT done
        return targetDate !== null && targetDate < today && !task.is_done;
      case 'planned':
        // Planned: status = planned OR start_date > today
        return (
          task.status === 'planned' ||
          (startDate !== null && startDate > today)
        );
      case 'done':
        // Done: is_done = true OR status in (done, completed)
        return task.is_done || ['done', 'completed'].includes(task.status);
      default:
        return true;
    }
  });
}

/**
 * Separate active and completed tasks (for keepCompletedVisible mode)
 */
function separateTasksByCompletion(tasks: TaskItem[]): { active: TaskItem[]; completed: TaskItem[] } {
  const active: TaskItem[] = [];
  const completed: TaskItem[] = [];

  tasks.forEach((task) => {
    if (task.is_done || ['done', 'completed'].includes(task.status)) {
      completed.push(task);
    } else {
      active.push(task);
    }
  });

  return { active, completed };
}

/**
 * Get tab counts for badges
 */
function getTabCounts(tasks: TaskItem[]): Record<TabValue, number> {
  return {
    active: filterTasksByTab(tasks, 'active').length,
    overdue: filterTasksByTab(tasks, 'overdue').length,
    planned: filterTasksByTab(tasks, 'planned').length,
    done: filterTasksByTab(tasks, 'done').length,
  };
}

/**
 * Loading skeleton for task list
 */
function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 bg-[#00111A]/50">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyState({ tab }: { tab: TabValue }) {
  const messages: Record<TabValue, { icon: React.ReactNode; title: string; description: string }> = {
    active: {
      icon: <CheckCircle2 className="w-12 h-12 text-primary/40" />,
      title: 'No active tasks',
      description: 'All caught up! Create a new task to get started.',
    },
    overdue: {
      icon: <AlertTriangle className="w-12 h-12 text-green-400/60" />,
      title: 'No overdue tasks',
      description: 'Great job staying on top of your deadlines!',
    },
    planned: {
      icon: <CalendarCheck className="w-12 h-12 text-primary/40" />,
      title: 'No planned tasks',
      description: 'No tasks scheduled for the future.',
    },
    done: {
      icon: <Clock className="w-12 h-12 text-primary/40" />,
      title: 'No completed tasks',
      description: 'Completed tasks will appear here.',
    },
  };

  const msg = messages[tab];

  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-4">{msg.icon}</div>
      <p className="text-lg text-white">{msg.title}</p>
      <p className="text-sm text-[#C4C8D4]/60 mt-1">{msg.description}</p>
    </div>
  );
}

/**
 * Completed tasks section
 */
function CompletedSection({
  tasks,
  onToggle,
  onNavigate,
  showProjects,
}: {
  tasks: TaskItem[];
  onToggle: (id: string, isDone: boolean) => void;
  onNavigate?: (id: string) => void;
  showProjects?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayTasks = isExpanded ? tasks : tasks.slice(0, 3);

  if (tasks.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[#C4C8D4] uppercase tracking-wide flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          Completed ({tasks.length})
        </h3>
        {tasks.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-primary hover:text-primary/80"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Show {tasks.length - 3} more
              </>
            )}
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {displayTasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            onToggleDone={onToggle}
            onNavigate={onNavigate}
            showProject={showProjects}
          />
        ))}
      </div>
    </div>
  );
}

export default function TaskList({
  tasks,
  myTasks,
  isLoading = false,
  onTaskUpdate,
  onTaskNavigate,
  activeTab: controlledTab,
  onTabChange,
  showProjects = true,
  currentTaskId,
  keepCompletedVisible = false,
}: TaskListProps) {
  const [internalTab, setInternalTab] = useState<TabValue>('active');

  // Support controlled and uncontrolled modes
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const setActiveTab = (tab: TabValue) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  // Calculate tab counts
  const allTasks = useMemo(() => [...(myTasks || []), ...tasks], [myTasks, tasks]);
  const tabCounts = useMemo(() => getTabCounts(allTasks), [allTasks]);

  // Filter and separate tasks for current tab
  const { filteredTasks, filteredMyTasks, completedTasks, completedMyTasks } = useMemo(() => {
    if (keepCompletedVisible && activeTab === 'active') {
      // In keepCompletedVisible mode, get all non-overdue, non-planned tasks
      const allActive = tasks.filter((t) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = t.target_date ? new Date(t.target_date) : null;
        if (targetDate) targetDate.setHours(0, 0, 0, 0);

        // Exclude overdue (will be in overdue tab) and planned
        const isOverdue = targetDate !== null && targetDate < today && !t.is_done;
        const isPlanned = t.status === 'planned';

        return !isOverdue && !isPlanned;
      });

      const allMyActive = myTasks?.filter((t) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = t.target_date ? new Date(t.target_date) : null;
        if (targetDate) targetDate.setHours(0, 0, 0, 0);

        const isOverdue = targetDate !== null && targetDate < today && !t.is_done;
        const isPlanned = t.status === 'planned';

        return !isOverdue && !isPlanned;
      }) || [];

      const separated = separateTasksByCompletion(allActive);
      const separatedMy = separateTasksByCompletion(allMyActive);

      return {
        filteredTasks: separated.active,
        filteredMyTasks: separatedMy.active,
        completedTasks: separated.completed,
        completedMyTasks: separatedMy.completed,
      };
    }

    // Standard filtering
    return {
      filteredTasks: filterTasksByTab(tasks, activeTab),
      filteredMyTasks: myTasks ? filterTasksByTab(myTasks, activeTab) : [],
      completedTasks: [],
      completedMyTasks: [],
    };
  }, [tasks, myTasks, activeTab, keepCompletedVisible]);

  // Handle task toggle
  const handleToggle = (id: string, isDone: boolean) => {
    onTaskUpdate(id, { is_done: isDone, status: isDone ? 'done' : 'todo' });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <TaskListSkeleton />
      </div>
    );
  }

  // Calculate updated tab counts for keepCompletedVisible mode
  const adjustedTabCounts = useMemo(() => {
    if (keepCompletedVisible) {
      return {
        ...tabCounts,
        active: tabCounts.active + tabCounts.done, // Include completed in active count
        done: 0, // Hide done tab when using keepCompletedVisible
      };
    }
    return tabCounts;
  }, [tabCounts, keepCompletedVisible]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="bg-[#00111A] border border-primary/20 p-1">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Active
            {adjustedTabCounts.active > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {adjustedTabCounts.active}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="overdue"
            className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
          >
            Overdue
            {tabCounts.overdue > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                {tabCounts.overdue}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="planned"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Planned
            {tabCounts.planned > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {tabCounts.planned}
              </Badge>
            )}
          </TabsTrigger>
          {!keepCompletedVisible && (
            <TabsTrigger
              value="done"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Done
              {tabCounts.done > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {tabCounts.done}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* My Tasks Section */}
          {filteredMyTasks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-[#C4C8D4] uppercase tracking-wide mb-3">
                My Tasks ({filteredMyTasks.length})
              </h3>
              <div className="space-y-2">
                {filteredMyTasks.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onToggleDone={handleToggle}
                    onNavigate={onTaskNavigate}
                    showProject={showProjects}
                    isHighlighted={task.id === currentTaskId}
                  />
                ))}
              </div>

              {/* Completed My Tasks */}
              {keepCompletedVisible && completedMyTasks.length > 0 && (
                <CompletedSection
                  tasks={completedMyTasks}
                  onToggle={handleToggle}
                  onNavigate={onTaskNavigate}
                  showProjects={showProjects}
                />
              )}
            </div>
          )}

          {/* All Tasks Section */}
          {filteredTasks.length > 0 ? (
            <div>
              {filteredMyTasks.length > 0 && (
                <h3 className="text-sm font-medium text-[#C4C8D4] uppercase tracking-wide mb-3">
                  All Tasks ({filteredTasks.length})
                </h3>
              )}
              <div className="space-y-2">
                {filteredTasks.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onToggleDone={handleToggle}
                    onNavigate={onTaskNavigate}
                    showProject={showProjects}
                    isHighlighted={task.id === currentTaskId}
                  />
                ))}
              </div>

              {/* Completed Tasks */}
              {keepCompletedVisible && completedTasks.length > 0 && (
                <CompletedSection
                  tasks={completedTasks}
                  onToggle={handleToggle}
                  onNavigate={onTaskNavigate}
                  showProjects={showProjects}
                />
              )}
            </div>
          ) : filteredMyTasks.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Export types for use in other components
export type { TabValue };
