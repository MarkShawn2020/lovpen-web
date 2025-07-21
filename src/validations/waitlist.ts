import { z } from 'zod';

export const waitlistStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const waitlistSubmitSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  name: z
    .string()
    .min(1, '姓名不能为空')
    .max(100, '姓名不能超过100个字符'),
  company: z
    .string()
    .max(100, '公司名称不能超过100个字符')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? null : val),
  useCase: z
    .string()
    .max(500, '使用场景描述不能超过500个字符')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? null : val),
  source: z
    .string()
    .min(1, '来源不能为空')
    .max(50, '来源不能超过50个字符'),
});

export const waitlistUpdateSchema = z.object({
  status: waitlistStatusSchema.optional(),
  priority: z.number().int().optional(),
  notes: z
    .string()
    .max(1000, '备注不能超过1000个字符')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? null : val),
});

export const waitlistListParamsSchema = z.object({
  page: z
    .string()
    .transform(val => Number.parseInt(val, 10))
    .pipe(z.number().int().min(1))
    .default('1'),
  size: z
    .string()
    .transform(val => Number.parseInt(val, 10))
    .pipe(z.number().int().min(1).max(100))
    .default('10'),
  status_filter: waitlistStatusSchema.optional(),
  search: z.string().optional(),
});

export const waitlistIdSchema = z.object({
  waitlist_id: z
    .string()
    .transform(val => Number.parseInt(val, 10))
    .pipe(z.number().int().positive()),
});

// Type exports
export type WaitlistSubmitInput = z.infer<typeof waitlistSubmitSchema>;
export type WaitlistUpdateInput = z.infer<typeof waitlistUpdateSchema>;
export type WaitlistListParams = z.infer<typeof waitlistListParamsSchema>;
export type WaitlistIdParams = z.infer<typeof waitlistIdSchema>;
