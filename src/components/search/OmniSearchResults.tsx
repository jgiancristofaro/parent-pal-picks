
import { Link } from "react-router-dom";
import { User, Baby, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@/components/StarIcon";

interface OmniSearchResult {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  result_type: 'parent' | 'sitter' | 'product';
  relevance_score: number;
  category: string;
  rating: number | null;
  metadata: any;
}

interface OmniSearchResultsProps {
  results: OmniSearchResult[];
  isLoading: boolean;
}

export const OmniSearchResults = ({ results, isLoading }: OmniSearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No results found. Try a different search term.</p>
      </div>
    );
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'parent':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'sitter':
        return <Baby className="w-5 h-5 text-purple-500" />;
      case 'product':
        return <Package className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getResultLink = (result: OmniSearchResult) => {
    switch (result.result_type) {
      case 'parent':
        return `/profile/${result.id}`;
      case 'sitter':
        return `/sitter/${result.id}`;
      case 'product':
        return `/product/${result.id}`;
      default:
        return '#';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} filled={true} className="w-3 h-3 text-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" filled={false} className="w-3 h-3 text-yellow-500" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} filled={false} className="w-3 h-3 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Found {results.length} result{results.length !== 1 ? 's' : ''}
      </div>
      
      {results.map((result) => (
        <Card key={`${result.result_type}-${result.id}`} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <Link to={getResultLink(result)} className="block">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {result.image_url ? (
                    <img 
                      src={result.image_url} 
                      alt={result.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getResultIcon(result.result_type)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{result.name}</h3>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {result.result_type}
                    </Badge>
                  </div>
                  
                  {result.rating && (
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex">
                        {renderStars(result.rating)}
                      </div>
                      <span className="text-xs text-gray-600">({result.rating})</span>
                    </div>
                  )}
                  
                  {result.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {result.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">{result.category}</span>
                    <span className="text-xs text-gray-400">
                      {Math.round(result.relevance_score * 100)}% match
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
