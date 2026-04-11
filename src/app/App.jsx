import { RouterProvider } from 'react-router';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../auth/AuthContext';
import { router } from './routes';
import { syncService } from '../utils/syncService';
import { Moon, Sun } from 'lucide-react';

function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'light';
  const toggleTheme = () => setTheme(currentTheme === 'dark' ? 'light' : 'dark');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-3 text-sm font-medium text-foreground shadow-lg shadow-black/10 transition hover:bg-accent/20"
    >
      {currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {currentTheme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize offline sync service
    syncService.startAutoSync();

    // Listen for sync events
    syncService.addListener((event, data) => {
      console.log('Sync event:', event, data);
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
