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
  publicKey,
  privateKey
} =
generateKeyPair();

const message = 5n;

const ciphertext =
  encrypt(
    message,
    publicKey
  );

console.log(
  "Encrypted:",
  ciphertext
);

const decrypted =
  decrypt(
    ciphertext,
    privateKey
  );

console.log(
  "Decrypted:",
  decrypted.toString()
);