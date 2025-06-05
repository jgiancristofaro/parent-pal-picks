
interface HeroSectionProps {
  userName: string;
}

export const HeroSection = ({ userName }: HeroSectionProps) => {
  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back,
        <br />
        {userName}!
      </h1>
    </div>
  );
};
