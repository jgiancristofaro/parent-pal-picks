import { Link, useSearchParams } from "react-router-dom";
import { User, Baby, Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SitterCard } from "@/components/SitterCard";
import { ProductCard } from "@/components/ProductCard";

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

interface GroupedResults {
  parent: OmniSearchResult[];
  sitter: OmniSearchResult[];
  product: OmniSearchResult[];
}

interface OmniSearchResultsProps {
  results: OmniSearchResult[];
  isLoading: boolean;
  searchTerm?: string;
}

export const OmniSearchResults = ({ results, isLoading, searchTerm }: OmniSearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">No results found</p>
        <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
      </div>
    );
  }

  const groupedResults: GroupedResults = results.reduce((acc, result) => {
    if (!acc[result.result_type]) {
      acc[result.result_type] = [];
    }
    acc[result.result_type].push(result);
    return acc;
  }, { parent: [], sitter: [], product: [] } as GroupedResults);

  const getCategoryInfo = (type: keyof GroupedResults) => {
    const baseUrl = type === 'sitter' ? '/find-sitter' : type === 'product' ? '/shop' : '/find-parents';
    const urlWithSearch = searchTerm ? `${baseUrl}?search=${encodeURIComponent(searchTerm)}` : baseUrl;
    
    switch (type) {
      case 'parent':
        return { 
          title: 'Parents', 
          icon: User, 
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          linkPath: urlWithSearch
        };
      case 'sitter':
        return { 
          title: 'Sitters', 
          icon: Baby, 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          linkPath: urlWithSearch
        };
      case 'product':
        return { 
          title: 'Products', 
          icon: Package, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          linkPath: urlWithSearch
        };
      default:
        return { 
          title: 'Results', 
          icon: Package, 
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          linkPath: '#'
        };
    }
  };

  const renderParentCard = (parent: OmniSearchResult) => (
    <Link key={parent.id} to={`/profile/${parent.id}`}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
              {parent.image_url ? (
                <img 
                  src={parent.image_url} 
                  alt={parent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{parent.name}</h3>
              {parent.metadata?.username && (
                <p className="text-sm text-gray-500">@{parent.metadata.username}</p>
              )}
              {parent.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{parent.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-8">
      <div className="text-sm text-gray-600">
        Found {results.length} result{results.length !== 1 ? 's' : ''} across {Object.keys(groupedResults).filter(key => groupedResults[key as keyof GroupedResults].length > 0).length} categories
      </div>

      {Object.entries(groupedResults).map(([type, items]) => {
        if (items.length === 0) return null;
        
        const categoryInfo = getCategoryInfo(type as keyof GroupedResults);
        const Icon = categoryInfo.icon;
        const displayItems = items.slice(0, 5); // Show top 5 results
        const hasMore = items.length > 5;

        return (
          <Card key={type} className={categoryInfo.bgColor}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${categoryInfo.color}`} />
                  <span className={categoryInfo.color}>{categoryInfo.title}</span>
                  <Badge variant="secondary" className="ml-2">
                    {items.length}
                  </Badge>
                </CardTitle>
                {hasMore && (
                  <Link to={categoryInfo.linkPath}>
                    <Button variant="ghost" size="sm" className={`${categoryInfo.color} hover:${categoryInfo.bgColor}`}>
                      See all
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {displayItems.map((item) => {
                  if (type === 'parent') {
                    return renderParentCard(item);
                  }
                  
                  if (type === 'sitter') {
                    return (
                      <SitterCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image_url || '/assets/defaultsitter.jpg'}
                        rating={item.rating || 0}
                        experience={item.metadata?.experience}
                        friendRecommendationCount={0}
                      />
                    );
                  }
                  
                  if (type === 'product') {
                    return (
                      <ProductCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image_url || '/assets/other.jpg'}
                        category={item.category}
                        rating={item.rating || undefined}
                      />
                    );
                  }
                  
                  return null;
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
