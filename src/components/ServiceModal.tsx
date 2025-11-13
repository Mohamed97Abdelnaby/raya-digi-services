import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
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
  stateKey?: string | null;
}

export const ServiceModal = ({
  isOpen,
  onClose,
  serviceType,
  icon: Icon,
  title,
  description,
  details,
  stateKey,
}: ServiceModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStateKey, setCurrentStateKey] = useState<string | null>(stateKey || null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    setCurrentStateKey(stateKey || null);
  }, [stateKey]);

  const handleStateKeyUpdate = (newStateKey: string) => {
    setCurrentStateKey(newStateKey);
    console.log('StateKey updated:', newStateKey);
  };

  const handleFormSubmission = () => {
    setIsFormSubmitted(true);
  };

  const handleDialogClose = async (open: boolean) => {
    // If trying to close the dialog (open = false)
    if (!open) {
      // Only apply API logic to the 3 main services that have been submitted
      if (isFormSubmitted && currentStateKey) {
        const isWithdrawal = serviceType === 'withdrawal';
        const isDeposit = serviceType === 'deposit';
        const isKYC = serviceType === 'kyc';

        if (isWithdrawal || isDeposit || isKYC) {
          setIsClosing(true);
          
          try {
            // Determine the correct TicketType
            let ticketType = '';
            if (isWithdrawal) ticketType = 'WithdrawalAboveLimit';
            else if (isDeposit) ticketType = 'DepositAboveLimit';
            else if (isKYC) ticketType = 'UpdateKYC';
            
            const response = await fetch(
              `https://domain:port/api/Ticket/${ticketType}/${currentStateKey}/close-ticket`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            
            if (response.ok && response.status === 200) {
              const data = await response.json();
              
              toast({
                title: 'Success',
                description: data.message || 'Ticket closed successfully',
                duration: 3000,
              });
              
              // Now close the modal
              onClose();
            } else {
              const errorData = await response.json().catch(() => ({}));
              
              toast({
                title: 'Close Error',
                description: errorData.message || 'Failed to close ticket.',
                variant: 'destructive',
                duration: 5000,
              });
              // Don't close the modal on error
            }
          } catch (error) {
            console.error('Close Ticket API Error:', error);
            
            toast({
              title: 'Connection Error',
              description: 'Unable to connect to the service.',
              variant: 'destructive',
              duration: 5000,
            });
            // Don't close the modal on error
          } finally {
            setIsClosing(false);
          }
          return;
        }
      }
      
      // For other services or not submitted, close directly
      onClose();
    }
  };
  
  const isWithdrawal = serviceType === 'withdrawal';
  const isDeposit = serviceType === 'deposit';
  const isUnifiedForm = serviceType === 'kyc' || serviceType === 'foreign' || 
                        serviceType === 'exchange' || serviceType === 'statement' || 
                        serviceType === 'chequebook' || serviceType === 'mobile' || 
                        serviceType === 'chequeencashment';

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
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
            <WithdrawalForm 
              onClose={onClose} 
              stateKey={currentStateKey} 
              onStateKeyUpdate={handleStateKeyUpdate}
              onFormSubmitted={handleFormSubmission}
            />
          ) : isDeposit ? (
            <DepositForm 
              onClose={onClose} 
              stateKey={currentStateKey} 
              onStateKeyUpdate={handleStateKeyUpdate}
              onFormSubmitted={handleFormSubmission}
            />
          ) : isUnifiedForm ? (
            (() => {
              const isKYC = serviceType === 'kyc';
              const hasWhatsAppOnly = ['foreign', 'exchange', 'statement', 'chequebook', 'mobile', 'chequeencashment'].includes(serviceType);
              
              return (
                <UnifiedServiceForm 
                  serviceName={title}
                  serviceType={serviceType}
                  showScanButton={isKYC}
                  showExitButton={isKYC}
                  showPrintWhatsApp={isKYC}
                  showWhatsAppOnly={hasWhatsAppOnly}
                  onClose={onClose}
                  stateKey={currentStateKey}
                  onStateKeyUpdate={handleStateKeyUpdate}
                  onFormSubmitted={handleFormSubmission}
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
