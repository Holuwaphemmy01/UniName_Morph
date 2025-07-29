import { encryptAES, decryptAES } from '../../service/encryptionService.js';
import {
  saveData,
  updateData
} from '../../service/blockchainService.js';

export default {
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

    // async deleteEncryptedUserData(_, { address }) {
    //   const tx = await deleteData(address);
    //   await tx.wait();
    //   return true;
    // },
  },
};
