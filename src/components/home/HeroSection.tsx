

interface HeroSectionProps {
  userName: string;
}

export const HeroSection = ({ userName }: HeroSectionProps) => {
  return (
    <div className="mb-4 mx-4 pt-2">
      <div className="relative h-34 overflow-hidden rounded-xl" style={{
        backgroundImage: "url('/assets/hero-current.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="relative h-full flex flex-col justify-center px-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back,
            <br />
            {userName}!
          </h1>
        </div>
      </div>
    </div>
  );
};

