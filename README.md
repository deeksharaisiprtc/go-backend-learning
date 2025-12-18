# User Management System - Frontend

A modern React dashboard for User CRUD operations with soft-delete functionality. This is a learning project built with React, TypeScript, and Tailwind CSS.

## Project Overview

This frontend application provides a complete User Management interface that simulates REST API operations. It demonstrates:
- **Create User** (POST)
- **Read Users** (GET all & GET by ID)
- **Update User** (PUT)
- **Soft Delete User** (DELETE with `deleted_at` timestamp)
- Soft delete reversal (Restore)

## Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Routing**: Wouter
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Shadcn/UI + Radix UI
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Date Handling**: date-fns

## Project Structure

```
.
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn/UI components
│   │   │   └── layout.tsx       # Sidebar & navigation layout
│   │   ├── lib/
│   │   │   ├── store.ts         # Zustand store (mock API)
│   │   │   ├── types.ts         # User types & interfaces
│   │   │   ├── queryClient.ts   # React Query setup
│   │   │   └── utils.ts         # Utility functions
│   │   ├── pages/
│   │   │   ├── users.tsx        # User management page
│   │   │   └── not-found.tsx    # 404 page
│   │   ├── hooks/
│   │   │   └── use-toast.ts     # Toast notifications
│   │   ├── App.tsx              # Main app component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html               # HTML template
│   └── public/
├── server/                      # Backend (not in scope for this mockup)
├── shared/                      # Shared types
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- npm (included with Node.js)

### Installation

1. **Clone or navigate to the project**:
```bash
cd path/to/project
```

2. **Install dependencies**:
```bash
npm install
```

### Running the Application

**Development mode** (with hot reload):
```bash
npm run dev:client
```

The application will start on **http://localhost:5000**

### Other Commands

- **Type checking**: `npm run check`
- **Build for production**: `npm run build`
- **Start production build**: `npm start`

## Features

### User Management Dashboard

#### View Users
- Table displaying all active users
- Shows user ID, name, email, status, created date, and deleted date
- Search functionality to filter users by name or email
- Status badges (Active/Deleted)

#### Create User
- Modal form to add new users
- Form validation:
  - Name: minimum 2 characters
  - Email: valid email format
- Toast notification on success

#### Update User
- Click the pencil icon to edit user details
- Same validation rules as create
- Updated timestamp is automatically set
- Toast notification on success

#### Soft Delete User
- Click the trash icon to soft delete
- Confirmation dialog prevents accidental deletion
- User is marked with `deleted_at` timestamp
- Deleted users appear with strikethrough text
- Can be restored later

#### Restore User
- Show Deleted Users toggle to view soft-deleted users
- Restore button appears for deleted users
- Removes the `deleted_at` timestamp
- User returns to active status

#### Statistics
- **Total Users**: Count of all users (active + deleted)
- **Active Users**: Count of non-deleted users
- **Soft Deleted**: Count of users with `deleted_at` set

## Mock Data Structure

Each user has the following fields:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;       // ISO 8601 format
  updated_at: string;       // ISO 8601 format
  deleted_at: string | null; // ISO 8601 format or null (soft delete indicator)
}
```

### Initial Mock Users
1. **Alice Johnson** - alice@example.com (Active)
2. **Bob Smith** - bob@example.com (Active)
3. **Charlie Brown** - charlie@example.com (Soft Deleted - for demo)

## Understanding Soft Delete

This application implements the **soft delete** concept:
- Records are **never physically removed** from the database
- A `deleted_at` timestamp is set to mark the record as deleted
- Fetch APIs exclude soft-deleted users by default
- The delete action can be reversed by clearing the `deleted_at` field

This is production-standard practice for maintaining data integrity and audit trails.

## State Management

Uses **Zustand** for lightweight state management. The store (`client/src/lib/store.ts`) provides:
- User list state
- Loading state
- Error state
- CRUD methods: `fetchUsers`, `createUser`, `updateUser`, `deleteUser`, `restoreUser`

Currently uses in-memory storage (mock data). Will be replaced with API calls to your backend.

## Connecting to Your Golang Backend

Once you build your Golang backend with Echo and GORM:

1. **Replace the store methods** with API calls:
```typescript
// Example (not implemented yet)
createUser: async (data) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
}
```

2. **Update the API endpoint** in your Vite config or environment variables

3. **The UI is already structured** for production use - no major refactoring needed!

## Learning Outcomes

This project teaches you:
- ✅ React fundamentals (components, hooks, state)
- ✅ TypeScript for type safety
- ✅ Form handling with validation
- ✅ REST API concepts (CRUD operations)
- ✅ Soft delete pattern
- ✅ Component composition with Shadcn/UI
- ✅ Tailwind CSS for styling
- ✅ State management with Zustand

## Next Steps

1. **Build the Golang backend** with:
   - Echo framework for HTTP routing
   - GORM for database ORM
   - PostgreSQL for data persistence
   - Implement all CRUD endpoints

2. **Connect the frontend** to your backend API

3. **Add authentication** (JWT, sessions, etc.)

4. **Deploy** to production

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### Port 5000 is already in use
```bash
# Kill the process on port 5000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Or use a different port
npm run dev:client -- --port 3000
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
npm run check
```

## License

MIT

## Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Wouter Routing](https://github.com/molefrog/wouter)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [Zustand State Management](https://github.com/pmndrs/zustand)

---

**Built with ❤️ for learning Golang and backend development**
