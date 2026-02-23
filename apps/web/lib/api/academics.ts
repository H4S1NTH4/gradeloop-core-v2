/**
 * Academics service API client.
 *
 * All list endpoints return a wrapped object, e.g.
 *   GET /departments → { departments: [...], count: N }
 * Single-entity endpoints (GET/:id, POST, PUT) return the entity directly.
 *
 * Gateway coverage (Traefik):
 *   ✅ /api/v1/faculties
 *   ✅ /api/v1/departments
 *   ✅ /api/v1/degrees
 *   ✅ /api/v1/courses      (added in gateway fix)
 */
import { axiosInstance } from './axios';
import type {
  Faculty,
  Department,
  Degree,
  Course,
  CreateFacultyRequest,
  UpdateFacultyRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  CreateDegreeRequest,
  UpdateDegreeRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '@/types/academics.types';

// ── Faculties (super_admin only on list/create) ───────────────────────────────

export const facultiesApi = {
  /**
   * GET /faculties — requires super_admin.
   * Will throw a 403 if called by a plain admin; callers should handle gracefully.
   */
  list: async (includeInactive = false): Promise<Faculty[]> => {
    const params: Record<string, unknown> = {};
    if (includeInactive) params.include_inactive = true;
    const { data } = await axiosInstance.get('/faculties', { params });
    // Response: { faculties: [...], count: N }
    if (Array.isArray(data)) return data as Faculty[];
    if (Array.isArray(data?.faculties)) return data.faculties as Faculty[];
    return [];
  },

  get: async (id: string): Promise<Faculty> => {
    const { data } = await axiosInstance.get<Faculty>(`/faculties/${id}`);
    return data;
  },

  create: async (req: CreateFacultyRequest): Promise<Faculty> => {
    const { data } = await axiosInstance.post<Faculty>('/faculties', req);
    return data;
  },

  update: async (id: string, req: UpdateFacultyRequest): Promise<Faculty> => {
    const { data } = await axiosInstance.put<Faculty>(`/faculties/${id}`, req);
    return data;
  },

  /** PATCH /faculties/:id/deactivate */
  deactivate: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/faculties/${id}/deactivate`);
  },

  /** Reactivate via PUT with is_active: true */
  reactivate: async (id: string): Promise<Faculty> => {
    const { data } = await axiosInstance.put<Faculty>(`/faculties/${id}`, {
      is_active: true,
    });
    return data;
  },
};

// ── Departments ───────────────────────────────────────────────────────────────

export const departmentsApi = {
  list: async (includeInactive = false): Promise<Department[]> => {
    const params: Record<string, unknown> = {};
    if (includeInactive) params.include_inactive = true;
    const { data } = await axiosInstance.get('/departments', { params });
    // Response: { departments: [...], count: N }
    if (Array.isArray(data)) return data as Department[];
    if (Array.isArray(data?.departments)) return data.departments as Department[];
    return [];
  },

  get: async (id: string): Promise<Department> => {
    const { data } = await axiosInstance.get<Department>(`/departments/${id}`);
    return data;
  },

  create: async (req: CreateDepartmentRequest): Promise<Department> => {
    const { data } = await axiosInstance.post<Department>('/departments', req);
    return data;
  },

  update: async (id: string, req: UpdateDepartmentRequest): Promise<Department> => {
    const { data } = await axiosInstance.put<Department>(`/departments/${id}`, req);
    return data;
  },

  /** PATCH /departments/:id/deactivate — sets is_active = false */
  deactivate: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/departments/${id}/deactivate`);
  },

  /** Reactivate via PUT with is_active: true */
  reactivate: async (id: string): Promise<Department> => {
    const { data } = await axiosInstance.put<Department>(`/departments/${id}`, {
      is_active: true,
    });
    return data;
  },

  listByFaculty: async (facultyId: string): Promise<Department[]> => {
    const { data } = await axiosInstance.get(
      `/faculties/${facultyId}/departments`,
    );
    if (Array.isArray(data)) return data as Department[];
    if (Array.isArray(data?.departments)) return data.departments as Department[];
    return [];
  },
};

// ── Degrees ───────────────────────────────────────────────────────────────────

export const degreesApi = {
  list: async (includeInactive = false): Promise<Degree[]> => {
    const params: Record<string, unknown> = {};
    if (includeInactive) params.include_inactive = true;
    const { data } = await axiosInstance.get('/degrees', { params });
    // Response: { degrees: [...], count: N }
    if (Array.isArray(data)) return data as Degree[];
    if (Array.isArray(data?.degrees)) return data.degrees as Degree[];
    return [];
  },

  get: async (id: string): Promise<Degree> => {
    const { data } = await axiosInstance.get<Degree>(`/degrees/${id}`);
    return data;
  },

  create: async (req: CreateDegreeRequest): Promise<Degree> => {
    const { data } = await axiosInstance.post<Degree>('/degrees', req);
    return data;
  },

  update: async (id: string, req: UpdateDegreeRequest): Promise<Degree> => {
    const { data } = await axiosInstance.put<Degree>(`/degrees/${id}`, req);
    return data;
  },

  deactivate: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/degrees/${id}/deactivate`);
  },

  reactivate: async (id: string): Promise<Degree> => {
    const { data } = await axiosInstance.put<Degree>(`/degrees/${id}`, {
      is_active: true,
    });
    return data;
  },

  listByDepartment: async (departmentId: string): Promise<Degree[]> => {
    const { data } = await axiosInstance.get(
      `/departments/${departmentId}/degrees`,
    );
    if (Array.isArray(data)) return data as Degree[];
    if (Array.isArray(data?.degrees)) return data.degrees as Degree[];
    return [];
  },
};

// ── Courses ───────────────────────────────────────────────────────────────────

export const coursesApi = {
  list: async (includeInactive = false): Promise<Course[]> => {
    const params: Record<string, unknown> = {};
    if (includeInactive) params.include_inactive = true;
    const { data } = await axiosInstance.get('/courses', { params });
    // Response: { courses: [...], count: N }
    if (Array.isArray(data)) return data as Course[];
    if (Array.isArray(data?.courses)) return data.courses as Course[];
    return [];
  },

  get: async (id: string): Promise<Course> => {
    const { data } = await axiosInstance.get<Course>(`/courses/${id}`);
    return data;
  },

  create: async (req: CreateCourseRequest): Promise<Course> => {
    const { data } = await axiosInstance.post<Course>('/courses', req);
    return data;
  },

  update: async (id: string, req: UpdateCourseRequest): Promise<Course> => {
    const { data } = await axiosInstance.put<Course>(`/courses/${id}`, req);
    return data;
  },

  deactivate: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/courses/${id}/deactivate`);
  },

  reactivate: async (id: string): Promise<Course> => {
    const { data } = await axiosInstance.put<Course>(`/courses/${id}`, {
      is_active: true,
    });
    return data;
  },
};
