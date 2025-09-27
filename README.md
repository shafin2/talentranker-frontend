# TalentRanker Frontend

React frontend application for TalentRanker MVP built with Vite and Tailwind CSS.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   - Copy `.env` file and configure API base URL
   - Default API URL: `http://localhost:5000/api`

3. **Development:**
   ```bash
   npm run dev
   ```
   - Frontend runs on port 5173
   - Open http://localhost:5173

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── utils/          # Utility functions
├── App.jsx         # Main app component with routing
└── main.jsx        # Entry point
```

## Features

- ✅ React 18 with Vite
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Landing page
- ✅ Authentication pages (Sign In/Sign Up)
- ✅ Environment variable support
- ✅ ESLint + Prettier configuration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
