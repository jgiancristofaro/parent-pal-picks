
import { useQuery } from '@tanstack/react-query';

interface MockProfile {
  id: string;
  full_name: string;
  username: string;
  identity_tag: string;
  bio: string;
  avatar_url: string;
  created_at: string;
}

interface MockUser {
  id: string;
  full_name: string;
  avatar_url: string;
}

interface MockRecommendation {
  id: string;
  name: string;
  profile_image_url?: string;
  image_url?: string;
  rating?: number;
  experience?: string;
  bio?: string;
  hourly_rate?: number;
  category?: string;
  brand_name?: string;
  average_rating?: number;
  profile_owner_review: {
    rating: number;
    review_text_snippet: string;
  };
}

const mockProfileData: MockProfile = {
  id: 'mock-user-1',
  full_name: 'Sarah Johnson',
  username: 'sarahjohnson',
  identity_tag: 'Mom',
  bio: 'Mother of two wonderful kids, love finding great babysitters and sharing product recommendations with other parents in our community.',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  created_at: '2024-01-01T00:00:00Z',
};

const mockFollowers: MockUser[] = [
  {
    id: 'mock-user-2',
    full_name: 'Emily Rodriguez',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'mock-user-3',
    full_name: 'Michael Chen',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'mock-user-4',
    full_name: 'Jessica Williams',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const mockFollowing: MockUser[] = [
  {
    id: 'mock-user-2',
    full_name: 'Emily Rodriguez',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'mock-user-3',
    full_name: 'Michael Chen',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const mockSitterRecommendations: MockRecommendation[] = [
  {
    id: 'sitter-1',
    name: 'Amanda Thompson',
    profile_image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8,
    experience: '5 years of childcare experience',
    bio: 'Experienced babysitter with 5+ years caring for children of all ages.',
    hourly_rate: 25.00,
    profile_owner_review: {
      rating: 5,
      review_text_snippet: 'Amanda was fantastic with my kids. They absolutely loved her and she was very professional and reliable.'
    }
  },
  {
    id: 'sitter-2',
    name: 'David Martinez',
    profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.9,
    experience: '3 years of childcare experience',
    bio: 'Reliable and fun babysitter who loves playing games with kids.',
    hourly_rate: 22.00,
    profile_owner_review: {
      rating: 5,
      review_text_snippet: 'David was wonderful with my 3-year-old. He was patient, engaging, and my son had so much fun.'
    }
  }
];

const mockProductRecommendations: MockRecommendation[] = [
  {
    id: 'product-1',
    name: 'Organic Baby Food Pouches',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Baby Food',
    brand_name: 'Happy Baby',
    average_rating: 4.7,
    profile_owner_review: {
      rating: 5,
      review_text_snippet: 'These organic baby food pouches are a lifesaver! My baby loves the flavors and they are so convenient.'
    }
  },
  {
    id: 'product-2',
    name: 'Soft Baby Blankets',
    image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Baby Gear',
    brand_name: 'Cloud Nine',
    average_rating: 4.9,
    profile_owner_review: {
      rating: 4,
      review_text_snippet: 'These blankets are incredibly soft and my baby sleeps so well with them. Great quality.'
    }
  }
];

export const useMockProfile = () => {
  return useQuery({
    queryKey: ['mock-profile'],
    queryFn: async () => mockProfileData,
    enabled: true,
  });
};

export const useMockProfileFollowers = () => {
  return useQuery({
    queryKey: ['mock-profile-followers'],
    queryFn: async () => mockFollowers,
    enabled: true,
  });
};

export const useMockProfileFollowing = () => {
  return useQuery({
    queryKey: ['mock-profile-following'],
    queryFn: async () => mockFollowing,
    enabled: true,
  });
};

export const useMockUserRecommendations = (itemType: 'sitter' | 'product') => {
  return useQuery({
    queryKey: ['mock-user-recommendations', itemType],
    queryFn: async () => {
      if (itemType === 'sitter') return mockSitterRecommendations;
      return mockProductRecommendations;
    },
    enabled: true,
  });
};
