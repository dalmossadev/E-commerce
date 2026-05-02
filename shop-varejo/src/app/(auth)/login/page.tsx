'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-text">Entrar</h2>
          <p className="mt-2 text-sm text-brand-muted">
            Faça login na sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-900/50 p-4 border border-red-500">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-text">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-brand-border bg-brand-surface px-3 py-2 text-brand-text
                           focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary
                           disabled:bg-brand-surface-2 disabled:cursor-not-allowed placeholder:text-brand-muted"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-text">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-brand-border bg-brand-surface px-3 py-2 text-brand-text
                           focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary
                           disabled:bg-brand-surface-2 disabled:cursor-not-allowed placeholder:text-brand-muted"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm
                       text-sm font-medium text-brand-background bg-brand-primary hover:bg-brand-neon-dim focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-brand-muted">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-medium text-brand-primary hover:text-brand-neon-dim">
              Cadastrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}