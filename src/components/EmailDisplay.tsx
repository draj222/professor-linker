import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  generatedEmail: string;
  recentWork: string;
}

interface EmailDisplayProps {
  professor: Professor | null;
  onCopy: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
}

const emailTemplates = [
  { id: "phd", name: "PhD Application", tone: "formal" },
  { id: "research", name: "Research Inquiry", tone: "professional" },
  { id: "internship", name: "Internship Request", tone: "enthusiastic" }
];

export const EmailDisplay = ({ professor, onCopy, onSend, isSending }: EmailDisplayProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("research");
  const [emailTone, setEmailTone] = useState("professional");
  const [emailContent, setEmailContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEmail = async () => {
    if (!professor) return;

    setIsGenerating(true);
    try {
      const userData = {
        userName: localStorage.getItem("userName") || "[Your name]",
        fieldOfInterest: localStorage.getItem("fieldOfInterest") || "relevant field",
        educationLevel: localStorage.getItem("educationLevel") || "student",
        researchExperience: localStorage.getItem("researchExperience") || "relevant research experience",
        academicGoals: localStorage.getItem("academicGoals") || ""
      };

      const { data, error } = await supabase.functions.invoke('generate-email', {
        body: { 
          professor,
          template: selectedTemplate,
          tone: emailTone,
          userData
        },
      });

      if (error) throw error;
      
      setEmailContent(data.generatedEmail);
      toast.success("Email generated successfully");
    } catch (error) {
      console.error('Error generating email:', error);
      toast.error("Failed to generate email. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (professor) {
      generateEmail();
    }
  }, [professor, selectedTemplate, emailTone]);

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const template = emailTemplates.find(t => t.id === value);
    setEmailTone(template?.tone || "professional");
  };

  const handleToneChange = (value: string) => {
    console.log('Tone changed to:', value);
    setEmailTone(value);
    toast.success(`Email tone updated to ${value}`);
  };

  const handleSendEmail = async () => {
    if (!professor) return;

    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email;

    if (!userEmail) {
      toast.error("Please sign in to send emails");
      return;
    }

    const mailtoLink = `mailto:${professor.email}?subject=Research Opportunity Inquiry&body=${encodeURIComponent(emailContent)}&from=${encodeURIComponent(userEmail)}`;
    window.location.href = mailtoLink;
    onSend(); // Keep the original onSend callback for any additional functionality
  };

  if (!professor) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a professor to view the generated email
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            {emailTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={emailTone} onValueChange={handleToneChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0"
          onClick={generateEmail}
          disabled={isGenerating}
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit" onClick={() => setIsEditing(true)}>Edit</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-4">
          <div className="prose prose-sm">
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-2 font-mono">
                <p><strong>To:</strong> {professor?.email}</p>
                <p><strong>Subject:</strong> Research Opportunity Inquiry</p>
                <div className="mt-4">
                  {emailContent.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent value="edit" className="mt-4">
          <textarea
            className="w-full h-[320px] p-4 rounded-md bg-background border resize-none font-mono"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button
          onClick={() => onCopy(emailContent)}
          variant="outline"
          className="flex-1"
        >
          Copy Email
        </Button>
        <Button
          onClick={handleSendEmail}
          className="flex-1"
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send Email'}
        </Button>
      </div>
    </div>
  );
};