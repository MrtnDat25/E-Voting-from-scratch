import {
  NUM_BITS
} 
from "./config.js";

export function decodeResult(
  decryptedValue,
  totalCandidates
) {

  const results = [];

  const mask =
    (
      1n <<
      BigInt(NUM_BITS)
    ) - 1n;

  for (
    let i = 0;
    i < totalCandidates;
    i++
  ) {

    const count =
      (
        BigInt(
          decryptedValue
        )
        >>
        BigInt(
          i * NUM_BITS
        )
      )
      &
      mask;

    results.push(
      Number(count)
    );
  }

  return results;
}

// export default {
//   decodeResult
// };