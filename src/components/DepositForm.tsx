import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, CheckCircle, Printer, MessageCircle, Info, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { depositSchema, type DepositFormData } from '@/lib/validations/depositSchema';
import { useToast } from '@/hooks/use-toast';

interface DepositFormProps {
  onClose?: () => void;
  stateKey?: string | null;
  onStateKeyUpdate?: (newStateKey: string) => void;
}

export const DepositForm = ({ onClose, stateKey, onStateKeyUpdate }: DepositFormProps = {}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<DepositFormData | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isScanningId, setIsScanningId] = useState(false);
  const [isScanSuccessful, setIsScanSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    mode: 'onChange',
    defaultValues: {
      currency: 'EGP',
    },
  });

  const currency = watch('currency');

  const onSubmit = async (data: DepositFormData) => {
    if (!stateKey) {
      toast({
        title: 'Error',
        description: 'Session state not found. Please close and reopen the form.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `https://domain:port/api/Ticket/DepositAboveLimit/${stateKey}/confirm`,
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
        
        setSubmittedData(data);
        setIsSuccess(true);
        
        toast({
          title: t('submitRequest'),
          description: responseData.message || t('depositSuccess'),
          duration: 5000,
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
    } finally {
      setIsSubmitting(false);
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
    
    const currentValues = watch();
    
    const requestBody = {
      phoneNumber: currentValues.phoneNumber,
      amount: currentValues.amount,
      currency: currentValues.currency
    };
    
    try {
      const response = await fetch(
        `https://domain:port/api/Ticket/DepositAboveLimit/${stateKey}/scan-id`,
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
        `https://domain:port/api/Ticket/DepositAboveLimit/${stateKey}/print`,
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
          description: data.message || 'Print request recorded successfully',
          duration: 3000,
        });
        
        window.print();
        
        setTimeout(() => {
          setShowThankYou(true);
        }, 500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        
        toast({
          title: 'Print Error',
          description: errorData.message || 'Failed to process print request.',
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
    if (!submittedData || !stateKey) return;
    
    try {
      const response = await fetch(
        `https://domain:port/api/Ticket/DepositAboveLimit/${stateKey}/send-WhatsApp`,
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
          description: data.message || 'WhatsApp notification sent successfully',
          duration: 3000,
        });
        
        const message = `
*${t('depositReceipt')}*

${t('depositAmount')}: ${submittedData.amount} ${submittedData.currency}
${t('phoneNumber')}: ${submittedData.phoneNumber}
${t('requestDate')}: ${new Date().toLocaleDateString()}

${t('depositSuccess')}
        `.trim();
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
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
      const response = await fetch(
        `https://domain:port/api/Ticket/DepositAboveLimit/${stateKey}/close-ticket`,
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

  if (isSuccess && submittedData) {
    return (
      <div className="space-y-6">
        {/* Success Icon & Message */}
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="rounded-full bg-primary/10 p-6">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {t('submitRequest')}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {t('depositSuccess')}
            </p>
          </div>
        </div>

        {/* Printable Receipt Section (hidden on screen, shown in print) */}
        <div className="print:block hidden print:mt-8 print:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {t('depositReceipt')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('requestDate')}: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-4 border-t border-b py-4">
            <div className="flex justify-between">
              <span className="font-semibold">{t('depositAmount')}:</span>
              <span>{submittedData.amount} {submittedData.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{t('phoneNumber')}:</span>
              <span>{submittedData.phoneNumber}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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

        {/* Exit Button */}
        {onClose && (
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
      {/* Deposit Amount Field */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="required">
          {t('depositAmount')}
        </Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount')}
              placeholder={t('amountHint')}
              className={errors.amount ? 'border-destructive' : ''}
            />
          </div>
          <Select
            value={currency}
            onValueChange={(value) => setValue('currency', value as 'EGP' | 'USD')}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EGP">EGP</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.amount && (
          <p className="text-sm text-destructive">
            {t(errors.amount.message as string)}
          </p>
        )}
      </div>

      {/* Phone Number Field */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="required">
          {t('phoneNumber')}
        </Label>
        <Input
          id="phoneNumber"
          {...register('phoneNumber')}
          placeholder={t('phoneHint')}
          maxLength={11}
          className={errors.phoneNumber ? 'border-destructive' : ''}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">
            {t(errors.phoneNumber.message as string)}
          </p>
        )}
      </div>

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

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !isValid || !isScanSuccessful}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            {t('submitRequest')}
          </span>
        ) : (
          t('submitRequest')
        )}
      </Button>
    </form>
  );
};
