import { z } from 'zod';

// Login form validation schema based on OpenAPI LoginRequest
export const loginSchema = z.object({
  username_or_email: z
    .string()
    .min(1, '用户名或邮箱不能为空')
    .min(3, '用户名或邮箱至少需要3个字符')
    .max(100, '用户名或邮箱不能超过100个字符'),
  password: z
    .string()
    .min(1, '密码不能为空')
    .min(6, '密码至少需要6个字符')
    .max(100, '密码不能超过100个字符'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration form validation schema based on OpenAPI UserCreate
export const registerSchema = z.object({
  username: z
    .string()
    .min(1, '用户名不能为空')
    .min(3, '用户名至少需要3个字符')
    .max(50, '用户名不能超过50个字符')
    .regex(/^\w+$/, '用户名只能包含字母、数字和下划线'),
  email: z
    .string()
    .email('请输入有效的邮箱地址')
    .max(100, '邮箱不能超过100个字符')
    .nullable()
    .optional(),
  password: z
    .string()
    .min(6, '密码至少需要6个字符')
    .max(100, '密码不能超过100个字符')
    .nullable()
    .optional(),
  phone: z
    .string()
    .max(20, '手机号码不能超过20个字符')
    .nullable()
    .optional(),
  full_name: z
    .string()
    .max(100, '姓名不能超过100个字符')
    .nullable()
    .optional(),
  oauth_provider: z
    .string()
    .nullable()
    .optional(),
  oauth_id: z
    .string()
    .nullable()
    .optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// OAuth login schema
export const oauthLoginSchema = z.object({
  provider: z.enum(['google', 'github', 'wechat'], {
    required_error: '请选择登录方式',
  }),
  token: z.string().min(1, '授权令牌不能为空'),
});

export type OAuthLoginData = z.infer<typeof oauthLoginSchema>;

// Profile form validation schema based on OpenAPI UserProfileUpdate
export const profileSchema = z.object({
  full_name: z
    .string()
    .max(100, '姓名不能超过100个字符')
    .nullable()
    .optional(),
  email: z
    .string()
    .email('请输入有效的邮箱地址')
    .max(100, '邮箱不能超过100个字符')
    .nullable()
    .optional(),
  phone: z
    .string()
    .max(20, '手机号码不能超过20个字符')
    .nullable()
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
