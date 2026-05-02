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
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.ok) {
        redirect('/');
      }
    } catch {
      // Token inválido, permite acesso às páginas de auth
    }
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}