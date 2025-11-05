import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, CheckCircle } from 'lucide-react';
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

export const WithdrawalForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      currency: 'EGP',
    },
  });

  const currency = watch('currency');

  const onSubmit = async (data: WithdrawalFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: t('submitRequest'),
      description: t('withdrawalSuccess'),
      duration: 5000,
    });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
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

      {/* Scan National ID Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
      >
        <Camera className="mr-2 h-4 w-4" />
        {t('scanNationalId')}
      </Button>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
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
