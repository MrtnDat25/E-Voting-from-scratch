const {
  generateKeyPair
} =
require(
"./src/services/paillier/keygen"
);

const {
  encrypt
} =
require(
"./src/services/paillier/encrypt"
);

const {
  decrypt
} =
require(
"./src/services/paillier/decrypt"
);

const {
  encodeVote
} =
require(
"./src/services/paillier/encode"
);

const {
  aggregateVotes
} =
require(
"./src/services/paillier/aggregate"
);

const {
  decodeResult
} =
require(
"./src/services/paillier/decode"
);

const {
  publicKey,
  privateKey
} =
generateKeyPair();

const votes = [

  encodeVote(1),

  encodeVote(1),

  encodeVote(2)

];

const encryptedVotes =
  votes.map(
    vote =>
      encrypt(
        vote,
        publicKey
      )
  );

const totalEncrypted =
  aggregateVotes(
    encryptedVotes,
    publicKey.n
  );

const decrypted =
  decrypt(
    totalEncrypted,
    privateKey
  );

const result =
  decodeResult(
    decrypted,
    3
  );

console.log(
  result
);