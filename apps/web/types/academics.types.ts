/**
 * Academics service — TypeScript types.
 *
 * These types mirror the backend Go DTOs exactly.
 * Source of truth: apps/services/academic-service/internal/dto/
 */

// ─── Enums ───────────────────────────────────────────────────────────────────

export const DEGREE_LEVELS = [
  'Undergraduate',
  'Postgraduate',
  'Doctoral',
  'Diploma',
  'Certificate',
] as const;

export type DegreeLevel = (typeof DEGREE_LEVELS)[number];

// ─── Entity types (match DepartmentResponse, DegreeResponse, etc.) ───────────

export interface Faculty {
  id: string;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  leaders?: FacultyLeadership[];
}

export interface FacultyLeadership {
  faculty_id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  faculty_id: string;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Degree {
  id: string;
  department_id: string;
  name: string;
  code: string;
  level: DegreeLevel;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Specialization {
  id: string;
  degree_id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface CreateLeadershipRequest {
  /** UUID of an employee user */
  user_id: string;
  /** e.g. "Dean", "Associate Dean" */
  role: string;
}

export interface CreateFacultyRequest {
  name: string;
  code: string;
  description?: string;
  /** Required by backend — min 1 leader (validate:"required,min=1,dive") */
  leaders: CreateLeadershipRequest[];
}

export interface UpdateFacultyRequest {
  name?: string;
  code?: string;
  description?: string;
  is_active?: boolean;
  /** Optional on update */
  leaders?: CreateLeadershipRequest[];
}

export interface CreateDepartmentRequest {
  faculty_id: string;
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateDegreeRequest {
  department_id: string;
  name: string;
  code: string;
  /** oneof: Undergraduate Postgraduate Doctoral Diploma Certificate */
  level: DegreeLevel;
}

export interface UpdateDegreeRequest {
  name?: string;
  code?: string;
  level?: DegreeLevel;
  is_active?: boolean;
}

export interface CreateCourseRequest {
  code: string;
  title: string;
  description?: string;
  credits: number;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  credits?: number;
  is_active?: boolean;
}

// ─── API list-response wrappers ───────────────────────────────────────────────

export interface FacultyListResponse {
  faculties: Faculty[];
  count: number;
}

export interface DepartmentListResponse {
  departments: Department[];
  count: number;
}

export interface DegreeListResponse {
  degrees: Degree[];
  count: number;
}

export interface CourseListResponse {
  courses: Course[];
  count: number;
}

// ─── Form validation helpers ──────────────────────────────────────────────────

export interface AcademicFormErrors {
  [field: string]: string | undefined;
}
