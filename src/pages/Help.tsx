
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Phone, Mail, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Help = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support request submitted:", { subject, message });
    // Handle form submission
  };

  const helpOptions = [
    {
      title: "Frequently Asked Questions",
      description: "Find answers to common questions",
      icon: FileText,
      href: "#"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageSquare,
      href: "#"
    },
    {
      title: "Call Support",
      description: "1-800-PARENTPAL",
      icon: Phone,
      href: "tel:18007273687"
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Help & Support" showBack={true} showSettings={false} backTo="/settings" />
      
      <div className="px-4 py-6 space-y-6">
        {/* Quick Help Options */}
        <div className="bg-white rounded-lg shadow-sm">
          {helpOptions.map((option, index) => (
            <Link
              key={option.title}
              to={option.href}
              className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                index !== helpOptions.length - 1 ? "border-b border-gray-100" : ""
              } ${index === 0 ? "rounded-t-lg" : ""} ${
                index === helpOptions.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <option.icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-medium text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Send us a message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Help;
