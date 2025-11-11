import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, CheckCircle, Printer, MessageCircle, Info, X } from 'lucide-react';
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
import { withdrawalSchema, type WithdrawalFormData } from '@/lib/validations/withdrawalSchema';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WithdrawalFormProps {
  onClose?: () => void;
}

export const WithdrawalForm = ({ onClose }: WithdrawalFormProps = {}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<WithdrawalFormData | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    mode: 'onChange',
    defaultValues: {
      currency: 'EGP',
    },
  });

  const currency = watch('currency');

  const onSubmit = async (data: WithdrawalFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSubmittedData(data);
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: t('submitRequest'),
      description: t('withdrawalSuccess'),
      duration: 5000,
    });
  };

  const handlePrint = () => {
    window.print();
    
    // Show thank you dialog after a brief delay
    setTimeout(() => {
      setShowThankYou(true);
    }, 500);
  };

  const handleWhatsAppShare = () => {
    if (!submittedData) return;
    
    const message = `
*${t('withdrawalReceipt')}*

${t('withdrawalAmount')}: ${submittedData.amount} ${submittedData.currency}
${t('phoneNumber')}: ${submittedData.phoneNumber}
${t('requestDate')}: ${new Date().toLocaleDateString()}

${t('withdrawalSuccess')}
    `.trim();
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Show thank you dialog after a brief delay
    setTimeout(() => {
      setShowThankYou(true);
    }, 500);
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
              {t('withdrawalSuccess')}
            </p>
          </div>
        </div>

        {/* Printable Receipt Section (hidden on screen, shown in print) */}
        <div className="print:block hidden print:mt-8 print:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {t('withdrawalReceipt')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('requestDate')}: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-4 border-t border-b py-4">
            <div className="flex justify-between">
              <span className="font-semibold">{t('withdrawalAmount')}:</span>
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
      {/* Withdrawal Amount Field */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="required">
          {t('withdrawalAmount')}
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
        disabled={!isValid}
      >
        <Camera className="mr-2 h-4 w-4" />
        {t('scanNationalId')}
      </Button>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !isValid}
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
