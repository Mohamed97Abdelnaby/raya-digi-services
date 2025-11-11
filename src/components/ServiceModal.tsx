import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WithdrawalForm } from '@/components/WithdrawalForm';
import { DepositForm } from '@/components/DepositForm';
import { UnifiedServiceForm } from '@/components/UnifiedServiceForm';

type ServiceType = 'withdrawal' | 'kyc' | 'foreign' | 'exchange' | 'deposit' | 'statement' | 'chequebook' | 'mobile' | 'chequeencashment' | null;

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
}

export const ServiceModal = ({
  isOpen,
  onClose,
  serviceType,
  icon: Icon,
  title,
  description,
  details,
}: ServiceModalProps) => {
  const { t } = useLanguage();
  const isWithdrawal = serviceType === 'withdrawal';
  const isDeposit = serviceType === 'deposit';
  const isUnifiedForm = serviceType === 'kyc' || serviceType === 'foreign' || 
                        serviceType === 'exchange' || serviceType === 'statement' || 
                        serviceType === 'chequebook' || serviceType === 'mobile' || 
                        serviceType === 'chequeencashment';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={(isWithdrawal || isDeposit) ? "sm:max-w-[600px]" : "sm:max-w-[500px]"}>
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Icon className="h-10 w-10 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {isWithdrawal ? t('withdrawalRequestTitle') : isDeposit ? t('depositRequestTitle') : title}
          </DialogTitle>
          {!isWithdrawal && !isDeposit && !isUnifiedForm && (
            <DialogDescription className="text-center text-base pt-2">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-4">
          {isWithdrawal ? (
            <WithdrawalForm onClose={onClose} />
          ) : isDeposit ? (
            <DepositForm onClose={onClose} />
          ) : isUnifiedForm ? (
            (() => {
              const isKYC = serviceType === 'kyc';
              const hasWhatsAppOnly = ['foreign', 'exchange', 'statement', 'chequebook', 'mobile', 'chequeencashment'].includes(serviceType);
              
              return (
                <UnifiedServiceForm 
                  serviceName={title} 
                  showScanButton={isKYC}
                  showExitButton={isKYC || hasWhatsAppOnly}
                  showPrintWhatsApp={isKYC}
                  showWhatsAppOnly={hasWhatsAppOnly}
                  onClose={onClose}
                />
              );
            })()
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {details}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
