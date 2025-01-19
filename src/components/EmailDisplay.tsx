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

I am writing to express my sincere interest in pursuing a Ph.D. under your supervision at {institution}. Your groundbreaking research on {recentWork} particularly resonates with my academic interests and career aspirations.

With my background in {fieldOfInterest} and {researchExperience}, I believe I can contribute meaningfully to your research group. During my {educationLevel} studies, I have developed strong analytical skills and research capabilities that align well with your work.

{academicGoals}

I would greatly appreciate the opportunity to discuss potential Ph.D. positions in your research group and how my background could contribute to your ongoing research initiatives.

Thank you for considering my application.

Best regards,
{userName}`
  },
  { 
    id: "research", 
    name: "Research Inquiry",
    tone: "professional",
    template: `Dear Professor {name},

I hope this email finds you well. I am writing to express my keen interest in your research at {institution}, particularly your work on {recentWork}.

As a {educationLevel} with experience in {researchExperience}, I am fascinated by the potential applications and implications of your research. My academic background in {fieldOfInterest} has equipped me with the foundational knowledge necessary to contribute to your research endeavors.

{academicGoals}

I would welcome the opportunity to discuss how my background and research interests align with your current projects and explore potential collaboration opportunities.

Thank you for your time and consideration.

Best regards,
{userName}`
  },
  { 
    id: "internship", 
    name: "Internship Request",
    tone: "enthusiastic",
    template: `Dear Professor {name},

I am writing to express my strong enthusiasm about the possibility of joining your research group at {institution} as an intern. Your innovative work on {recentWork} perfectly aligns with my academic interests and career aspirations.

Currently a {educationLevel} focusing on {fieldOfInterest}, I have gained valuable experience through {researchExperience}. This background has prepared me well to contribute meaningfully to your research projects.

{academicGoals}

I would be thrilled to have the opportunity to discuss potential internship positions in your lab and how I could contribute to your ongoing research initiatives.

Thank you for considering my request.

Best regards,
{userName}`
  },
];

const generateEmailContent = (professor: Professor, template: string, tone: string) => {
  console.log('Generating email with tone:', tone);
  let content = template;
  
  // Get user information from localStorage
  const userName = localStorage.getItem("userName") || "[Your name]";
  const fieldOfInterest = localStorage.getItem("fieldOfInterest") || "relevant field";
  const educationLevel = localStorage.getItem("educationLevel") || "student";
  const researchExperience = localStorage.getItem("researchExperience") || "relevant research experience";
  const academicGoals = localStorage.getItem("academicGoals") || "";
  
  // Apply tone-specific modifications
  switch (tone) {
    case "formal":
      content = content.replace(/I am/g, "I would like to");
      content = content.replace(/love to/g, "appreciate the opportunity to");
      break;
    case "professional":
      // Keep template as is - this is our baseline tone
      break;
    case "enthusiastic":
      content = content.replace(/interested/g, "very excited");
      content = content.replace(/would welcome/g, "would be thrilled to have");
      break;
  }

  // Replace placeholders with actual values
  return content
    .replace(/{name}/g, professor.name)
    .replace(/{institution}/g, professor.institution)
    .replace(/{recentWork}/g, professor.recentWork)
    .replace(/{userName}/g, userName)
    .replace(/{fieldOfInterest}/g, fieldOfInterest)
    .replace(/{educationLevel}/g, educationLevel)
    .replace(/{researchExperience}/g, researchExperience)
    .replace(/{academicGoals}/g, academicGoals ? `\nMy academic goals include ${academicGoals}.\n` : '');
};

export const EmailDisplay = ({ professor, onCopy, onSend, isSending }: EmailDisplayProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("research");
  const [emailTone, setEmailTone] = useState("professional");
  const [emailContent, setEmailContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (professor) {
      const template = emailTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        const newContent = generateEmailContent(professor, template.template, emailTone);
        setEmailContent(newContent);
      }
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

  const regenerateEmail = () => {
    if (professor) {
      const template = emailTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        const newContent = generateEmailContent(professor, template.template, emailTone);
        setEmailContent(newContent);
        toast.success("Email regenerated with selected template and tone");
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
