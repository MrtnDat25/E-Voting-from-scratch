const {
  NUM_BITS
} =
require("./config");

function encodeVote(
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

module.exports = {
  encodeVote
};