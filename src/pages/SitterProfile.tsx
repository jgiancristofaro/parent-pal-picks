
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

const SitterProfile = () => {
  // Mock data for demonstration
  const sitter = {
    id: "123",
    name: "Sophia Bennett",
    role: "Babysitter",
    rating: 4.9,
    reviewCount: 120,
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    about: "Sophia is a certified babysitter with 5+ years of experience caring for children of all ages. She is CPR and First Aid certified and has a background in early childhood education. Sophia loves engaging kids with fun activities and ensuring their safety and well-being.",
    experience: "2018 - Present",
    certifications: ["CPR & First Aid Certified"],
    rate: "$20/hour",
    availability: "July 2024"
  };

  const reviews = [
    {
      id: "r1",
      userId: "u1",
      userName: "Emily Carter",
      userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
      date: "June 15, 2024",
      content: "Sophia is an amazing babysitter! She is reliable, trustworthy, and great with kids. My children adore her and always have a fantastic time when she's around. I highly recommend her!"
    },
    {
      id: "r2",
      userId: "u2",
      userName: "David Lee",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
      date: "May 20, 2024",
      content: "Sophia is a fantastic babysitter. She's punctual, responsible, and my kids love her. She always keeps them engaged with fun activities and I feel completely at ease when she's with them."
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon key={i} filled={i < rating} className="w-5 h-5 text-yellow-500" />
    ));
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Babysitter Profile" showBack={true} />
      
      <ProfileHeader sitter={sitter} renderStars={renderStars} />

      <div className="p-4">
        <AboutSection about={sitter.about} />
        <ExperienceSection experience={sitter.experience} />
        <CertificationsSection certifications={sitter.certifications} />
        <RatesSection rate={sitter.rate} />
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
