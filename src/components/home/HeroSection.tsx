
interface HeroSectionProps {
  userName: string;
}

export const HeroSection = ({ userName }: HeroSectionProps) => {
  return (
    <div className="mb-4">
      <div className="relative h-40 overflow-hidden" style={{
        backgroundImage: "url('/lovable-uploads/d9704b32-ce7b-4b66-9061-050802c2e526.png')",
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
