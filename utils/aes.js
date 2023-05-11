var CryptoJS = require('crypto-js');

const encryptMessageAES = (key, message) => {
  // Encrypt
  const ciphertext = CryptoJS.AES.encrypt(message, key).toString();
  return ciphertext;
};

const decryptMessageAES = (key, ciphertext) => {
  // Decrypt
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};


module.exports = { encryptMessageAES, decryptMessageAES };
