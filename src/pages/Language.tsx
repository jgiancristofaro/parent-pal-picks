
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Check } from "lucide-react";

const Language = () => {
  const languages = [
    { code: "en", name: "English", selected: true },
    { code: "es", name: "Español", selected: false },
    { code: "fr", name: "Français", selected: false },
    { code: "de", name: "Deutsch", selected: false },
    { code: "it", name: "Italiano", selected: false },
    { code: "pt", name: "Português", selected: false },
    { code: "zh", name: "中文", selected: false },
    { code: "ja", name: "日本語", selected: false }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Language" showBack={true} showSettings={false} />
      
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          {languages.map((language, index) => (
            <div 
              key={language.code}
              className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                index !== languages.length - 1 ? "border-b border-gray-100" : ""
              } ${index === 0 ? "rounded-t-lg" : ""} ${
                index === languages.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              <span className="text-base text-gray-900">{language.name}</span>
              {language.selected && (
                <Check className="w-5 h-5 text-purple-500" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Language;
