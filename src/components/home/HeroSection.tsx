
interface HeroSectionProps {
  userName: string;
}

export const HeroSection = ({ userName }: HeroSectionProps) => {
  return (
    <div className="mb-8">
      <div className="relative h-44 bg-gradient-to-br from-purple-100 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-center bg-cover opacity-30" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?q=80&w=2540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}>
        </div>
        <div className="relative h-full flex flex-col justify-center px-6 bg-violet-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {userName}!</h1>
          <p className="text-gray-600">How can we help you today?</p>
        </div>
      </div>
    </div>
  );
};
