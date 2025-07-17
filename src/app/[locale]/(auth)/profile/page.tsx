import { setRequestLocale } from 'next-intl/server';
import { ProfileForm } from '@/components/profile/ProfileForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">个人资料</h1>
          <p className="text-gray-600">
            管理您的个人信息、头像和API凭证
          </p>
        </div>
        
        <ProfileForm />
      </div>
    </div>
  );
}
