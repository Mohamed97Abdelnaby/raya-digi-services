import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={toggleLanguage}
      className="gap-2 transition-all duration-300 hover:shadow-md"
    >
      <Languages className="h-5 w-5" />
      <span className="text-base font-semibold">{language === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  );
};
