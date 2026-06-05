export function aggregateVotes(
  encryptedVotes,
  n
) {

  const nSq =
    BigInt(n) *
    BigInt(n);

  let total = 1n;

  for (
    const vote
    of encryptedVotes
  ) {

    total =
      (
        total *
        BigInt(vote)
      ) % nSq;

  }

  return total.toString();
}

// export default {
//   aggregateVotes
// };