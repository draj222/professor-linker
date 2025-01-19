import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2 } from "lucide-react";

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
  { id: "internship", name: "Internship Request", tone: "enthusiastic" },
];

export const EmailDisplay = ({ professor, onCopy, onSend, isSending }: EmailDisplayProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("research");
  const [emailTone, setEmailTone] = useState("professional");

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
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
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

        <Select value={emailTone} onValueChange={setEmailTone}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="shrink-0">
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-4">
          <div className="prose prose-sm">
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-2">
                <p><strong>To:</strong> {professor.email}</p>
                <p><strong>Subject:</strong> Research Opportunity Inquiry</p>
                <div className="mt-4">
                  {professor.generatedEmail.split('\n').map((paragraph, index) => (
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
            defaultValue={professor.generatedEmail}
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button
          onClick={() => onCopy(professor.generatedEmail)}
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