import { z } from 'zod';

// Login form validation schema based on OpenAPI OAuth2PasswordRequestForm
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, '用户名不能为空')
    .min(3, '用户名至少需要3个字符')
    .max(50, '用户名不能超过50个字符')
    .regex(/^\w+$/, '用户名只能包含字母、数字和下划线'),
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
    .min(1, '邮箱不能为空')
    .email('请输入有效的邮箱地址')
    .max(100, '邮箱不能超过100个字符'),
  password: z
    .string()
    .min(1, '密码不能为空')
    .min(6, '密码至少需要6个字符')
    .max(100, '密码不能超过100个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大写字母、小写字母和数字'),
  phone: z
    .string()
    .optional()
    .refine(phone => !phone || /^1[3-9]\d{9}$/.test(phone), '请输入有效的手机号码'),
  full_name: z
    .string()
    .max(100, '姓名不能超过100个字符')
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
