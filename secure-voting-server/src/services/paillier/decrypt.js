import {
	modPow
} from "./math.js";

export function decrypt(
	ciphertext,
	privateKey
) {

	const n =
		BigInt(
			privateKey.n
		);

	const lambda =
		BigInt(
			privateKey.lambda
		);

	const mu =
		BigInt(
			privateKey.mu
		);

	const nSq =
		n * n;

	const u =
		modPow(
			BigInt(ciphertext),
			lambda,
			nSq
		);

	const L =
		(u - 1n) / n;

	const plaintext =
		(
			L * mu
		) % n;

	return plaintext;
}

// export default {
//   decrypt
// };