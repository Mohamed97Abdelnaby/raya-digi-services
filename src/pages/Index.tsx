import { useState } from 'react';
import { Banknote, FileText, Coins, ArrowLeftRight, PiggyBank, Printer, BookOpen, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceModal } from '@/components/ServiceModal';
import rayaLogo from '@/assets/raya-logo.png';

type ServiceType = 'withdrawal' | 'kyc' | 'foreign' | 'exchange' | 'deposit' | 'statement' | 'chequebook' | 'mobile' | null;

const Index = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<ServiceType>(null);

  const services = [
    {
      id: 'withdrawal' as const,
      icon: Banknote,
      title: t('withdrawal'),
      description: t('withdrawalDesc'),
      details: t('withdrawalDetails'),
    },
    {
      id: 'kyc' as const,
      icon: FileText,
      title: t('updateKyc'),
      description: t('updateKycDesc'),
      details: t('updateKycDetails'),
    },
    {
      id: 'foreign' as const,
      icon: Coins,
      title: t('foreignCurrency'),
      description: t('foreignCurrencyDesc'),
      details: t('foreignCurrencyDetails'),
    },
    {
      id: 'exchange' as const,
      icon: ArrowLeftRight,
      title: t('moneyExchange'),
      description: t('moneyExchangeDesc'),
      details: t('moneyExchangeDetails'),
    },
    {
      id: 'deposit' as const,
      icon: PiggyBank,
      title: t('depositAboveLimit'),
      description: t('depositAboveLimitDesc'),
      details: t('depositAboveLimitDetails'),
    },
    {
      id: 'statement' as const,
      icon: Printer,
      title: t('statementPrinting'),
      description: t('statementPrintingDesc'),
      details: t('statementPrintingDetails'),
    },
    {
      id: 'chequebook' as const,
      icon: BookOpen,
      title: t('chequeBookRequest'),
      description: t('chequeBookRequestDesc'),
      details: t('chequeBookRequestDetails'),
    },
    {
      id: 'mobile' as const,
      icon: Smartphone,
      title: t('mobilePrestaging'),
      description: t('mobilePrestaging Desc'),
      details: t('mobilePrestaging Details'),
    },
  ];

  const currentService = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-4">
            <img src={rayaLogo} alt="Raya IT" className="h-36 w-auto" />
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tagline')}
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                onClick={() => setSelectedService(service.id)}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Raya IT. {t('tagline')}
          </p>
        </div>
      </footer>

      {currentService && (
        <ServiceModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          serviceType={selectedService}
          icon={currentService.icon}
          title={currentService.title}
          description={currentService.description}
          details={currentService.details}
        />
      )}
    </div>
  );
};

export default Index;
