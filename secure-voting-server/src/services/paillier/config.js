const MAX_CANDIDATES = 100;

const MAX_VOTERS = 100000;

const NUM_BITS =
  Math.ceil(
    Math.log2(
      MAX_VOTERS + 1
    )
  );

module.exports = {
  MAX_CANDIDATES,
  MAX_VOTERS,
  NUM_BITS
};