export function aggregateVotes(encryptedVotes, n) {
  const modulus = BigInt(n);
  const nSq = modulus * modulus;

  let total = 1n;

  for (const vote of encryptedVotes) {
    if (!vote) continue;

    const v = BigInt(vote.toString());
    total = (total * v) % nSq;
  }

  return total.toString();
}