/**
 * Browser-compatible Cryptographic Helpers for Midnight ScholarShield
 */

export async function sha256Browser(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback simple hash for non-crypto/SSR environments
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

export async function computeStudentCommitmentBrowser(
  studentSecret: string,
  salt: string
): Promise<string> {
  const hash = await sha256Browser(`student_commitment:${studentSecret}:${salt}`);
  return '0x' + hash;
}

export async function computeApplicationNullifierBrowser(
  studentSecret: string,
  scholarshipId: string
): Promise<string> {
  const hash = await sha256Browser(`application_nullifier:${studentSecret}:${scholarshipId}`);
  return '0x' + hash;
}

export class MerkleTreeBrowser {
  public leaves: string[];
  public layers: string[][];

  constructor(leaves: string[]) {
    this.leaves = leaves.map(l => (l.startsWith('0x') ? l : '0x' + l));
    this.layers = [this.leaves];
  }

  public async build(): Promise<void> {
    let currentLayer = this.layers[0];
    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
        const h = await sha256Browser(left + right);
        nextLayer.push('0x' + h);
      }
      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  public getRoot(): string {
    return this.layers[this.layers.length - 1][0] || '0x' + '0'.repeat(64);
  }

  public getProof(index: number): string[] {
    const proof: string[] = [];
    let currentIndex = index;
    for (let i = 0; i < this.layers.length - 1; i++) {
      const layer = this.layers[i];
      const isRightNode = currentIndex % 2 === 1;
      const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;
      if (siblingIndex < layer.length) {
        proof.push(layer[siblingIndex]);
      } else {
        proof.push(layer[currentIndex]);
      }
      currentIndex = Math.floor(currentIndex / 2);
    }
    return proof;
  }
}
