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
  showScanButton?: boolean;
  showExitButton?: boolean;
  showPrintWhatsApp?: boolean;
  showWhatsAppOnly?: boolean;
  onClose?: () => void;
}

export const UnifiedServiceForm = ({ 
  serviceName, 
  showScanButton = false,
  showExitButton = false,
  showPrintWhatsApp = false,
  showWhatsAppOnly = false,
  onClose 
}: UnifiedServiceFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'form' | 'whatsapp' | 'success'>('form');
  const [formData, setFormData] = useState<UnifiedServiceFormData | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UnifiedServiceFormData>({
    resolver: zodResolver(unifiedServiceSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: UnifiedServiceFormData) => {
    setFormData(data);
    toast({
      title: "Successful",
      description: "Your information has been confirmed.",
    });
    setCurrentStep('success');
  };

  const handlePrint = () => {
    window.print();
    
    // Show thank you dialog after a brief delay
    setTimeout(() => {
      setShowThankYou(true);
    }, 500);
  };

  const handleWhatsAppShare = () => {
    if (!formData) return;

    const message = `*${serviceName} ${t('serviceRequest')}*

${t('fullName')}: ${formData.fullName}
${t('mobileNumber')}: ${formData.mobileNumber}
${t('requestDate')}: ${new Date().toLocaleDateString()}

${t('kycSuccess')}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show thank you dialog after a brief delay
    setTimeout(() => {
      setShowThankYou(true);
    }, 500);
  };

  if (currentStep === 'success') {
    return (
      <div className="space-y-6">
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
            onClick={onClose}
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
            disabled={!isValid}
          >
            <Camera className="mr-2 h-4 w-4" />
            {t('scanNationalId')}
          </Button>
        </>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting || !isValid}
      >
        {t('confirmButton')}
      </Button>
    </form>
  );
};
