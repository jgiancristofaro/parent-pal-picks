
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ActionButtons = () => {
  return (
    <div className="px-4 mb-8 flex gap-4">
      <Link to="/find-sitter" className="flex-1">
        <Button className="w-full py-6 text-white bg-purple-500 hover:bg-purple-600 rounded-lg">
          Find a Sitter
        </Button>
      </Link>
      <Link to="/shop" className="flex-1">
        <Button variant="outline" className="w-full py-6 bg-white border-gray-200 hover:bg-gray-50 rounded-lg">
          Shop Products
        </Button>
      </Link>
    </div>
  );
};
