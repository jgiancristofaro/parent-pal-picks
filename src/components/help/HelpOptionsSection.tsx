
import { MessageSquare, Phone, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HelpOptionsSection = () => {
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
  );
};

export default HelpOptionsSection;
