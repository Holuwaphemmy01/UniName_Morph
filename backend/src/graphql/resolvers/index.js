// export default {
//   Query: {
//     getEncryptedUserData: (_, { address }) => {
//       return `fake-encrypted-data-for-${address}`;
//     }
//   },
//   Mutation: {
//     storeEncryptedUserData: (_, { data }) => {
//       console.log("🔐 Encrypted Data Received:", data);
//       return true;
//     }
//   }
// };




import { encryptAES } from '../../service/encryptionService.js';

export default {
  Query: {
    getEncryptedUserData: async (_, { address }) => {
      // Placeholder: return fake until contract is deployed
      return `Encrypted data for ${address}`;
    },
  },
  Mutation: {
    storeEncryptedUserData: async (_, { data }) => {
      const key = process.env.ENCRYPTION_KEY;

      const { encryptedData, iv, tag } = encryptAES(data, key);

      console.log("🔐 Encrypted:", {
        encryptedData,
        iv,
        tag,
      });

      // Placeholder until contract is deployed:
      // await storeEncryptedDataOnChain(JSON.stringify({ encryptedData, iv, tag }));

      return true;
    },
  },
};
