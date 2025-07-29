export default {
  Query: {
    getEncryptedUserData: (_, { address }) => {
      return `fake-encrypted-data-for-${address}`;
    }
  },
  Mutation: {
    storeEncryptedUserData: (_, { data }) => {
      console.log("🔐 Encrypted Data Received:", data);
      return true;
    }
  }
};
