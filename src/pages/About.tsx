
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Award } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All babysitters are background checked and verified"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with trusted parents and caregivers in your area"
    },
    {
      icon: Heart,
      title: "Peace of Mind",
      description: "Reviews and ratings help you make informed decisions"
    },
    {
      icon: Award,
      title: "Quality Care",
      description: "Only the best babysitters join our platform"
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="About ParentPal" showBack={true} showSettings={false} backTo="/settings" />
      
      <div className="px-4 py-6 space-y-6">
        {/* App Logo/Icon */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ParentPal</h1>
          <p className="text-gray-600 mb-4">Version 1.0.0</p>
          <p className="text-gray-700 leading-relaxed">
            ParentPal connects parents with trusted, verified babysitters in their community. 
            Our mission is to make finding quality childcare simple, safe, and reliable.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Why Choose ParentPal?</h2>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Company Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Founded</span>
              <span className="text-gray-900">2021</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Headquarters</span>
              <span className="text-gray-900">San Francisco, CA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Support Email</span>
              <span className="text-gray-900">support@parentpal.com</span>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Privacy Policy
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Terms of Service
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Licenses
          </Button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default About;
