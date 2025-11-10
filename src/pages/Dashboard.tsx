import { useState } from 'react';
import { PiggyBank, FileText, BookOpen, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceModal } from '@/components/ServiceModal';

type DashboardServiceType = 'deposit' | 'statement' | 'cheque' | 'mobile' | null;

const Dashboard = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<DashboardServiceType>(null);

  const services = [
    {
      id: 'deposit' as const,
      icon: PiggyBank,
      title: t('depositAboveLimit'),
      description: t('depositAboveLimitDesc'),
      details: t('depositAboveLimitDetails'),
    },
    {
      id: 'statement' as const,
      icon: FileText,
      title: t('statementPrinting'),
      description: t('statementPrintingDesc'),
      details: t('statementPrintingDetails'),
    },
    {
      id: 'cheque' as const,
      icon: BookOpen,
      title: t('chequeBookRequest'),
      description: t('chequeBookRequestDesc'),
      details: t('chequeBookRequestDetails'),
    },
    {
      id: 'mobile' as const,
      icon: Smartphone,
      title: t('mobilePrestaging'),
      description: t('mobilePrestatingDesc'),
      details: t('mobilePrestatingDetails'),
    },
  ];

  const currentService = services.find((s) => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/raya-logo.png" 
              alt="Raya IT" 
              className="h-12 w-auto"
            />
          </div>
          <LanguageToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Page Title */}
          <div className="mb-12 text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t('bankingActions')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t('bankingActionsTagline')}
            </p>
          </div>

          {/* Services Grid */}
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

      {/* Footer */}
      <footer className="mt-20 border-t bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            {t('footer')}
          </p>
        </div>
      </footer>

      {/* Service Modal */}
      {currentService && (
        <ServiceModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          serviceType={null}
          icon={currentService.icon}
          title={currentService.title}
          description={currentService.description}
          details={currentService.details}
        />
      )}
    </div>
  );
};

export default Dashboard;
