
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Sitter {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience?: string;
  friendRecommendationCount: number;
  workedInUserLocationNickname?: string;
}

interface SitterSearchResultCardProps {
  sitter: Sitter;
  onSelectSitter: (sitter: Sitter) => void;
}

export const SitterSearchResultCard = ({ sitter, onSelectSitter }: SitterSearchResultCardProps) => {
  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50 transition-all">
      <Avatar className="w-16 h-16">
        <AvatarImage 
          src={sitter.image} 
          alt={sitter.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-gray-100 text-gray-600">
          {sitter.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-900">{sitter.name}</h4>
        {sitter.experience && (
          <p className="text-sm text-gray-600">{sitter.experience}</p>
        )}
        {sitter.rating > 0 && (
          <p className="text-sm text-gray-500">Rating: {sitter.rating}/5</p>
        )}
      </div>
      
      <Button
        onClick={() => onSelectSitter(sitter)}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        Review this Sitter
      </Button>
    </div>
  );
};
