
import { Header } from "@/components/Header";

interface PageHeaderProps {
  type: 'sitter' | 'product';
  mode: 'discovery' | 'review';
}

export const PageHeader = ({ type, mode }: PageHeaderProps) => {
  const getPageTitle = () => {
    if (type === 'sitter') {
      return mode === 'review' ? 'Select a Sitter to Review' : 'Find a sitter';
    }
    return mode === 'review' ? 'Select a Product to Review' : 'Shop Products';
  };

  return <Header title={getPageTitle()} showBack={true} showSettings={false} />;
};
