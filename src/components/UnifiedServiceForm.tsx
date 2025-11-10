import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { unifiedServiceSchema, type UnifiedServiceFormData } from '@/lib/validations/unifiedServiceSchema';

interface UnifiedServiceFormProps {
  serviceName: string;
}

type FormStep = 'form' | 'whatsapp' | 'success';

export const UnifiedServiceForm = ({ serviceName }: UnifiedServiceFormProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<FormStep>('form');
  const [submittedData, setSubmittedData] = useState<UnifiedServiceFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UnifiedServiceFormData>({
    resolver: zodResolver(unifiedServiceSchema),
  });

  const onSubmit = (data: UnifiedServiceFormData) => {
    setSubmittedData(data);
    setCurrentStep('whatsapp');
  };

  const handleWhatsAppShare = () => {
    if (!submittedData) return;

    const message = `
*${serviceName} ${t('serviceRequest')}*

${t('fullName')}: ${submittedData.fullName}
${t('mobileNumber')}: ${submittedData.mobileNumber}
${t('requestDate')}: ${new Date().toLocaleDateString()}

Please process this request at your earliest convenience.
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    setCurrentStep('success');
  };

  // Success View
  if (currentStep === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="rounded-full bg-primary/10 p-6">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h3 className="text-xl font-semibold text-foreground">
            {t('submitRequest')}
          </h3>
          <p className="text-muted-foreground">
            {t('requestSubmittedSuccess')}
          </p>
        </div>
      </div>
    );
  }

  // WhatsApp View
  if (currentStep === 'whatsapp' && submittedData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="rounded-full bg-primary/10 p-4">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <p className="text-center text-foreground font-medium">
            {t('confirmButton')} ✓
          </p>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground">{t('fullName')}:</span>
            <span className="text-sm text-foreground">{submittedData.fullName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground">{t('mobileNumber')}:</span>
            <span className="text-sm text-foreground">{submittedData.mobileNumber}</span>
          </div>
        </div>

        <Button
          onClick={handleWhatsAppShare}
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {t('sendWhatsAppButton')}
        </Button>
      </div>
    );
  }

  // Form View
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name Field */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="required">
          {t('fullName')}
        </Label>
        <Input
          id="fullName"
          {...register('fullName')}
          placeholder={t('fullNameHint')}
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">
            {t(errors.fullName.message as string)}
          </p>
        )}
      </div>

      {/* Mobile Number Field */}
      <div className="space-y-2">
        <Label htmlFor="mobileNumber" className="required">
          {t('mobileNumber')}
        </Label>
        <Input
          id="mobileNumber"
          type="tel"
          {...register('mobileNumber')}
          placeholder={t('mobileNumberHint')}
          maxLength={11}
          className={errors.mobileNumber ? 'border-destructive' : ''}
        />
        {errors.mobileNumber && (
          <p className="text-sm text-destructive">
            {t(errors.mobileNumber.message as string)}
          </p>
        )}
      </div>

      {/* Confirm Button */}
      <Button type="submit" className="w-full">
        {t('confirmButton')}
      </Button>
    </form>
  );
};
