import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';

export const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (session) {
        console.log('User logged in, redirecting to dashboard');
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'hsl(var(--primary))',
              brandAccent: 'hsl(var(--primary) / 0.8)',
              brandButtonText: 'hsl(var(--primary-foreground))',
              defaultButtonBackground: 'hsl(var(--secondary))',
              defaultButtonBackgroundHover: 'hsl(var(--secondary) / 0.8)',
              inputBackground: 'transparent',
              inputBorder: 'hsl(var(--border))',
              inputBorderHover: 'hsl(var(--border))',
              inputBorderFocus: 'hsl(var(--ring))',
              inputText: 'hsl(var(--foreground))',
              inputLabelText: 'hsl(var(--muted-foreground))',
              inputPlaceholder: 'hsl(var(--muted-foreground))',
            },
            space: {
              buttonPadding: '0.5rem 1rem',
              inputPadding: '0.5rem 1rem',
            },
            radii: {
              borderRadiusButton: '0.5rem',
              buttonBorderRadius: '0.5rem',
              inputBorderRadius: '0.5rem',
            },
          },
        },
        className: {
          container: 'space-y-4',
          button: 'w-full px-4 py-2 rounded-md transition-colors',
          input: 'w-full px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50',
          label: 'block text-sm font-medium mb-1',
        },
      }}
      providers={['google']}
      redirectTo={window.location.origin}
    />
  );
};