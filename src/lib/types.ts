export type Result<T> = {
  data: T;
  type: string;
  error: string;
};

export type UserMetaData = {
  role: string;
  email: string;
  phone: string;
  lastname: string;
  firstname: string;
  department_id: number;
  middlename: string;
  teacher_id: string;
};
