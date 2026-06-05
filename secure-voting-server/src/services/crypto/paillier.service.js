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

export default {
  generateKeyPair,
};

// fake to test