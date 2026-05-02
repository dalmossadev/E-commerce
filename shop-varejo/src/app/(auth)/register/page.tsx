'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        } as RegisterDTO),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta');
        setIsLoading(false);
        return;
      }

      const result = await login(email, password);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Erro de conexão');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-text">Criar Conta</h2>
          <p className="mt-2 text-sm text-brand-muted">
            Cadastre-se no Sisters Lab
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
              <label htmlFor="name" className="block text-sm font-medium text-brand-text">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-brand-border bg-brand-surface px-3 py-2 text-brand-text
                           focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary
                           disabled:bg-brand-surface-2 disabled:cursor-not-allowed placeholder:text-brand-muted"
                placeholder="Seu nome"
              />
            </div>

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-brand-border bg-brand-surface px-3 py-2 text-brand-text
                           focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary
                           disabled:bg-brand-surface-2 disabled:cursor-not-allowed placeholder:text-brand-muted"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-text">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <p className="text-center text-sm text-brand-muted">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-medium text-brand-primary hover:text-brand-neon-dim">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}