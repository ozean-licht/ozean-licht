'use client';

/**
 * CourseVideoAssignment Component
 *
 * Allows assigning a video to a course and optionally a specific module within that course.
 * Features cascading dropdowns where selecting a course loads its modules.
 *
 * Features:
 * - Fetches courses from /api/courses
 * - Fetches modules from /api/courses/[id]/modules when course selected
 * - Prefills dropdowns if video is already assigned
 * - Loading states for async operations
 * - Clear/reset functionality
 * - Dark theme styling
 */

import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, X } from 'lucide-react';

// UI Components
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Types
import type { Course, Module } from '@/types/content';

// ================================================================
// Types & Interfaces
// ================================================================

interface CourseVideoAssignmentProps {
  videoId?: string; // For future use (e.g., filtering compatible courses)
  courseId?: string | null;
  moduleId?: string | null;
  onChange: (assignment: { courseId: string | null; moduleId: string | null }) => void;
  disabled?: boolean;
}

interface CoursesResponse {
  courses: Course[];
  total: number;
}

interface ModulesResponse {
  modules: Module[];
  total: number;
}

// ================================================================
// Component
// ================================================================

export default function CourseVideoAssignment({
  videoId: _videoId, // Reserved for future use
  courseId: initialCourseId = null,
  moduleId: initialModuleId = null,
  onChange,
  disabled = false,
}: CourseVideoAssignmentProps) {
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialCourseId);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(initialModuleId);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [modulesError, setModulesError] = useState<string | null>(null);

  // ================================================================
  // Data Fetching
  // ================================================================

  /**
   * Fetch all available courses
   */
  useEffect(() => {
    async function fetchCourses() {
      setIsLoadingCourses(true);
      setCoursesError(null);

      try {
        const response = await fetch('/api/courses?limit=1000&orderBy=title&orderDirection=asc');

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }

        const data: CoursesResponse = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCoursesError(error instanceof Error ? error.message : 'Failed to load courses');
      } finally {
        setIsLoadingCourses(false);
      }
    }

    fetchCourses();
  }, []);

  /**
   * Fetch modules when a course is selected
   */
  useEffect(() => {
    async function fetchModules() {
      if (!selectedCourseId) {
        setModules([]);
        return;
      }

      setIsLoadingModules(true);
      setModulesError(null);

      try {
        const response = await fetch(`/api/courses/${selectedCourseId}/modules`);

        if (!response.ok) {
          throw new Error(`Failed to fetch modules: ${response.statusText}`);
        }

        const data: ModulesResponse = await response.json();
        setModules(data.modules || []);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setModulesError(error instanceof Error ? error.message : 'Failed to load modules');
      } finally {
        setIsLoadingModules(false);
      }
    }

    fetchModules();
  }, [selectedCourseId]);

  // ================================================================
  // Event Handlers
  // ================================================================

  /**
   * Handle course selection change
   */
  const handleCourseChange = (courseId: string) => {
    // If selecting a different course, clear module selection
    if (courseId !== selectedCourseId) {
      setSelectedModuleId(null);
    }

    setSelectedCourseId(courseId);

    // Notify parent component
    onChange({
      courseId,
      moduleId: null, // Reset module when course changes
    });
  };

  /**
   * Handle module selection change
   */
  const handleModuleChange = (moduleId: string) => {
    setSelectedModuleId(moduleId);

    // Notify parent component
    onChange({
      courseId: selectedCourseId,
      moduleId,
    });
  };

  /**
   * Clear course assignment
   */
  const handleClearCourse = () => {
    setSelectedCourseId(null);
    setSelectedModuleId(null);
    setModules([]);

    // Notify parent component
    onChange({
      courseId: null,
      moduleId: null,
    });
  };

  /**
   * Clear module assignment (keep course)
   */
  const handleClearModule = () => {
    setSelectedModuleId(null);

    // Notify parent component
    onChange({
      courseId: selectedCourseId,
      moduleId: null,
    });
  };

  // ================================================================
  // Render Helpers
  // ================================================================

  const isDisabled = disabled || isLoadingCourses;

  // ================================================================
  // Render
  // ================================================================

  return (
    <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-card">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-white">Course Assignment</h3>
      </div>

      {/* Course Selection */}
      <div className="space-y-2">
        <Label htmlFor="course-select" className="text-sm text-white">
          Course
        </Label>

        <div className="flex gap-2">
          <div className="flex-1">
            {isLoadingCourses ? (
              <div className="h-9 flex items-center justify-center border border-primary/20 rounded-md bg-card/70 backdrop-blur-sm text-sm text-gray-400">
                Loading courses...
              </div>
            ) : coursesError ? (
              <div className="h-9 flex items-center justify-center border border-red-500/20 rounded-md bg-card/70 backdrop-blur-sm text-sm text-red-400">
                Error: {coursesError}
              </div>
            ) : (
              <Select
                value={selectedCourseId || undefined}
                onValueChange={handleCourseChange}
                disabled={isDisabled}
              >
                <SelectTrigger
                  id="course-select"
                  className="bg-card border-primary/20 text-white"
                >
                  <SelectValue placeholder="Select a course..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-gray-400">
                      No courses available
                    </div>
                  ) : (
                    courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                        {course.status !== 'published' && (
                          <span className="ml-2 text-xs text-gray-400">
                            ({course.status})
                          </span>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedCourseId && !isDisabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearCourse}
              className="shrink-0 h-9 w-9"
              title="Clear course selection"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-400">
          {selectedCourseId
            ? 'Assign this video to a specific course'
            : 'Optional: Associate video with a course'}
        </p>
      </div>

      {/* Module Selection (only shown when course is selected) */}
      {selectedCourseId && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <Label htmlFor="module-select" className="text-sm text-white">
              Module
            </Label>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              {isLoadingModules ? (
                <div className="h-9 flex items-center justify-center border border-primary/20 rounded-md bg-card/70 backdrop-blur-sm text-sm text-gray-400">
                  Loading modules...
                </div>
              ) : modulesError ? (
                <div className="h-9 flex items-center justify-center border border-red-500/20 rounded-md bg-card/70 backdrop-blur-sm text-sm text-red-400">
                  Error: {modulesError}
                </div>
              ) : (
                <Select
                  value={selectedModuleId || undefined}
                  onValueChange={handleModuleChange}
                  disabled={isDisabled || isLoadingModules}
                >
                  <SelectTrigger
                    id="module-select"
                    className="bg-card border-primary/20 text-white"
                  >
                    <SelectValue placeholder="Select a module..." />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-gray-400">
                        No modules available
                      </div>
                    ) : (
                      modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                          {module.status !== 'published' && (
                            <span className="ml-2 text-xs text-gray-400">
                              ({module.status})
                            </span>
                          )}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedModuleId && !isDisabled && !isLoadingModules && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClearModule}
                className="shrink-0 h-9 w-9"
                title="Clear module selection"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-400">
            {selectedModuleId
              ? 'Video will be assigned to this module'
              : 'Optional: Assign to a specific module within the course'}
          </p>
        </div>
      )}
    </div>
  );
}
