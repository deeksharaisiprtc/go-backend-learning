export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CreateUserRequest = Pick<User, 'name' | 'email'>;
export type UpdateUserRequest = Partial<Pick<User, 'name' | 'email'>>;
