export const ROUTES = {
  // Public routes
  HOME: '/',
  BLOG: '/blog',
  CONTACT: '/contact',
  
  // Auth routes
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  
  // CRM routes
  DASHBOARD: '/crm/dashboard',
  
  // Student routes
  STUDENT_SCHEDULE: '/crm/student/schedule',
  STUDENT_REQUESTS: '/crm/student/requests',
  STUDENT_HOMEWORK: '/crm/student/homework',
  STUDENT_PAYMENTS: '/crm/student/payments',
  STUDENT_SETTINGS: '/crm/student/settings',
  
  // Teacher routes
  TEACHER_CLASSES: '/crm/teacher/classes',
  TEACHER_STUDENTS: '/crm/teacher/students',
  TEACHER_REQUESTS: '/crm/teacher/requests',
  TEACHER_HOMEWORK: '/crm/teacher/homework',
  TEACHER_PAYMENTS: '/crm/teacher/payments',
  TEACHER_MESSAGES: '/crm/teacher/messages',
  TEACHER_SETTINGS: '/crm/teacher/settings',
} as const
