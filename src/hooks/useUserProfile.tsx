import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useUserProfile = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          setIsLoading(false);
          return;
        }

        console.log('Fetching profile for user:', user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (profile?.full_name) {
          console.log('Retrieved user full name:', profile.full_name);
          setUserName(profile.full_name);
        } else {
          // If no profile found, try to get name from user metadata
          const fullName = user.user_metadata?.full_name;
          if (fullName) {
            console.log('Using name from user metadata:', fullName);
            // Update the profile with the name from metadata
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ full_name: fullName })
              .eq('id', user.id);

            if (updateError) {
              console.error('Error updating profile with metadata name:', updateError);
            }
            setUserName(fullName);
          } else {
            console.log('No full name found in profile or metadata');
            setUserName(null);
          }
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile information. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  return { userName: userName || 'Your name', isLoading };
};