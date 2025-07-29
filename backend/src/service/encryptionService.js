const crypto = require('crypto');

function encryptAES(data, key) {
  const iv = crypto.randomBytes(12); // AES-GCM IV is 12 bytes
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

 function decryptAES(encryptedData, key, ivHex, tagHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key), iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encryptAES, decryptAES };