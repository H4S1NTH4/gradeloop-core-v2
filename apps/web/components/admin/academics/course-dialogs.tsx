'use client';

/**
 * Course dialogs: Create + Edit
 */
import * as React from 'react';
import { BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { coursesApi } from '@/lib/api/academics';
import { handleApiError } from '@/lib/api/axios';
import { toast } from '@/lib/hooks/use-toast';
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  AcademicFormErrors,
} from '@/types/academics.types';

// ── Create ────────────────────────────────────────────────────────────────────

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (course: Course) => void;
}

const EMPTY: CreateCourseRequest = {
  code: '',
  title: '',
  description: '',
  credits: 3,
};

function validateCreate(v: CreateCourseRequest): AcademicFormErrors {
  const e: AcademicFormErrors = {};
  if (!v.code.trim()) e.code = 'Course code is required';
  if (!v.title.trim()) e.title = 'Title is required';
  if (v.credits <= 0) e.credits = 'Credits must be a positive number';
  return e;
}

export function CreateCourseDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCourseDialogProps) {
  const [values, setValues] = React.useState<CreateCourseRequest>(EMPTY);
  const [errors, setErrors] = React.useState<AcademicFormErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) { setValues(EMPTY); setErrors({}); }
  }, [open]);

  function set(field: keyof CreateCourseRequest, value: string | number) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateCreate(values);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const course = await coursesApi.create(values);
      toast.success('Course created', course.title);
      onOpenChange(false);
      onSuccess(course);
    } catch (err) {
      toast.error('Failed to create course', handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-zinc-600" />
            Create Course
          </DialogTitle>
          <DialogDescription>
            Add a new course to the catalogue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="course_code">Code</Label>
              <Input
                id="course_code"
                placeholder="CS101"
                value={values.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
              />
              {errors.code && <p className="text-xs text-red-600">{errors.code}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="course_credits">Credits</Label>
              <Input
                id="course_credits"
                type="number"
                min={1}
                max={12}
                value={values.credits}
                onChange={(e) => set('credits', parseInt(e.target.value, 10) || 0)}
              />
              {errors.credits && <p className="text-xs text-red-600">{errors.credits}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="course_title">Title</Label>
            <Input
              id="course_title"
              placeholder="Introduction to Computer Science"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
            />
            {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="course_desc">Description <span className="text-zinc-400">(optional)</span></Label>
            <Input
              id="course_desc"
              placeholder="Brief course overview"
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit ──────────────────────────────────────────────────────────────────────

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onSuccess: (course: Course) => void;
}

function validateEdit(v: UpdateCourseRequest): AcademicFormErrors {
  const e: AcademicFormErrors = {};
  if (v.credits !== undefined && v.credits <= 0) e.credits = 'Must be a positive number';
  return e;
}

export function EditCourseDialog({
  open,
  onOpenChange,
  course,
  onSuccess,
}: EditCourseDialogProps) {
  const [values, setValues] = React.useState<UpdateCourseRequest>({});
  const [errors, setErrors] = React.useState<AcademicFormErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setValues({ title: course.title, description: course.description, credits: course.credits });
      setErrors({});
    }
  }, [open, course]);

  function set(field: keyof UpdateCourseRequest, value: string | number) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateEdit(values);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const updated = await coursesApi.update(course.id, values);
      toast.success('Course updated', updated.title);
      onOpenChange(false);
      onSuccess(updated);
    } catch (err) {
      toast.error('Failed to update course', handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-zinc-600" />
            Edit Course
          </DialogTitle>
          <DialogDescription>
            Update details for <strong>{course.title}</strong>.
            <br />
            <span className="text-xs font-mono text-zinc-400">{course.code}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit_course_title">Title</Label>
              <Input
                id="edit_course_title"
                value={values.title ?? ''}
                onChange={(e) => set('title', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit_course_credits">Credits</Label>
              <Input
                id="edit_course_credits"
                type="number"
                min={1}
                max={12}
                value={values.credits ?? course.credits}
                onChange={(e) => set('credits', parseInt(e.target.value, 10) || 0)}
              />
              {errors.credits && <p className="text-xs text-red-600">{errors.credits}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit_course_desc">Description</Label>
            <Input
              id="edit_course_desc"
              value={values.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
