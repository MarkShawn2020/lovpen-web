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
  bio: z
    .string()
    .max(500, '个人简介不能超过500个字符')
    .nullable()
    .optional(),
  website: z
    .string()
    .url('请输入有效的网址')
    .nullable()
    .optional(),
  location: z
    .string()
    .max(100, '所在地不能超过100个字符')
    .nullable()
    .optional(),
  birthday: z
    .string()
    .nullable()
    .optional(),
  gender: z
    .string()
    .max(20, '性别不能超过20个字符')
    .nullable()
    .optional(),
  occupation: z
    .string()
    .max(100, '职业不能超过100个字符')
    .nullable()
    .optional(),
  company: z
    .string()
    .max(100, '公司不能超过100个字符')
    .nullable()
    .optional(),
  github_username: z
    .string()
    .max(50, 'GitHub用户名不能超过50个字符')
    .nullable()
    .optional(),
  twitter_username: z
    .string()
    .max(50, 'Twitter用户名不能超过50个字符')
    .nullable()
    .optional(),
  linkedin_url: z
    .string()
    .url('请输入有效的LinkedIn链接')
    .nullable()
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// User preferences validation schema
export const userPreferencesSchema = z.object({
  language: z
    .string()
    .max(10, '语言代码不能超过10个字符')
    .nullable()
    .optional(),
  timezone: z
    .string()
    .max(50, '时区不能超过50个字符')
    .nullable()
    .optional(),
  theme: z
    .string()
    .max(20, '主题不能超过20个字符')
    .nullable()
    .optional(),
});

export type UserPreferencesFormData = z.infer<typeof userPreferencesSchema>;
