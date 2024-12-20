import { MultiStepForm } from '@/components/MultiStepForm';
import { Login } from '@/components/Login';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Academic Outreach Assistant
          </h1>
          <p className="mt-3 text-xl text-blue-200 sm:mt-5">
            Connect with professors and researchers in your field of interest
          </p>
        </div>

        {user ? <MultiStepForm /> : <Login />}
      </div>
    </div>
  );
};

export default Index;