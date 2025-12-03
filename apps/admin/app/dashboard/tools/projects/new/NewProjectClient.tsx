'use client';

/**
 * New Project Client Component
 *
 * Multi-step form for creating a new project:
 * 1. Project Info: Title, description, type, dates
 * 2. Choose Template: Optional template selection
 * 3. Review & Create: Summary and create button
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FolderKanban,
  Layers,
  Calendar,
  FileText,
  Search,
  X,
} from 'lucide-react';
import type { DBProcessTemplate } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NewProjectClientProps {
  templates: DBProcessTemplate[];
  preselectedTemplateId?: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Project types
const PROJECT_TYPES = [
  'Kurs',
  'Post',
  'Blog',
  'Love Letter',
  'Video',
  'Short',
  'Kongress',
  'Interview',
  'Einzigartig',
];

// Interval types
const INTERVAL_TYPES = [
  { value: 'Einmalig', label: 'One-time' },
  { value: 'Fortlaufend', label: 'Recurring' },
];

// Step indicator
function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              i + 1 === step
                ? 'bg-primary text-white'
                : i + 1 < step
                  ? 'bg-green-500 text-white'
                  : 'bg-[#00111A] border border-primary/20 text-[#C4C8D4]'
            )}
          >
            {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={cn(
                'w-12 h-0.5 transition-colors',
                i + 1 < step ? 'bg-green-500' : 'bg-primary/20'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function NewProjectClient({
  templates,
  preselectedTemplateId,
  user: _user,
}: NewProjectClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_type: '',
    interval_type: 'Einmalig',
    start_date: '',
    target_date: '',
  });

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<DBProcessTemplate | null>(
    preselectedTemplateId
      ? templates.find((t) => t.id === preselectedTemplateId) || null
      : null
  );
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateTypeFilter, setTemplateTypeFilter] = useState<string | null>(null);

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      !templateSearch ||
      t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.description?.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesType = !templateTypeFilter || t.template_type === templateTypeFilter;
    return matchesSearch && matchesType;
  });

  // Get unique template types
  const templateTypes = [...new Set(templates.map((t) => t.template_type).filter(Boolean))];

  // Update form field
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate step
  const canProceed = () => {
    if (step === 1) {
      return formData.title.trim().length > 0;
    }
    return true;
  };

  // Create project
  const createProject = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          project_type: formData.project_type || null,
          interval_type: formData.interval_type,
          start_date: formData.start_date || null,
          target_date: formData.target_date || null,
          used_template: !!selectedTemplate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const { project } = await response.json();

      // Navigate to new project
      router.push(`/dashboard/tools/projects/${project.id}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/tools/projects')}
          className="text-[#C4C8D4] hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
        <h1 className="text-3xl font-decorative text-white">Create New Project</h1>
        <p className="text-[#C4C8D4] mt-2">
          {step === 1 && 'Start by entering basic project information'}
          {step === 2 && 'Optionally select a template to pre-populate tasks'}
          {step === 3 && 'Review and create your project'}
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator step={step} total={3} />

      {/* Step 1: Project Info */}
      {step === 1 && (
        <Card className="bg-card/70 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Project Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Enter project title..."
                className="bg-[#00111A] border-primary/20 text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the project..."
                className="bg-[#00111A] border-primary/20 text-white min-h-[100px]"
              />
            </div>

            {/* Type and Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Project Type</Label>
                <Select
                  value={formData.project_type}
                  onValueChange={(v) => updateField('project_type', v)}
                >
                  <SelectTrigger className="bg-[#00111A] border-primary/20 text-white">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/20">
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Interval</Label>
                <Select
                  value={formData.interval_type}
                  onValueChange={(v) => updateField('interval_type', v)}
                >
                  <SelectTrigger className="bg-[#00111A] border-primary/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/20">
                    {INTERVAL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-white">
                  Start Date
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => updateField('start_date', e.target.value)}
                  className="bg-[#00111A] border-primary/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_date" className="text-white">
                  Target Date
                </Label>
                <Input
                  id="target_date"
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => updateField('target_date', e.target.value)}
                  className="bg-[#00111A] border-primary/20 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Template Selection */}
      {step === 2 && (
        <Card className="bg-card/70 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Choose Template (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4C8D4]" />
                <Input
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="pl-10 bg-[#00111A] border-primary/20 text-white"
                />
              </div>
              <Select
                value={templateTypeFilter || 'all'}
                onValueChange={(v) => setTemplateTypeFilter(v === 'all' ? null : v)}
              >
                <SelectTrigger className="w-40 bg-[#00111A] border-primary/20 text-white">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  <SelectItem value="all">All types</SelectItem>
                  {templateTypes.map((type) => (
                    <SelectItem key={type} value={type!}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected template preview */}
            {selectedTemplate && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-primary font-medium mb-1">Selected Template</p>
                    <p className="text-white font-medium">{selectedTemplate.name}</p>
                    {selectedTemplate.description && (
                      <p className="text-sm text-[#C4C8D4] mt-1">{selectedTemplate.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                    className="text-[#C4C8D4] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Template grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
              {/* Start from scratch option */}
              <button
                onClick={() => setSelectedTemplate(null)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  !selectedTemplate
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-[#00111A]/50 border-primary/10 hover:border-primary/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FolderKanban className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Start from Scratch</p>
                    <p className="text-sm text-[#C4C8D4]">Create an empty project</p>
                  </div>
                </div>
              </button>

              {/* Template cards */}
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all',
                    selectedTemplate?.id === template.id
                      ? 'bg-primary/10 border-primary/40'
                      : 'bg-[#00111A]/50 border-primary/10 hover:border-primary/30'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-white line-clamp-1">{template.name}</p>
                    {template.template_type && (
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        {template.template_type}
                      </Badge>
                    )}
                  </div>
                  {template.description && (
                    <p className="text-sm text-[#C4C8D4] line-clamp-2">{template.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-[#C4C8D4]">
                    {template.duration_days && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {template.duration_days} days
                      </span>
                    )}
                    <span>Used {template.usage_count} times</span>
                  </div>
                </button>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <p className="text-center text-[#C4C8D4] py-8">
                No templates found matching your search.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <Card className="bg-card/70 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              Review & Create
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project summary */}
            <div className="p-4 rounded-xl bg-[#00111A]/50 border border-primary/10 space-y-4">
              <div>
                <p className="text-xs text-[#C4C8D4] uppercase mb-1">Title</p>
                <p className="text-lg text-white font-medium">{formData.title}</p>
              </div>

              {formData.description && (
                <div>
                  <p className="text-xs text-[#C4C8D4] uppercase mb-1">Description</p>
                  <p className="text-sm text-[#C4C8D4]">{formData.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.project_type && (
                  <div>
                    <p className="text-xs text-[#C4C8D4] uppercase mb-1">Type</p>
                    <p className="text-sm text-white">{formData.project_type}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#C4C8D4] uppercase mb-1">Interval</p>
                  <p className="text-sm text-white">
                    {INTERVAL_TYPES.find((t) => t.value === formData.interval_type)?.label}
                  </p>
                </div>
                {formData.start_date && (
                  <div>
                    <p className="text-xs text-[#C4C8D4] uppercase mb-1">Start</p>
                    <p className="text-sm text-white">{formData.start_date}</p>
                  </div>
                )}
                {formData.target_date && (
                  <div>
                    <p className="text-xs text-[#C4C8D4] uppercase mb-1">Target</p>
                    <p className="text-sm text-white">{formData.target_date}</p>
                  </div>
                )}
              </div>

              {selectedTemplate && (
                <div>
                  <p className="text-xs text-[#C4C8D4] uppercase mb-1">Template</p>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Layers className="w-3 h-3 mr-1" />
                    {selectedTemplate.name}
                  </Badge>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="border-primary/30 text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={createProject}
            disabled={isCreating}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isCreating ? (
              <>Creating...</>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Create Project
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
