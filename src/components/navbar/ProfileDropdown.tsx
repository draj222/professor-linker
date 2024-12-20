import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProfileDropdownProps {
  userDetails: {
    email: string;
    name: string;
    fieldOfInterest: string;
  };
}

export const ProfileDropdown = ({ userDetails }: ProfileDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-white hover:text-blue-200 transition-colors">
          <User className="h-5 w-5 mr-2" />
          <span className="font-medium">Profile</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Personal Information</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2 space-y-2 text-sm">
          <div>
            <span className="font-semibold">Name:</span>
            <p className="text-muted-foreground">{userDetails.name || "Not set"}</p>
          </div>
          <div>
            <span className="font-semibold">Email:</span>
            <p className="text-muted-foreground">{userDetails.email || "Not set"}</p>
          </div>
          <div>
            <span className="font-semibold">Field of Interest:</span>
            <p className="text-muted-foreground">{userDetails.fieldOfInterest || "Not set"}</p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};