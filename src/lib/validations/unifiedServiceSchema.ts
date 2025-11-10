import { z } from 'zod';

export const unifiedServiceSchema = z.object({
  fullName: z
    .string()
    .min(1, 'fieldRequired')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  mobileNumber: z
    .string()
    .min(1, 'fieldRequired')
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, 'invalidPhone'),
});

export type UnifiedServiceFormData = z.infer<typeof unifiedServiceSchema>;
