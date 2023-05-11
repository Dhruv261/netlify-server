const plaintext = 'a plain text for show you what is Utf8';
// const textBuffer = Buffer.from(plaintext, 'ascii');

textBuffer.toString('ascii') == plaintext;
const hexString = 'DEADBEEFDEADBEEFDEADBEEFDEADBEEF';
// const textBuffer = Buffer.from(hexString, 'hex');

textBuffer.toString('hex') == hexString;// 128-bit, 192-bit and 256-bit keys
var key_128 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
var key_192 = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];
var key_256 = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];
var key_128 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// or, you may use Uint8Array:
var key_128_array = new Uint8Array(key_128);
var key_192_array = new Uint8Array(key_192);
var key_256_array = new Uint8Array(key_256);

// or, you may use Buffer in node.js:
var key_128_buffer = Buffer.from(key_128);
var key_192_buffer = Buffer.from(key_192);
var key_256_buffer = Buffer.from(key_256);var pbkdf2 = require('pbkdf2');

var key_128 = pbkdf2.pbkdf2Sync('password', 'salt', 1, 128 / 8, 'sha512');
var key_192 = pbkdf2.pbkdf2Sync('password', 'salt', 1, 192 / 8, 'sha512');
var key_256 = pbkdf2.pbkdf2Sync('password', 'salt', 1, 256 / 8, 'sha512');// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// Convert text to bytes
var text = "Text may be any length you wish, no padding is required.";
var textBytes = Buffer.from(text, "ascii");
// The counter is optional, and if omitted will begin at 1
var aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
encryptedBytes = Buffer.from(encryptedBytes);
// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

// The counter mode of operation maintains internal state, so to
// decrypt a new instance must be instantiated.
aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
var decryptedBytes = aesCtr.decrypt(encryptedBytes);

// Convert our bytes back into text
var decryptedText = Buffer.from(decryptedBytes);

decryptedText.toString("ascii") == text;
// return  "Text may be any length you wish, no padding is required."

// "Text may be any length you wish, no padding is required."// An example 128-bit key
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// The initialization vector (must be 16 bytes)
var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

// Convert text to bytes (text must be a multiple of 16 bytes)
var text = "TextMustBe16Byte";
var textBytes = Buffer.from(text, "ascii");

var aesCbc = new Aes.ModeOfOperation.cbc(key, iv);
var encryptedBytes = aesCbc.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
encryptedBytes = Buffer.from(encryptedBytes);
console.log(encryptedBytes.toString("hex"));
// "104fb073f9a131f2cab49184bb864ca2"

// The cipher-block chaining mode of operation maintains internal
// state, so to decrypt a new instance must be instantiated.
aesCbc = new Aes.ModeOfOperation.cbc(key, iv);
var decryptedBytes = aesCbc.decrypt(encryptedBytes);

// Convert our bytes back into text
decryptedBytes = Buffer.from(decryptedBytes);
console.log(decryptedBytes.toString("ascii"));
// "TextMustBe16Byte"// An example 128-bit key
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// The initialization vector (must be 16 bytes)
var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

// Convert text to bytes (must be a multiple of the segment size you choose below)
var text = "TextMustBeAMultipleOfSegmentSize";
var textBytes = Buffer.from(text, "ascii");

// The segment size is optional, and defaults to 1
var segmentSize = 8;
var aesCfb = new Aes.ModeOfOperation.cfb(key, iv, segmentSize);
var encryptedBytes = aesCfb.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
encryptedBytes = Buffer.from(encryptedBytes);
console.log(encryptedBytes.toString("hex"));
// "55e3af2638c560b4fdb9d26a630733ea60197ec23deb85b1f60f71f10409ce27"

// The cipher feedback mode of operation maintains internal state,
// so to decrypt a new instance must be instantiated.
aesCfb = new Aes.ModeOfOperation.cfb(key, iv, 8);
var decryptedBytes = aesCfb.decrypt(encryptedBytes);

// Convert our bytes back into text
decryptedBytes = Buffer.from(decryptedBytes);
console.log(decryptedBytes.toString("ascii"));
// "TextMustBeAMultipleOfSegmentSize"// An example 128-bit key
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// The initialization vector (must be 16 bytes)
var iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

// Convert text to bytes
var text = "Text may be any length you wish, no padding is required.";
var textBytes = Buffer.from(text, "ascii");

var aesOfb = new Aes.ModeOfOperation.ofb(key, iv);
var encryptedBytes = aesOfb.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
encryptedBytes = Buffer.from(encryptedBytes);
console.log(encryptedBytes.toString("hex"));
// "55e3af2655dd72b9f32456042f39bae9accff6259159e608be55a1aa313c598d
//  b4b18406d89c83841c9d1af13b56de8eda8fcfe9ec8e75e8"

// The output feedback mode of operation maintains internal state,
// so to decrypt a new instance must be instantiated.
var aesOfb = new Aes.ModeOfOperation.ofb(key, iv);
var decryptedBytes = aesOfb.decrypt(encryptedBytes);

// Convert our bytes back into text
decryptedBytes = Buffer.from(decryptedBytes);
console.log(decryptedBytes.toString("ascii"));
// "Text may be any length you wish, no padding is required."// An example 128-bit key
var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// Convert text to bytes
var text = "TextMustBe16Byte";
var textBytes = Buffer.from(text, "ascii");

var aesEcb = new Aes.ModeOfOperation.ecb(key);
var encryptedBytes = aesEcb.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
var encryptedBytes = Buffer.from(encryptedBytes);
console.log(encryptedBytes.toString("hex"));
// "a7d93b35368519fac347498dec18b458"

// Since electronic codebook does not store state, we can
// reuse the same instance.
//var aesEcb = new aesjs.ModeOfOperation.ecb(key);
var decryptedBytes = aesEcb.decrypt(encryptedBytes);

// Convert our bytes back into text
decryptedBytes = Buffer.from(decryptedBytes);
console.log(decryptedBytes.toString("ascii"));
// "TextMustBe16Byte"// the AES block cipher algorithm works on 16 byte bloca ks, no more, no less
var text = "ABlockIs16Bytes!";
var textAsBytes = Buffer.from(text, "ascii");
console.log(textAsBytes.toString("hex"));
// [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]

// create an instance of the block cipher algorithm
var key = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3];
var aes = new Aes.AES(key);

// encrypt...
var encryptedBytes = aes.encrypt(textAsBytes);
console.log(encryptedBytes);
// [136, 15, 199, 174, 118, 133, 233, 177, 143, 47, 42, 211, 96, 55, 107, 109]

// To print or store the binary data, you may convert it to hex
var encryptedHex = Buffer.from(encryptedBytes);
console.log(encryptedHex.toString("hex"));
// "880fc7ae7685e9b18f2f2ad360376b6d"

// decrypt...
var decryptedBytes = aes.decrypt(encryptedHex);
console.log(decryptedBytes);
// [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]

// decode the bytes back into our original text
var decryptedText = Buffer.from(decryptedBytes);
console.log(decryptedText.toString("ascii"));
// "ABlockIs16Bytes!"