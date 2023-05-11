var CryptoJS = require('crypto-js');

const encryptMessageTDES = (key, message) => {
  // Encrypt
  const ciphertext = CryptoJS.TripleDES.encrypt(message, key).toString();
  return ciphertext;
};

const decryptMessageTDES = (key, ciphertext) => {
  // Decrypt
  const bytes = CryptoJS.TripleDES.decrypt(ciphertext, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

module.exports = { encryptMessageTDES, decryptMessageTDES };
