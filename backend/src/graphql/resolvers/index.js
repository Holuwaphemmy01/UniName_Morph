import { encryptAES } from '../../service/encryptionService.js';

export default {
  Query: {
    getEncryptedUserData: async (_, { address }) => {
      // Placeholder: return fake until contract is deployed
      return `Encrypted data for ${address}`;
    },
  },
  Mutation: {
    Mutation: {
    async storeEncryptedUserData(_, { data }, context) {
      const encrypted = encryptAES(data); // your existing function
      const tx = await contract.saveData(encrypted); // write to chain
      await tx.wait(); // confirm transaction
      return true;
    },
    async updateEncryptedUserData(_, { data }, context) {
      const encrypted = encryptAES(data); // your existing function
      const tx = await contract.updateData(encrypted); // write to chain
      await tx.wait(); // confirm transaction
      return true;
    },
    async deleteEncryptedUserData(_, { address }, context) {
      const tx = await contract.deleteData(address); // write to chain
      await tx.wait(); // confirm transaction
      return true;
    },
    },
    
  },
};
