
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";

interface ContactFormSectionProps {
  subject: string;
  setSubject: (subject: string) => void;
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactFormSection = ({
  subject,
  setSubject,
  message,
  setMessage,
  onSubmit,
}: ContactFormSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Mail className="w-5 h-5 mr-2" />
        Send us a message
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <Textarea
          placeholder="Describe your issue or question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />
        <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600">
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default ContactFormSection;
