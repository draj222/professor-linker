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

As a {educationLevel} specializing in {fieldOfInterest}, I have developed a strong foundation in research methodology and analytical thinking. Through my experience in {researchExperience}, I have cultivated the skills and knowledge that I believe would allow me to make meaningful contributions to your research group.

{academicGoals}

I am particularly drawn to your innovative approaches and would welcome the opportunity to discuss how my background and research interests could contribute to your ongoing projects. I am confident that working under your guidance would provide an exceptional environment for my doctoral studies.

Thank you for considering my application. I look forward to the possibility of discussing this opportunity further.

Best regards,
{userName}`
  },
  { 
    id: "research", 
    name: "Research Inquiry",
    tone: "professional",
    template: `Dear Professor {name},

I hope this email finds you well. I am writing to express my keen interest in your research at {institution}, particularly your groundbreaking work on {recentWork}.

Having focused my {educationLevel} studies on {fieldOfInterest}, I have developed a deep fascination with this field. My experience in {researchExperience} has equipped me with valuable skills and insights that I believe would enable me to contribute effectively to your research initiatives.

{academicGoals}

Your innovative approach to research, especially in {recentWork}, aligns perfectly with my academic interests. I would welcome the opportunity to discuss how my background and research interests could complement your current projects and explore potential collaboration opportunities.

Thank you for your time and consideration. I look forward to the possibility of discussing this further.

Best regards,
{userName}`
  },
  { 
    id: "internship", 
    name: "Internship Request",
    tone: "enthusiastic",
    template: `Dear Professor {name},

I am writing to express my strong enthusiasm about the possibility of joining your research group at {institution} as an intern. Your innovative work on {recentWork} has deeply inspired my academic pursuits, and I am excited about the prospect of contributing to your research initiatives.

As a {educationLevel} with a focus in {fieldOfInterest}, I have had the opportunity to develop my research skills through {researchExperience}. This experience has not only strengthened my analytical capabilities but also reinforced my passion for this field.

{academicGoals}

I am particularly impressed by your groundbreaking research in {recentWork} and would be thrilled to learn from your expertise while contributing to your ongoing projects. Your lab's innovative approach to research perfectly aligns with my academic interests and career aspirations.

I would welcome the opportunity to discuss how my background and enthusiasm could contribute to your research group. Thank you for considering my application.

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
  
  // Format academic goals as a paragraph if they exist
  const formattedAcademicGoals = academicGoals 
    ? `In terms of my academic trajectory, ${academicGoals}. I believe that working with your research group would be instrumental in achieving these goals.`
    : '';
  
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
    .replace(/{academicGoals}/g, formattedAcademicGoals);
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
