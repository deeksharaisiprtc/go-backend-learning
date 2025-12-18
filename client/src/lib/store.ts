import { create } from 'zustand';
import { User, CreateUserRequest, UpdateUserRequest } from './types';
import { formatISO } from 'date-fns';

interface UserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  // Mock API Actions
  fetchUsers: () => void;
  fetchUserById: (id: number) => User | undefined;
  createUser: (data: CreateUserRequest) => void;
  updateUser: (id: number, data: UpdateUserRequest) => void;
  deleteUser: (id: number) => void; // Soft delete
  restoreUser: (id: number) => void; // For demo purposes
}

// Initial Mock Data
const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    created_at: "2023-10-15T10:00:00Z",
    updated_at: "2023-10-15T10:00:00Z",
    deleted_at: null
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    created_at: "2023-11-20T14:30:00Z",
    updated_at: "2023-11-20T14:30:00Z",
    deleted_at: null
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    created_at: "2023-12-01T09:15:00Z",
    updated_at: "2023-12-05T11:20:00Z",
    deleted_at: "2023-12-10T16:45:00Z" // Soft deleted initially for demo
  }
];

export const useUserStore = create<UserStore>((set, get) => ({
  users: INITIAL_USERS,
  isLoading: false,
  error: null,

  fetchUsers: () => {
    set({ isLoading: true });
    // Simulate network delay
    setTimeout(() => {
      set({ isLoading: false });
    }, 500);
  },

  fetchUserById: (id: number) => {
    return get().users.find(u => u.id === id);
  },

  createUser: (data: CreateUserRequest) => {
    set({ isLoading: true });
    setTimeout(() => {
      set(state => {
        const newUser: User = {
          id: Math.max(0, ...state.users.map(u => u.id)) + 1,
          name: data.name,
          email: data.email,
          created_at: formatISO(new Date()),
          updated_at: formatISO(new Date()),
          deleted_at: null
        };
        return { users: [...state.users, newUser], isLoading: false };
      });
    }, 500);
  },

  updateUser: (id: number, data: UpdateUserRequest) => {
    set({ isLoading: true });
    setTimeout(() => {
      set(state => ({
        users: state.users.map(u => 
          u.id === id 
            ? { ...u, ...data, updated_at: formatISO(new Date()) } 
            : u
        ),
        isLoading: false
      }));
    }, 500);
  },

  deleteUser: (id: number) => {
    set({ isLoading: true });
    setTimeout(() => {
      set(state => ({
        users: state.users.map(u => 
          u.id === id 
            ? { ...u, deleted_at: formatISO(new Date()) } 
            : u
        ),
        isLoading: false
      }));
    }, 500);
  },

  restoreUser: (id: number) => {
    set({ isLoading: true });
    setTimeout(() => {
      set(state => ({
        users: state.users.map(u => 
          u.id === id 
            ? { ...u, deleted_at: null, updated_at: formatISO(new Date()) } 
            : u
        ),
        isLoading: false
      }));
    }, 500);
  }
}));
