import {
	lcm,
	modInverse,
	modPow
} from "./math.js";

export function generateKeyPair() {

	const p = 1000003n;

	const q = 1000033n;

	const n = p * q;

	const g = n + 1n;

	const lambda =
		lcm(
			p - 1n,
			q - 1n
		);

	const nSq =
		n * n;

	const u =
		modPow(
			g,
			lambda,
			nSq
		);

	const L =
		(u - 1n) / n;

	const mu =
		modInverse(
			L,
			n
		);

	return {

		publicKey: {
			n: n.toString(),
			g: g.toString()
		},

		privateKey: {
			n: n.toString(),
			lambda: lambda.toString(),
			mu: mu.toString()
		}
	};
}