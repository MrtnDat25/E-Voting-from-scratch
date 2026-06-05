import {
	NUM_BITS
} from "./config.js";

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