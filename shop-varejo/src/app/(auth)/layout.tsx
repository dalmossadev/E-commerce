import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('__session')?.value;

  if (sessionToken) {
    redirect('/');
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}