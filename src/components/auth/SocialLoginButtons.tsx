
import { Button } from "@/components/ui/button";

const SocialLoginButtons = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-gray-600 mb-6">Or sign up with</p>
      
      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline" 
          className="flex-1 py-6 bg-white border-gray-200 hover:bg-gray-50 max-w-[170px]"
        >
          Facebook
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 py-6 bg-white border-gray-200 hover:bg-gray-50 max-w-[170px]"
        >
          Google
        </Button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
