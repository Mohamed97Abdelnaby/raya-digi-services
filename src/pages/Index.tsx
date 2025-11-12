import { useState } from 'react';
import { Banknote, FileText, Coins, ArrowLeftRight, PiggyBank, Printer, BookOpen, Smartphone, Receipt } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceModal } from '@/components/ServiceModal';
import { toast } from '@/hooks/use-toast';
import rayaLogo from '@/assets/raya-logo-new.png';

type ServiceType = 'withdrawal' | 'kyc' | 'foreign' | 'exchange' | 'deposit' | 'statement' | 'chequebook' | 'mobile' | 'chequeencashment' | null;

const Index = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stateKey, setStateKey] = useState<string | null>(null);

  const getTicketType = (serviceId: ServiceType): string | null => {
    const ticketTypeMap = {
      'withdrawal': 'WithdrawalAboveLimit',
      'kyc': 'UpdateKYC',
      'deposit': 'DepositAboveLimit'
    };
    return ticketTypeMap[serviceId as keyof typeof ticketTypeMap] || null;
  };

  const handleServiceClick = async (serviceId: ServiceType) => {
    const ticketType = getTicketType(serviceId);
    
    // If service doesn't need API call, open modal directly
    if (!ticketType) {
      setSelectedService(serviceId);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://domain:port/api/Ticket/${ticketType}/initiate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.ok && response.status === 200) {
        const data = await response.json();
        
        // Save stateKey for future API requests
        setStateKey(data.stateKey);
        
        // Open the modal
        setSelectedService(serviceId);
      } else {
        // Handle non-200 responses
        toast({
          title: 'Error',
          description: 'Failed to initiate service. Please try again.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: 'Error',
        description: 'Unable to connect to the service. Please check your connection.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    {
      id: 'chequeencashment' as const,
      icon: Receipt,
      title: t('chequeEncashment'),
      description: t('chequeEncashmentDesc'),
      details: t('chequeEncashmentDetails'),
    },
  ];

  const currentService = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <img src={rayaLogo} alt="Raya Information Technology" className="h-20 w-auto" />
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                onClick={() => handleServiceClick(service.id)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-card p-8 shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-lg font-medium text-foreground">
                {t('initiatingService')}
              </p>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by Raya BranchXperience 4.0
          </p>
        </div>
      </footer>

      {currentService && (
        <ServiceModal
          isOpen={!!selectedService}
          onClose={() => {
            setSelectedService(null);
            setStateKey(null);
          }}
          serviceType={selectedService}
          icon={currentService.icon}
          title={currentService.title}
          description={currentService.description}
          details={currentService.details}
          stateKey={stateKey}
        />
      )}
    </div>
  );
};

export default Index;
