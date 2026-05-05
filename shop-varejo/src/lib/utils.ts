/**
 * @file src/lib/utils.ts
 * @description Utilitários globais.
 */

/** Combina classes Tailwind de forma segura (substitui clsx + twMerge) */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Formata centavos para Real Brasileiro */
export function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
  }).format(cents / 100);
}

/**
 * Copia texto para o clipboard com fallback para navegadores antigos ou contextos não seguros (HTTP).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Tenta usar a Clipboard API moderna
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Falha ao usar Clipboard API:', err);
    }
  }

  // Fallback: usar textarea temporário
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Evita scroll para o final da página
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Falha no fallback do Clipboard:', err);
    return false;
  }
}
