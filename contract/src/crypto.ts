import { createHash } from 'crypto';

export function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

export function computeStudentCommitment(studentSecret: string, salt: string): string {
  return '0x' + sha256(`student_commitment:${studentSecret}:${salt}`);
}

export function computeApplicationNullifier(studentSecret: string, scholarshipId: string): string {
  return '0x' + sha256(`application_nullifier:${studentSecret}:${scholarshipId}`);
}

export class MerkleTree {
  public leaves: string[];
  public layers: string[][];

  constructor(leaves: string[]) {
    this.leaves = leaves.map(l => (l.startsWith('0x') ? l : '0x' + l));
    this.layers = [this.leaves];
    this.buildTree();
  }

  private buildTree(): void {
    let currentLayer = this.layers[0];
    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
        nextLayer.push('0x' + sha256(left + right));
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

  public static verifyProof(
    leaf: string,
    proof: string[],
    root: string,
    index: number
  ): boolean {
    let hash = leaf.startsWith('0x') ? leaf : '0x' + leaf;
    let currentIndex = index;

    for (const sibling of proof) {
      const isRightNode = currentIndex % 2 === 1;
      if (isRightNode) {
        hash = '0x' + sha256(sibling + hash);
      } else {
        hash = '0x' + sha256(hash + sibling);
      }
      currentIndex = Math.floor(currentIndex / 2);
    }

    return hash === (root.startsWith('0x') ? root : '0x' + root);
  }
}
