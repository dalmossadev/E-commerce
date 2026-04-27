/**
 * @file src/components/ui/ImageWithFallback.tsx
 * @description next/image com fallback automático em caso de erro.
 *
 * Se a imagem do produto não existir, exibe placeholder visual
 * sem quebrar a aplicação (Graceful Degradation).
 */
'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { Package } from 'lucide-react';

type Props = Omit<ImageProps, 'onError'> & {
  fallbackLabel?: string;
};

export function ImageWithFallback({ fallbackLabel = 'Imagem indisponível', alt, ...props }: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        role="img"
        aria-label={fallbackLabel}
        className="w-full h-full flex flex-col items-center justify-center
                   bg-brand-surface-2 text-brand-muted gap-2"
      >
        <Package size={40} className="opacity-30" aria-hidden="true" />
        <span className="text-xs font-mono opacity-50">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
