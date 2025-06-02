
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useHelpForm } from "@/hooks/useHelpForm";
import HelpOptionsSection from "@/components/help/HelpOptionsSection";
import ContactFormSection from "@/components/help/ContactFormSection";

const Help = () => {
  const {
    subject,
    setSubject,
    message,
    setMessage,
    handleSubmit,
  } = useHelpForm();

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Help & Support" showBack={true} showSettings={false} backTo="/settings" />
      
      <div className="px-4 py-6 space-y-6">
        {/* Quick Help Options */}
        <HelpOptionsSection />

        {/* Contact Form */}
        <ContactFormSection
          subject={subject}
          setSubject={setSubject}
          message={message}
          setMessage={setMessage}
          onSubmit={handleSubmit}
        />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Help;
