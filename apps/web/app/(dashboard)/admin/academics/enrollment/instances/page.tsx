'use client';

import * as React from 'react';
import {
    BookOpen,
    Plus,
    Loader2,
    AlertTriangle,
    ArrowLeft,
    Pencil,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    coursesApi,
    semestersApi,
    batchesApi,
    courseInstancesApi,
} from '@/lib/api/academics';
import { handleApiError } from '@/lib/api/axios';
import { toast } from '@/lib/hooks/use-toast';
import { useAcademicsAccess } from '@/lib/hooks/useAcademicsAccess';
import { COURSE_INSTANCE_STATUSES } from '@/types/academics.types';
import type {
    Course,
    Semester,
    Batch,
    CourseInstance,
    CourseInstanceStatus,
    AcademicFormErrors,
} from '@/types/academics.types';

const STATUS_COLOR: Record<string, string> = {
    Planned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Completed: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export default function CourseInstancesPage() {
    const { canAccess, canWrite } = useAcademicsAccess();

    const [courses, setCourses] = React.useState<Course[]>([]);
    const [semesters, setSemesters] = React.useState<Semester[]>([]);
    const [batches, setBatches] = React.useState<Batch[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [instances, setInstances] = React.useState<CourseInstance[]>([]);
    const [selectedBatch, setSelectedBatch] = React.useState('');

    // Create dialog
    const [createOpen, setCreateOpen] = React.useState(false);
    const [createValues, setCreateValues] = React.useState({
        course_id: '',
        semester_id: '',
        batch_id: '',
        status: 'Planned' as CourseInstanceStatus,
        max_enrollment: 60,
    });
    const [createErrors, setCreateErrors] = React.useState<AcademicFormErrors>({});
    const [createSub, setCreateSub] = React.useState(false);

    // Edit dialog
    const [editOpen, setEditOpen] = React.useState(false);
    const [editTarget, setEditTarget] = React.useState<CourseInstance | null>(null);
    const [editValues, setEditValues] = React.useState({ status: '', max_enrollment: 0 });
    const [editSub, setEditSub] = React.useState(false);

    React.useEffect(() => {
        async function load() {
            try {
                const [c, s, b] = await Promise.all([
                    coursesApi.list(),
                    semestersApi.list(),
                    batchesApi.list(),
                ]);
                setCourses(c);
                setSemesters(s);
                setBatches(b);
            } catch (err) {
                toast.error('Failed to load reference data', handleApiError(err));
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    React.useEffect(() => {
        if (!selectedBatch) { setInstances([]); return; }
        batchesApi.getCourseInstances(selectedBatch)
            .then(setInstances)
            .catch((err) => toast.error('Failed to load instances', handleApiError(err)));
    }, [selectedBatch]);

    async function refreshInstances() {
        if (!selectedBatch) return;
        const list = await batchesApi.getCourseInstances(selectedBatch);
        setInstances(list);
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        const errs: AcademicFormErrors = {};
        if (!createValues.course_id) errs.course_id = 'Required';
        if (!createValues.semester_id) errs.semester_id = 'Required';
        if (!createValues.batch_id) errs.batch_id = 'Required';
        if (createValues.max_enrollment <= 0) errs.max_enrollment = 'Must be positive';
        if (Object.keys(errs).length > 0) { setCreateErrors(errs); return; }

        setCreateSub(true);
        try {
            await courseInstancesApi.create(createValues);
            toast.success('Course instance created');
            setCreateOpen(false);
            if (selectedBatch === createValues.batch_id) await refreshInstances();
        } catch (err) {
            toast.error('Failed to create', handleApiError(err));
        } finally {
            setCreateSub(false);
        }
    }

    function openEdit(ci: CourseInstance) {
        setEditTarget(ci);
        setEditValues({ status: ci.status, max_enrollment: ci.max_enrollment });
        setEditOpen(true);
    }

    async function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        setEditSub(true);
        try {
            await courseInstancesApi.update(editTarget.id, {
                status: editValues.status,
                max_enrollment: editValues.max_enrollment,
            });
            toast.success('Instance updated');
            setEditOpen(false);
            await refreshInstances();
        } catch (err) {
            toast.error('Failed to update', handleApiError(err));
        } finally {
            setEditSub(false);
        }
    }

    if (!canAccess) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
                <AlertTriangle className="h-10 w-10 mb-3" />
                <p>You don&apos;t have permission to view this page.</p>
            </div>
        );
    }

    const courseName = (id: string) => courses.find((c) => c.id === id)?.title ?? id.slice(0, 8);
    const courseCode = (id: string) => courses.find((c) => c.id === id)?.code ?? '';
    const semesterName = (id: string) => semesters.find((s) => s.id === id)?.name ?? id.slice(0, 8);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/admin/academics/enrollment">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Course Instances</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage course offerings per semester and group.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex-1 max-w-xs">
                            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a group…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {batches.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name} ({b.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {canWrite && (
                            <Button onClick={() => { setCreateValues({ ...createValues, batch_id: selectedBatch }); setCreateErrors({}); setCreateOpen(true); }} className="gap-2">
                                <Plus className="h-4 w-4" /> New Instance
                            </Button>
                        )}
                    </div>

                    {!selectedBatch && (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                            <BookOpen className="h-12 w-12 mb-3 opacity-40" />
                            <p className="text-sm">Select a group to view its course instances.</p>
                        </div>
                    )}

                    {selectedBatch && instances.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                            <BookOpen className="h-12 w-12 mb-3 opacity-40" />
                            <p className="text-sm">No course instances for this group yet.</p>
                        </div>
                    )}

                    {instances.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {instances.map((ci) => (
                                <Card key={ci.id} className="transition-all hover:shadow-md group">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {courseName(ci.course_id)}
                                                </h3>
                                                <p className="text-xs text-zinc-400 font-mono">
                                                    {courseCode(ci.course_id)}
                                                </p>
                                            </div>
                                            {canWrite && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => openEdit(ci)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-1 mb-2">
                                            {semesterName(ci.semester_id)}
                                        </p>
                                        <div className="flex gap-2 items-center">
                                            <Badge className={`text-xs border-0 ${STATUS_COLOR[ci.status] ?? ''}`}>
                                                {ci.status}
                                            </Badge>
                                            <span className="text-xs text-zinc-400">
                                                Max: {ci.max_enrollment}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Create dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-zinc-600" />
                            Create Course Instance
                        </DialogTitle>
                        <DialogDescription>
                            Assign a course to a semester and group.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Course</Label>
                            <Select value={createValues.course_id} onValueChange={(v) => setCreateValues((p) => ({ ...p, course_id: v }))}>
                                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.title} ({c.code})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {createErrors.course_id && <p className="text-xs text-red-600">{createErrors.course_id}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Semester</Label>
                                <Select value={createValues.semester_id} onValueChange={(v) => setCreateValues((p) => ({ ...p, semester_id: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {semesters.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {createErrors.semester_id && <p className="text-xs text-red-600">{createErrors.semester_id}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Group</Label>
                                <Select value={createValues.batch_id} onValueChange={(v) => setCreateValues((p) => ({ ...p, batch_id: v }))}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {batches.map((b) => (
                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {createErrors.batch_id && <p className="text-xs text-red-600">{createErrors.batch_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Status</Label>
                                <Select value={createValues.status} onValueChange={(v) => setCreateValues((p) => ({ ...p, status: v as CourseInstanceStatus }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {COURSE_INSTANCE_STATUSES.map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Max Enrollment</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={createValues.max_enrollment}
                                    onChange={(e) => setCreateValues((p) => ({ ...p, max_enrollment: parseInt(e.target.value, 10) || 0 }))}
                                />
                                {createErrors.max_enrollment && <p className="text-xs text-red-600">{createErrors.max_enrollment}</p>}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={createSub}>
                                {createSub ? 'Creating…' : 'Create Instance'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Update Instance</DialogTitle>
                        <DialogDescription>
                            {editTarget && `${courseName(editTarget.course_id)} — ${semesterName(editTarget.semester_id)}`}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Status</Label>
                            <Select value={editValues.status} onValueChange={(v) => setEditValues((p) => ({ ...p, status: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {COURSE_INSTANCE_STATUSES.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Max Enrollment</Label>
                            <Input
                                type="number"
                                min={1}
                                value={editValues.max_enrollment}
                                onChange={(e) => setEditValues((p) => ({ ...p, max_enrollment: parseInt(e.target.value, 10) || 0 }))}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={editSub}>
                                {editSub ? 'Saving…' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
