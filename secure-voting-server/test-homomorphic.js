const {
  generateKeyPair
} =
import(
"./src/services/paillier/keygen"
);

const {
  encrypt
} =
import(
"./src/services/paillier/encrypt"
);

const {
  decrypt
} =
import(
"./src/services/paillier/decrypt"
);

const {
  encodeVote
} =
import(
"./src/services/paillier/encode"
);

const {
  aggregateVotes
} =
import(
"./src/services/paillier/aggregate"
);

const {
  decodeResult
} =
import(
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