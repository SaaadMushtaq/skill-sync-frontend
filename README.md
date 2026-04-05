# SkillSync - Frontend

A modern, full-stack job management and Kanban board application built with **React**, **TypeScript**, and **Vite**. SkillSync helps users organize, track, and manage job opportunities with an intuitive drag-and-drop interface.

## 🎯 Features

- **User Authentication** - Secure login and registration system
- **Kanban Board** - Organize job opportunities in customizable columns
- **Job Cards** - Detailed job information and management
- **Drag-and-Drop** - Seamlessly move jobs between different states using DnD Kit
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Real-time Updates** - Redux state management for efficient data flow
- **Smooth Animations** - Enhanced UX with Framer Motion

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Drag & Drop**: DnD Kit
- **Animations**: Framer Motion
- **Linting**: ESLint

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd skill-sync-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory
   - Add your API endpoint (e.g., `VITE_API_URL=http://localhost:5000`)

## 🚀 Development

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── api/                 # API integration layer
│   ├── authApi.ts      # Authentication API calls
│   └── jobsApi.ts      # Job & Kanban API calls
├── components/          # Reusable React components
│   ├── AnimatedBlob.tsx
│   ├── JobCard.tsx
│   ├── JobModal.tsx
│   ├── KanbanColumn.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── pages/               # Page-level components
│   ├── Dashboard.tsx    # Main Kanban board
│   ├── Login.tsx        # User login
│   └── Register.tsx     # User registration
├── services/            # Business logic and utilities
│   └── api.ts          # Axios instance configuration
├── store/               # Redux store setup
│   ├── store.ts        # Store configuration
│   └── slices/         # Redux slices
│       └── authSlice.ts
├── types/               # TypeScript type definitions
├── utils/               # Helper functions
├── App.tsx              # Root component
└── main.tsx             # Application entry point
```

## 📝 Available Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start development server with HMR |
| `npm run build`   | Build for production              |
| `npm run lint`    | Run ESLint to check code quality  |
| `npm run preview` | Preview production build          |

## 🔐 Authentication

The application includes role-based access control with protected routes:

- Public routes: Login & Register pages
- Protected routes: Dashboard & job management features

Authentication state is managed through Redux and persisted across sessions.

## 🎨 Styling

The project uses **Tailwind CSS** for styling with a responsive, mobile-first approach. Custom animations are implemented using **Framer Motion** for smooth, professional transitions.

## 🔄 Drag and Drop

The Kanban board uses **DnD Kit** for robust drag-and-drop functionality, allowing users to easily move job cards between different statuses.

## 📡 API Integration

API calls are managed through a centralized Axios instance in `services/api.ts` with proper error handling and request/response interceptors.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to ensure code quality
4. Submit a pull request

## 📄 License

This project is part of the SkillSync application suite.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
