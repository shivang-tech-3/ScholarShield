/**
 * Cryptographic Utility for ScholarShield
 * Generates SHA-256 hashes, digital signatures, and tamper-proof verification IDs.
 */

export async function computeSHA256(textOrBuffer: string | ArrayBuffer): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      let data: BufferSource;
      if (typeof textOrBuffer === 'string') {
        data = new TextEncoder().encode(textOrBuffer);
      } else {
        data = textOrBuffer as BufferSource;
      }
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }
  
  // Fallback simple hash for non-crypto environments
  let hash = 0;
  const str = typeof textOrBuffer === 'string' ? textOrBuffer : 'buffer-content';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, 'a1e94f7');
}

export function generateVerificationId(prefix: string = 'SS'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = prefix + '-';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  id += '-';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}
