import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FieldOfInterestProps {
  initialValue: string;
  onUpdate: (newValue: string) => void;
}

export const FieldOfInterest = ({ initialValue, onUpdate }: FieldOfInterestProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFieldOfInterest, setNewFieldOfInterest] = useState(initialValue);
  const { toast } = useToast();

  const updateFieldOfInterest = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { field_of_interest: newFieldOfInterest }
      });

      if (error) throw error;

      onUpdate(newFieldOfInterest);
      
      toast({
        title: "Success",
        description: "Field of interest updated successfully",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error updating field of interest:", error);
      toast({
        title: "Error",
        description: "Failed to update field of interest",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-white hover:text-blue-200 transition-colors">
          <BookOpen className="h-5 w-5 mr-2" />
          <span className="font-medium">Field of Interest</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Update Field of Interest</h4>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your field of interest"
              value={newFieldOfInterest}
              onChange={(e) => setNewFieldOfInterest(e.target.value)}
            />
            <Button onClick={updateFieldOfInterest}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};