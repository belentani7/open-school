// Open School - Main App Component
import { RouterProvider } from 'wouter';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { CourseDetail } from './pages/CourseDetail';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <RouterProvider routes={ROUTES} />
      </AuthProvider>
    </ThemeProvider>
  );
}

const ROUTES = [
  ['/', Home],
  ['/dashboard', Dashboard],
  ['/courses/:id', CourseDetail],
  ['*', NotFound]
];
