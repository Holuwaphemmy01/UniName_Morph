// const crypto = require('crypto');

// function encryptAES(data, key) {
//   const iv = crypto.randomBytes(12); // AES-GCM IV is 12 bytes
//   const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);

//   let encrypted = cipher.update(data, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   const tag = cipher.getAuthTag();

//   return {
//     encryptedData: encrypted,
//     iv: iv.toString('hex'),
//     tag: tag.toString('hex'),
//   };
// }

//  function decryptAES(encryptedData, key, ivHex, tagHex) {
//   const iv = Buffer.from(ivHex, 'hex');
//   const tag = Buffer.from(tagHex, 'hex');

//   const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key), iv);
//   decipher.setAuthTag(tag);

//   let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }

// module.exports = { encryptAES, decryptAES };


const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // must be 32 bytes (64 hex chars)
const iv = crypto.randomBytes(16);

function encryptAES(data) {
  if (typeof data !== 'string') {
    data = JSON.stringify(data); // ✅ Fix: always ensure data is a string
  }

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

function decryptAES(encryptedData) {
  const [ivHex, encrypted] = encryptedData.split(':');
  const ivBuffer = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = { encryptAES, decryptAES };
