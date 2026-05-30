const generateKeyPair =
  async () => {

    return {
      publicKey: {
        n: "123456789",
        g: "987654321",
      },

      privateKey: {
        lambda: "xxx",
        mu: "xxx",
      },
    };
  };

module.exports = {
  generateKeyPair,
};

// fake to test