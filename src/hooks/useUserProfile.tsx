import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useUserProfile = () => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('Fetching profile for user:', user.id);
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            throw error;
          }
          
          if (profile?.full_name) {
            console.log('Retrieved user full name:', profile.full_name);
            setUserName(profile.full_name);
          } else {
            console.log('No full name found in profile');
            setUserName('');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  return { userName, isLoading };
};