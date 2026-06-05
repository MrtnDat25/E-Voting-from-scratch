const {
  NUM_BITS
} =
import("./config");

export function encodeVote(
  candidateIndex
) {

  return (
    1n <<
    BigInt(
      candidateIndex *
      NUM_BITS
    )
  );

}

// export default {
//   encodeVote
// };