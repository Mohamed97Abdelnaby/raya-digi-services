import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
}

export const UnifiedServiceForm = ({ serviceName }: UnifiedServiceFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'form' | 'whatsapp' | 'success'>('form');
  const [formData, setFormData] = useState<UnifiedServiceFormData | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UnifiedServiceFormData>({
    resolver: zodResolver(unifiedServiceSchema),
  });

  const onSubmit = (data: UnifiedServiceFormData) => {
    setFormData(data);
    toast({
      title: "Successful",
      description: "Your information has been confirmed.",
    });
    setCurrentStep('whatsapp');
  };

  const handleSendWhatsApp = () => {
    if (!formData) return;

    const message = `*${serviceName} ${t('serviceRequest')}*

${t('fullName')}: ${formData.fullName}
${t('mobileNumber')}: ${formData.mobileNumber}
${t('requestDate')}: ${new Date().toLocaleDateString()}

Please process this request at your earliest convenience.`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setCurrentStep('success');
    
    // Show thank you dialog after a brief delay
    setTimeout(() => {
      setShowThankYou(true);
    }, 500);
  };

  if (currentStep === 'success') {
    return (
      <>
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <p className="text-center text-lg font-medium text-foreground">
            {t('requestSubmittedSuccess')}
          </p>
        </div>

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
      </>
    );
  }

  if (currentStep === 'whatsapp' && formData) {
    return (
      <Button
        onClick={handleSendWhatsApp}
        className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
        size="lg"
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        {t('sendWhatsAppButton')}
      </Button>
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

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {t('confirmButton')}
      </Button>
    </form>
  );
};
