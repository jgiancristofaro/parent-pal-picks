
import { useQuery } from "@tanstack/react-query";

interface TopCommunityPick {
  product_id: string;
  product_name: string;
  product_image_url: string;
  product_category: string;
  average_rating: number;
  unique_recommender_count: number;
}

export const useTopCommunityPicksMock = () => {
  return useQuery({
    queryKey: ['top-community-picks-mock'],
    queryFn: async () => {
      console.log('Fetching mock top community picks...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockData: TopCommunityPick[] = [
        {
          product_id: "prod-1",
          product_name: "Smart Baby Monitor Pro",
          product_image_url: "https://images.unsplash.com/photo-1586685715203-7cfac24d9afa?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          product_category: "Baby Monitors",
          average_rating: 4.7,
          unique_recommender_count: 12
        },
        {
          product_id: "prod-2", 
          product_name: "Ergonomic Baby Carrier",
          product_image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2420&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          product_category: "Baby Carriers",
          average_rating: 4.5,
          unique_recommender_count: 8
        },
        {
          product_id: "prod-3",
          product_name: "Organic Baby Food Set", 
          product_image_url: "https://images.unsplash.com/photo-1515977991749-833d25c1020d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          product_category: "Baby Food",
          average_rating: 4.8,
          unique_recommender_count: 15
        },
        {
          product_id: "prod-4",
          product_name: "Ultra Soft Baby Blankets",
          product_image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          product_category: "Baby Blankets",
          average_rating: 4.6,
          unique_recommender_count: 10
        },
        {
          product_id: "prod-5",
          product_name: "Baby Sleep Sound Machine",
          product_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          product_category: "Sleep Aids",
          average_rating: 4.4,
          unique_recommender_count: 7
        },
        {
          product_id: "prod-6",
          product_name: "Natural Baby Lotion",
          product_image_url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=2486&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          product_category: "Baby Care",
          average_rating: 4.5,
          unique_recommender_count: 9
        }
      ];

      console.log('Mock top community picks data:', mockData);
      return mockData;
    },
  });
};
