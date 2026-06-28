/**
 * types/stubs/node-stubs.d.ts
 *
 * node_modules がない環境での型チェック用スタブ。
 * 本番ビルドでは @types/node が node_modules に入るため不要。
 * .gitignore 等でローカル専用として扱うか、npm install 後に削除してください。
 */

// --- process ---
declare const process: {
  env: Record<string, string | undefined>;
};

// --- Buffer ---
declare class Buffer extends Uint8Array {
  static from(value: string | ArrayBuffer | SharedArrayBuffer | Uint8Array, encoding?: string): Buffer;
  toString(encoding?: string): string;
}

// --- crypto (Node built-in subset used in lib/line.ts) ---
declare namespace crypto {
  function createHmac(algorithm: string, key: string | Buffer): {
    update(data: string | Buffer): { digest(encoding: string): string };
  };
  function timingSafeEqual(a: Buffer, b: Buffer): boolean;
}
declare function require(module: string): unknown;
