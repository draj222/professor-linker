import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";

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
  { 
    id: "phd", 
    name: "PhD Application",
    tone: "formal",
    template: `Dear Professor {name},

I am writing to express my strong interest in pursuing a Ph.D. under your supervision at {institution}. Your work on {recentWork} particularly resonates with my research interests.

I would greatly appreciate the opportunity to discuss potential Ph.D. positions in your research group.

Best regards,
[Your name]`
  },
  { 
    id: "research", 
    name: "Research Inquiry",
    tone: "professional",
    template: `Dear Professor {name},

I recently read about your research on {recentWork} and am very interested in learning more about opportunities to contribute to your work at {institution}.

I would welcome the chance to discuss how my background aligns with your current research projects.

Best regards,
[Your name]`
  },
  { 
    id: "internship", 
    name: "Internship Request",
    tone: "enthusiastic",
    template: `Dear Professor {name},

I am excited about the possibility of joining your research group at {institution} as an intern. Your recent work on {recentWork} perfectly aligns with my interests and career goals.

I would love to discuss potential internship opportunities in your lab.

Best regards,
[Your name]`
  },
];

export const EmailDisplay = ({ professor, onCopy, onSend, isSending }: EmailDisplayProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("research");
  const [emailTone, setEmailTone] = useState("professional");
  const [emailContent, setEmailContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (professor) {
      const template = emailTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        const newContent = template.template
          .replace(/{name}/g, professor.name)
          .replace(/{institution}/g, professor.institution)
          .replace(/{recentWork}/g, professor.recentWork);
        setEmailContent(newContent);
      }
    }
  }, [professor, selectedTemplate]);

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    setEmailTone(emailTemplates.find(t => t.id === value)?.tone || "professional");
  };

  const handleToneChange = (value: string) => {
    setEmailTone(value);
    toast.success(`Email tone updated to ${value}`);
  };

  const regenerateEmail = () => {
    if (professor) {
      const template = emailTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        const newContent = template.template
          .replace(/{name}/g, professor.name)
          .replace(/{institution}/g, professor.institution)
          .replace(/{recentWork}/g, professor.recentWork);
        setEmailContent(newContent);
        toast.success("Email regenerated with selected template");
      }
    }
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
          onClick={regenerateEmail}
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
              <div className="space-y-2">
                <p><strong>To:</strong> {professor.email}</p>
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
            className="w-full h-[320px] p-4 rounded-md bg-background border resize-none"
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
          onClick={onSend}
          className="flex-1"
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send Email'}
        </Button>
      </div>
    </div>
  );
};