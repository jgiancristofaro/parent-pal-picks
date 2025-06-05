import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { StarIcon } from "@/components/StarIcon";
import { ProfileHeader } from "@/components/sitter/ProfileHeader";
import { AboutSection } from "@/components/sitter/AboutSection";
import { ExperienceSection } from "@/components/sitter/ExperienceSection";
import { CertificationsSection } from "@/components/sitter/CertificationsSection";
import { RatesSection } from "@/components/sitter/RatesSection";
import { AvailabilitySection } from "@/components/sitter/AvailabilitySection";
import { ReviewsSection } from "@/components/sitter/ReviewsSection";
import { RecommendedBySection } from "@/components/sitter/RecommendedBySection";
import { useSitterProfile } from "@/hooks/useSitterProfile";
import { useSitterReviews } from "@/hooks/useSitterReviews";
import { Skeleton } from "@/components/ui/skeleton";

const SitterProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: sitter, isLoading: sitterLoading, error: sitterError } = useSitterProfile(id);
  const { data: reviewsData = [], isLoading: reviewsLoading } = useSitterReviews(id);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon key={i} filled={i < rating} className="w-5 h-5 text-yellow-500" />
    ));
  };

  if (sitterLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header title="Babysitter Profile" showBack={true} />
        <div className="p-4 space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (sitterError || !sitter) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header title="Babysitter Profile" showBack={true} />
        <div className="p-4">
          <div className="text-center py-8">
            <p className="text-gray-600">Sitter not found or unable to load profile.</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform reviews data to match the expected format
  const reviews = reviewsData.map(review => ({
    id: review.id,
    userId: review.user_id,
    userName: review.profiles?.full_name || 'Anonymous',
    userImage: review.profiles?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: review.rating,
    date: new Date(review.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    content: review.content
  }));

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Babysitter Profile" showBack={true} />
      
      <ProfileHeader sitter={{
        name: sitter.name,
        role: "Babysitter",
        rating: sitter.rating ? Number(sitter.rating) : 0,
        reviewCount: sitter.review_count || 0,
        profileImage: sitter.profile_image_url || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }} renderStars={renderStars} />

      <div className="p-4">
        <AboutSection about={sitter.bio || "No bio provided"} />
        <ExperienceSection experience={sitter.experience || "Experience not specified"} />
        <CertificationsSection certifications={sitter.certifications || []} />
        <RatesSection rate={sitter.hourly_rate ? `$${sitter.hourly_rate}/hour` : "Rate not specified"} />
        <AvailabilitySection />
        <ReviewsSection reviews={reviews} renderStars={renderStars} />
        <RecommendedBySection />

        <Button className="w-full py-6 bg-purple-500 hover:bg-purple-600 mb-6">
          Book Now
        </Button>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SitterProfile;
