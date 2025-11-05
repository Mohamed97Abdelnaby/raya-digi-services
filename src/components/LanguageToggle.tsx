import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 transition-all duration-300 hover:shadow-md"
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  );
};
