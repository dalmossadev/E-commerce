/**
 * @file src/components/ui/Button.tsx
 * @description Componente de botão polimórfico com variantes.
 *
 * Princípio SOLID aplicado:
 *   - SRP: só renderiza botão
 *   - OCP: novas variantes via prop, sem alterar código existente
 *   - LSP: 'as' prop permite usar como <a>, <button>, etc.
 *
 * @example
 *   <Button variant="primary" size="lg" onClick={fn}>Comprar</Button>
 *   <Button variant="outline" as="a" href="https://wa.me/...">WhatsApp</Button>
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Tipos ──────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize    = 'sm' | 'md' | 'lg';

type BaseProps = {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  fullWidth?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  children:   React.ReactNode;
  className?: string;
};

// Polimorfismo: aceita qualquer tag HTML
type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: 'button';
    href?: never;
  };

type ButtonAsAnchor = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as:   'a';
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

// ── Estilos por variante ───────────────────────────────────────────

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-brand-background border-2 border-brand-primary ' +
    'hover:bg-transparent hover:text-brand-primary ' +
    'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black ' +
    'shadow-neon-sm hover:shadow-neon active:scale-95',

  outline:
    'bg-transparent text-brand-primary border-2 border-brand-primary ' +
    'hover:bg-brand-primary hover:text-brand-background ' +
    'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black ' +
    'hover:shadow-neon active:scale-95',

  ghost:
    'bg-transparent text-brand-text border-2 border-brand-border ' +
    'hover:border-brand-primary hover:text-brand-primary ' +
    'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black',

  danger:
    'bg-red-600 text-white border-2 border-red-600 ' +
    'hover:bg-transparent hover:text-red-400 hover:border-red-400 ' +
    'focus-visible:ring-2 focus-visible:ring-red-500',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm:  'px-3 py-1.5 text-xs gap-1.5',
  md:  'px-5 py-2.5 text-sm gap-2',
  lg:  'px-7 py-3.5 text-base gap-2.5',
};

// ── Componente ─────────────────────────────────────────────────────

export function Button({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  as,
  ...rest
}: ButtonProps) {

  const baseClass = cn(
    // Base
    'inline-flex items-center justify-center',
    'font-display font-bold tracking-wider uppercase',
    'transition-all duration-200',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none',
    // Responsivo: full width no mobile
    fullWidth ? 'w-full' : 'w-full sm:w-auto',
    // Variante e tamanho
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  );

  const content = (
    <>
      {loading
        ? <Loader2 className="animate-spin" size={16} aria-hidden="true" />
        : leftIcon && <span aria-hidden="true">{leftIcon}</span>
      }
      <span>{children}</span>
      {!loading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </>
  );

  if (as === 'a') {
    const { href, target, rel, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? `noreferrer noopener ${rel ?? ''}`.trim() : rel}
        className={baseClass}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { disabled, type = 'button', ...btnRest } =
    rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={baseClass}
      {...btnRest}
    >
      {content}
    </button>
  );
}
