

interface HeroSectionProps {
  userName: string;
}

export const HeroSection = ({ userName }: HeroSectionProps) => {
  return (
    <div className="mb-8">
      <div className="relative h-44 overflow-hidden" style={{
        backgroundImage: "url('/lovable-uploads/d9704b32-ce7b-4b66-9061-050802c2e526.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-purple-500/50" />
        <div className="relative h-full flex flex-col justify-center px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {userName}!</h1>
          <p className="text-gray-600">How can we help you today?</p>
        </div>
      </div>
    </div>
  );
};

