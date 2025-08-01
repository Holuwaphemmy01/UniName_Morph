const {encryptAES, decryptAES} = require('../../service/encryptionService.js');
const {
  saveData,
  updateData,
} = require('../../service/blockchainService.js');

module.exports = {
  Query: {
    getEncryptedUserData: async (_, { address }) => {
      const encrypted = await getData(address); // get from contract
      const decrypted = decryptAES(encrypted); // if needed
      return decrypted;
    },
  },

  Mutation: {
    async storeEncryptedUserData(_, { data }) {
      const encrypted = encryptAES(data);
      const tx = await saveData(encrypted);
      await tx.wait();
      return true;
    },

    async updateEncryptedUserData(_, { data }) {
      const encrypted = encryptAES(data);
      const tx = await updateData(encrypted);
      await tx.wait();
      return true;
    },
  },
};

