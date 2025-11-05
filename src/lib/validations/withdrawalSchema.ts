import { z } from 'zod';

export const withdrawalSchema = z.object({
  amount: z
    .string()
    .min(1, 'fieldRequired')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'invalidAmount',
    }),
  currency: z.enum(['EGP', 'USD']),
  phoneNumber: z
    .string()
    .min(1, 'fieldRequired')
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, 'invalidPhone'),
});

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;
