
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

export const DemoLinkSection = () => {
  return (
    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-yellow-900">Want to see hyper-local features?</h3>
          <p className="text-sm text-yellow-700">
            View the mock search page to see how the interface changes with configured homes.
          </p>
        </div>
        <Link to="/search-mock">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Mock Demo
          </Button>
        </Link>
      </div>
    </div>
  );
};
