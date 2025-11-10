import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { unifiedServiceSchema, UnifiedServiceFormData } from '@/lib/validations/unifiedServiceSchema';

interface UnifiedServiceFormProps {
  serviceName: string;
}

export const UnifiedServiceForm = ({ serviceName }: UnifiedServiceFormProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'form' | 'whatsapp' | 'success'>('form');
  const [formData, setFormData] = useState<UnifiedServiceFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UnifiedServiceFormData>({
    resolver: zodResolver(unifiedServiceSchema),
  });

  const onSubmit = (data: UnifiedServiceFormData) => {
    setFormData(data);
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
  };

  if (currentStep === 'success') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <p className="text-center text-lg font-medium text-foreground">
          {t('requestSubmittedSuccess')}
        </p>
      </div>
    );
  }

  if (currentStep === 'whatsapp' && formData) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">{t('fullName')}:</span>
            <span className="text-foreground">{formData.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">{t('mobileNumber')}:</span>
            <span className="text-foreground">{formData.mobileNumber}</span>
          </div>
        </div>
        <Button
          onClick={handleSendWhatsApp}
          className="w-full"
          size="lg"
        >
          {t('sendWhatsAppButton')}
        </Button>
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
