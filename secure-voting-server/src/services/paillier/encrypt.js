const crypto =
import("crypto");

const {
  gcd,
  modPow
} = import("./math");

export function encrypt(
  plaintext,
  publicKey
) {

  const n =
    BigInt(
      publicKey.n
    );

  const g =
    BigInt(
      publicKey.g
    );

  const nSq =
    n * n;

  let r;

  do {

    r =
      BigInt(
        "0x" +
        crypto
          .randomBytes(32)
          .toString("hex")
      ) % n;

  } while (
    r === 0n ||
    gcd(r, n) !== 1n
  );

  const c =
    (
      modPow(
        g,
        BigInt(plaintext),
        nSq
      )
      *
      modPow(
        r,
        n,
        nSq
      )
    ) % nSq;

  return c.toString();
}

// export default {
//   encrypt
// };