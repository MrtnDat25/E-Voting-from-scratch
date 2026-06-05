export function gcd(a, b) {
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

export function egcd(a, b) {
  if (a === 0n) return [b, 0n, 1n];

  const [g, x1, y1] = egcd(b % a, a);

  const x = y1 - (b / a) * x1;
  const y = x1;

  return [g, x, y];
}

export function modInverse(a, m) {
  const [g, x] = egcd(a, m);

  if (g !== 1n) {
    throw new Error("Modular inverse does not exist");
  }

  return ((x % m) + m) % m;
}

export function modPow(base, exponent, modulus) {
  if (modulus === 1n) return 0n;

  let result = 1n;
  base = base % modulus;

  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }

  return result;
}