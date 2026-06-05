import crypto from "crypto";
import { gcd, modPow } from "./math.js";

export function encrypt(plaintext, publicKey) {
  const n = BigInt(publicKey.n);
  const g = BigInt(publicKey.g);
  const nSq = n * n;

  const m = BigInt(plaintext);

  let r;

  do {
    r = BigInt(
      "0x" + crypto.randomBytes(16).toString("hex")
    ) % n;
  } while (r === 0n || gcd(r, n) !== 1n);

  const c =
    (modPow(g, m, nSq) * modPow(r, n, nSq)) % nSq;

  return c.toString();
}