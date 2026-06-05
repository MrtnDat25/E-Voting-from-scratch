export const MAX_CANDIDATES = 100;
export const MAX_VOTERS = 100000;
export const NUM_BITS =
  Math.ceil(
    Math.log2(
      MAX_VOTERS + 1
    )
  );

// export default {
//   MAX_CANDIDATES,
//   MAX_VOTERS,
//   NUM_BITS
// };