// const Blowfish = require('javascript-blowfish');

// const key = 'secret key';
// const bf = new Blowfish(key);

// console.log('Blowfish encrypt text by key: ' + key);

// // Encryption
// const encrypted = bf.encrypt('Secret message. Confidentially!');
// let encryptedMime = bf.base64Encode(encrypted);
// console.log(encryptedMime);

// // Decryption
// console.log('decrypted: ', bf.decrypt(bf.base64Decode(encryptedMime)));


// encryption.js
const Blowfish = require('javascript-blowfish');

const encryptMessage = (key, message) => {
  const bf = new Blowfish(key);
  const encrypted = bf.encrypt(message);
  const encryptedMime = bf.base64Encode(encrypted);
  return encryptedMime;
}

const decryptMessage = (key, encryptedMessage) => {
  const bf = new Blowfish(key);
  const decrypted = bf.decrypt(bf.base64Decode(encryptedMessage));
  return decrypted;
}

module.exports = { encryptMessage, decryptMessage };
