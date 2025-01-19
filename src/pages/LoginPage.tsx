import { Login } from '@/components/Login';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-20">
            <button 
              onClick={() => navigate('/')}
              className="text-primary text-xl font-medium hover:text-primary/80 transition-colors"
            >
              Professor Linker
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto px-4 relative z-10">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-4xl font-semibold text-primary mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to continue your academic journey</p>
          </div>
          
          <div className="backdrop-blur-xl bg-card/30 p-8 rounded-lg border border-border/50 shadow-xl">
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;