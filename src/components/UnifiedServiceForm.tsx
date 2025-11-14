import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, MessageCircle, Camera, Info, X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { unifiedServiceSchema, UnifiedServiceFormData } from '@/lib/validations/unifiedServiceSchema';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/apiConfig';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UnifiedServiceFormProps {
  serviceName: string;
  serviceType?: string;
  showScanButton?: boolean;
  showExitButton?: boolean;
  showPrintWhatsApp?: boolean;
  showWhatsAppOnly?: boolean;
  onClose?: () => void;
  stateKey?: string | null;
  onStateKeyUpdate?: (newStateKey: string) => void;
  onFormSubmitted?: () => void;
}

const getInTicketType = (serviceType?: string): string | null => {
  const ticketTypeMap: Record<string, string> = {
    'foreign': 'ForeignCurrencyWithdrawal',
    'exchange': 'MoneyExchange',
    'statement': 'StatementPrinting',
    'chequebook': 'ChequeBookRequest',
    'mobile': 'MobilePrestaging',
    'chequeencashment': 'ChequeEncashment'
  };
  return serviceType ? (ticketTypeMap[serviceType] || null) : null;
};

export const UnifiedServiceForm = ({ 
  serviceName,
  serviceType,
  showScanButton = false,
  showExitButton = false,
  showPrintWhatsApp = false,
  showWhatsAppOnly = false,
  onClose,
  stateKey,
  onStateKeyUpdate,
  onFormSubmitted
}: UnifiedServiceFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'form' | 'whatsapp' | 'success'>('form');
  const [formData, setFormData] = useState<UnifiedServiceFormData | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isScanningId, setIsScanningId] = useState(false);
  const [isScanSuccessful, setIsScanSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<UnifiedServiceFormData>({
    resolver: zodResolver(unifiedServiceSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: UnifiedServiceFormData) => {
    // For WhatsApp-only services (the 6 services), call initiate API
    if (showWhatsAppOnly) {
      const ticketType = getInTicketType(serviceType);
      
      if (!ticketType) {
        toast({
          title: 'Error',
          description: 'Invalid service type.',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }
      
      try {
        const requestBody = {
          fullName: data.fullName,
          phoneNumber: data.mobileNumber
        };
        
        const response = await fetch(
          getApiUrl(`/api/InTicket/${ticketType}/initiate`),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          }
        );
        
        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          console.log('Initiate Response:', responseData);
          
          // Save stateKey for future API requests
        if (responseData.stateKey && onStateKeyUpdate) {
          onStateKeyUpdate(responseData.stateKey);
        }
        
        // Notify ServiceModal that form was submitted
        if (onFormSubmitted) {
          onFormSubmitted();
        }
        
        // Move to success page
        setFormData(data);
        setCurrentStep('success');
          
          toast({
            title: "Successful",
            description: responseData.message || "Your request has been initiated.",
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          
          toast({
            title: 'Initiation Failed',
            description: errorData.message || 'Failed to initiate request. Please try again.',
            variant: 'destructive',
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Initiate API Error:', error);
        
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the service. Please check your connection.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } else {
      // Existing KYC logic (confirm API)
      if (!stateKey) {
        toast({
          title: 'Error',
          description: 'Session state not found. Please close and reopen the form.',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }

      try {
        const response = await fetch(
          getApiUrl(`/api/Ticket/UpdateKYC/${stateKey}/confirm`),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (response.ok && response.status === 200) {
          const responseData = await response.json();
          console.log('Confirm Response:', responseData);
          
        if (responseData.stateKey && onStateKeyUpdate) {
          onStateKeyUpdate(responseData.stateKey);
        }
        
        // Notify ServiceModal that form was submitted (KYC only)
        if (onFormSubmitted) {
          onFormSubmitted();
        }
        
        setFormData(data);
        setCurrentStep('success');
          
          toast({
            title: "Successful",
            description: responseData.message || "Your information has been confirmed.",
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          
          toast({
            title: 'Confirmation Failed',
            description: errorData.message || 'Failed to confirm request. Please try again.',
            variant: 'destructive',
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Confirm API Error:', error);
        
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the service. Please check your connection.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    }
  };

  const handleScanNationalId = async () => {
    if (!stateKey) {
      toast({
        title: 'Error',
        description: 'Session state not found. Please close and reopen the form.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    setIsScanningId(true);
    setIsScanSuccessful(false);
    
    const fullName = watch('fullName');
    const mobileNumber = watch('mobileNumber');
    
    const requestBody = {
      phoneNumber: mobileNumber,
      fullName: fullName
    };
    
    try {
      const response = await fetch(
        getApiUrl(`/api/Ticket/UpdateKYC/${stateKey}/scan-id`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
      
      if (response.ok && response.status === 200) {
        const data = await response.json();
        console.log('Scan National ID Response:', data);
        
        if (data.stateKey && onStateKeyUpdate) {
          onStateKeyUpdate(data.stateKey);
        }
        
        setIsScanSuccessful(true);
        
        toast({
          title: t('scanSuccess'),
          description: data.message || 'National ID scanned successfully',
          duration: 3000,
        });
      } else {
        setIsScanSuccessful(false);
        
        const errorData = await response.json().catch(() => ({}));
        
        toast({
          title: 'Scan Failed',
          description: errorData.message || 'Failed to scan National ID. Please try again.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Scan National ID Error:', error);
      
      setIsScanSuccessful(false);
      
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the scanning service. Please check your connection.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsScanningId(false);
    }
  };

  const handlePrint = async () => {
    if (!stateKey) return;
    
    try {
      const response = await fetch(
        getApiUrl(`/api/Ticket/UpdateKYC/${stateKey}/print`),
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
          title: '✅ Print Request Recorded',
          description: data.message || 'Printing receipt... A print dialog will appear.',
          duration: 3000,
        });
        
        window.print();
        
        setTimeout(() => {
          setShowThankYou(true);
        }, 500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        
        toast({
          title: '❌ Print Failed',
          description: errorData.message || 'Failed to print ticket. Please try again.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Print API Error:', error);
      
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the service.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  const handleWhatsAppShare = async () => {
    if (!formData || !stateKey) return;

    try {
      let apiEndpoint = '';
      
      if (showWhatsAppOnly) {
        const ticketType = getInTicketType(serviceType);
        
        if (!ticketType) {
          toast({
            title: 'Error',
            description: 'Invalid service type.',
            variant: 'destructive',
            duration: 3000,
          });
          return;
        }
        
        apiEndpoint = getApiUrl(`/api/InTicket/${ticketType}/${stateKey}/send-msg-whatsapp`);
      } else {
        // KYC service
        apiEndpoint = getApiUrl(`/api/Ticket/UpdateKYC/${stateKey}/send-WhatsApp`);
      }
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok && response.status === 200) {
        const data = await response.json();
        
        toast({
          title: 'Success',
          description: data.message || 'WhatsApp notification sent successfully',
          duration: 3000,
        });
        
        const message = `*${serviceName} ${t('serviceRequest')}*

${t('fullName')}: ${formData.fullName}
${t('mobileNumber')}: ${formData.mobileNumber}
${t('requestDate')}: ${new Date().toLocaleDateString()}

${t('kycSuccess')}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        setTimeout(() => {
          setShowThankYou(true);
        }, 500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        
        toast({
          title: 'WhatsApp Error',
          description: errorData.message || 'Failed to send WhatsApp notification.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('WhatsApp API Error:', error);
      
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the service.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  const handleClose = async () => {
    if (!stateKey || !onClose) return;
    
    try {
      let apiEndpoint = '';
      
      if (showWhatsAppOnly) {
        const ticketType = getInTicketType(serviceType);
        
        if (!ticketType) {
          // If we can't determine ticket type, just close without API call
          onClose();
          return;
        }
        
        apiEndpoint = getApiUrl(`/api/InTicket/${ticketType}/${stateKey}/close-ticket`);
      } else {
        // KYC service
        apiEndpoint = getApiUrl(`/api/Ticket/UpdateKYC/${stateKey}/close-ticket`);
      }
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok && response.status === 200) {
        const data = await response.json();
        
        toast({
          title: 'Success',
          description: data.message || 'Ticket closed successfully',
          duration: 3000,
        });
        
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        
        toast({
          title: 'Close Error',
          description: errorData.message || 'Failed to close ticket.',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Close Ticket API Error:', error);
      
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the service.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  if (currentStep === 'success') {
    return (
      <div className="printable-receipt space-y-6">
        {/* Success Icon & Message */}
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="rounded-full bg-primary/10 p-6">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {showPrintWhatsApp ? t('kycConfirmTitle') : t('confirmRequest')}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {showPrintWhatsApp ? t('kycSuccess') : t('requestSubmittedSuccess')}
            </p>
          </div>
        </div>

        {/* Printable Receipt Section (hidden on screen, shown in print) */}
        {showPrintWhatsApp && formData && (
          <div className="print:block hidden print:mt-8 print:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {serviceName} {t('serviceRequest')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('requestDate')}: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-4 border-t border-b py-4">
              <div className="flex justify-between">
                <span className="font-semibold">{t('fullName')}:</span>
                <span>{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">{t('mobileNumber')}:</span>
                <span>{formData.mobileNumber}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Show Print + WhatsApp for KYC */}
        {showPrintWhatsApp && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="w-full"
            >
              <Printer className="mr-2 h-4 w-4" />
              {t('printForm')}
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t('sendWhatsApp')}
            </Button>
          </div>
        )}

        {/* WhatsApp Only Button - Full Width for other services */}
        {showWhatsAppOnly && (
          <div className="pt-4">
            <Button
              onClick={handleWhatsAppShare}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t('sendWhatsApp')}
            </Button>
          </div>
        )}

        {/* Exit Button */}
        {showExitButton && onClose && (
          <Button
            onClick={handleClose}
            variant="outline"
            className="w-full mt-4"
          >
            <X className="mr-2 h-4 w-4" />
            {t('exitButton')}
          </Button>
        )}

        {/* Thank You Dialog */}
        <AlertDialog open={showThankYou} onOpenChange={setShowThankYou}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl">
                {t('thankYouTitle')}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-lg pt-4">
                {t('thankYouMessage')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowThankYou(false)} className="w-full">
                {t('closeButton')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t('fullName')}</Label>
        <Input
          id="fullName"
          type="text"
          placeholder={t('fullNameHint')}
          {...register('fullName')}
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">
            {t(errors.fullName.message as string)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobileNumber">{t('mobileNumber')}</Label>
        <Input
          id="mobileNumber"
          type="tel"
          placeholder={t('mobileNumberHint')}
          {...register('mobileNumber')}
          className={errors.mobileNumber ? 'border-destructive' : ''}
        />
        {errors.mobileNumber && (
          <p className="text-sm text-destructive">
            {t(errors.mobileNumber.message as string)}
          </p>
        )}
      </div>

      {showScanButton && (
        <>
          {/* National ID Scanner Instruction */}
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              {t('scanIdInstruction')}
            </AlertDescription>
          </Alert>

          {/* Scan National ID Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={!isValid || isScanningId}
            onClick={handleScanNationalId}
          >
            {isScanningId ? (
              <>
                <span className="h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                {t('scanningId')}
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                {t('scanNationalId')}
              </>
            )}
          </Button>
        </>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting || !isValid || (showScanButton && !isScanSuccessful)}
      >
        {t('confirmButton')}
      </Button>
    </form>
  );
};
