export type Result<T> = {
  data: T;
  type: string;
  error: string;
};

export type Teacher = {
  sub: string;
  role: 'teacher' | 'admin';
  email: string;
  phone: string;
  lastName: string;
  firstName: string;
  teacherId: string;
  department: string;
  middleName: string;
  email_verified: boolean;
  phone_verified: boolean;
};
