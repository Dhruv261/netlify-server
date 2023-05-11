var CryptoJS = require('crypto-js');

const encryptMessageDES = (key, message) => {
  // Encrypt
  const ciphertext = CryptoJS.DES.encrypt(message, key).toString();
  return ciphertext;
};

const decryptMessageDES = (key, ciphertext) => {
  // Decrypt
  const bytes = CryptoJS.DES.decrypt(ciphertext, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

module.exports = { encryptMessageDES, decryptMessageDES };
