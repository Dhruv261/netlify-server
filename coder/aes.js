
'use strict';
if (typeof module != 'undefined' && module.exports) var Aes = require('./aes');


Aes.Ctr = {};


Aes.Ctr.encrypt = function (plaintext, password, nBits) {
  var blockSize = 16;
  if (!(nBits == 128 || nBits == 192 || nBits == 256)) return '';
  plaintext = String(plaintext).utf8Encode();
  password = String(password).utf8Encode();

  var nBytes = nBits / 8;
  var pwBytes = new Array(nBytes);
  for (var i = 0; i < nBytes; i++) {

    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
  key = key.concat(key.slice(0, nBytes - 16));

  var counterBlock = new Array(blockSize);

  var nonce = new Date().getTime();
  var nonceMs = nonce % 1000;
  var nonceSec = Math.floor(nonce / 1000);
  var nonceRnd = Math.floor(Math.random() * 0xffff);

  for (var i = 0; i < 2; i++) counterBlock[i] = (nonceMs >>> (i * 8)) & 0xff;
  for (var i = 0; i < 2; i++)
    counterBlock[i + 2] = (nonceRnd >>> (i * 8)) & 0xff;
  for (var i = 0; i < 4; i++)
    counterBlock[i + 4] = (nonceSec >>> (i * 8)) & 0xff;

  var ctrTxt = '';
  for (var i = 0; i < 8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

  var keySchedule = Aes.keyExpansion(key);

  var blockCount = Math.ceil(plaintext.length / blockSize);
  var ciphertxt = new Array(blockCount);

  for (var b = 0; b < blockCount; b++) {
    for (var c = 0; c < 4; c++) counterBlock[15 - c] = (b >>> (c * 8)) & 0xff;
    for (var c = 0; c < 4; c++)
      counterBlock[15 - c - 4] = (b / 0x100000000) >>> (c * 8);

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);

    var blockLength =
      b < blockCount - 1 ? blockSize : ((plaintext.length - 1) % blockSize) + 1;
    var cipherChar = new Array(blockLength);

    for (var i = 0; i < blockLength; i++) {
      cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b * blockSize + i);
      cipherChar[i] = String.fromCharCode(cipherChar[i]);
    }
    ciphertxt[b] = cipherChar.join('');
  }

  var ciphertext = ctrTxt + ciphertxt.join('');
  ciphertext = ciphertext.base64Encode();

  return ciphertext;
};


Aes.Ctr.decrypt = function (ciphertext, password, nBits) {
  var blockSize = 16;
  if (!(nBits == 128 || nBits == 192 || nBits == 256)) return '';
  ciphertext = String(ciphertext).base64Decode();
  password = String(password).utf8Encode();

  var nBytes = nBits / 8;
  var pwBytes = new Array(nBytes);
  for (var i = 0; i < nBytes; i++) {
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
  key = key.concat(key.slice(0, nBytes - 16));

  var counterBlock = new Array(8);
  var ctrTxt = ciphertext.slice(0, 8);
  for (var i = 0; i < 8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

  var keySchedule = Aes.keyExpansion(key);

  var nBlocks = Math.ceil((ciphertext.length - 8) / blockSize);
  var ct = new Array(nBlocks);
  for (var b = 0; b < nBlocks; b++)
    ct[b] = ciphertext.slice(8 + b * blockSize, 8 + b * blockSize + blockSize);
  ciphertext = ct;

  var plaintxt = new Array(ciphertext.length);

  for (var b = 0; b < nBlocks; b++) {
    for (var c = 0; c < 4; c++) counterBlock[15 - c] = (b >>> (c * 8)) & 0xff;
    for (var c = 0; c < 4; c++)
      counterBlock[15 - c - 4] =
        (((b + 1) / 0x100000000 - 1) >>> (c * 8)) & 0xff;

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);

    var plaintxtByte = new Array(ciphertext[b].length);
    for (var i = 0; i < ciphertext[b].length; i++) {
      plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
      plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
    }
    plaintxt[b] = plaintxtByte.join('');
  }

  var plaintext = plaintxt.join('');
  plaintext = plaintext.utf8Decode();

  return plaintext;
};

if (typeof String.prototype.utf8Encode == 'undefined') {
  String.prototype.utf8Encode = function () {
    return unescape(encodeURIComponent(this));
  };
}
if (typeof String.prototype.utf8Decode == 'undefined') {
  String.prototype.utf8Decode = function () {
    try {
      return decodeURIComponent(escape(this));
    } catch (e) {
      return this;
    }
  };
}

if (typeof String.prototype.base64Encode == 'undefined') {
  String.prototype.base64Encode = function () {
    if (typeof btoa != 'undefined') return btoa(this);
    if (typeof Buffer != 'undefined')
      return new Buffer(this, 'utf8').toString('base64');
    throw new Error('No Base64 Encode');
  };
}
if (typeof String.prototype.base64Decode == 'undefined') {
  String.prototype.base64Decode = function () {
    if (typeof atob != 'undefined') return atob(this); // browser
    if (typeof Buffer != 'undefined')
      return new Buffer(this, 'base64').toString('utf8'); // Node.js
    throw new Error('No Base64 Decode');
  };
}

if (typeof module != 'undefined' && module.exports) module.exports = Aes.Ctr;
if (typeof define == 'function' && define.amd)
  define(['Aes'], function () {
    return Aes.Ctr;
  });

function encryptFile(file) {

    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function(evt) {
        $('body').css({'cursor':'wait'});


        var contentBytes = new Uint8Array(reader.result);
        var contentStr = '';
        for (var i=0; i<contentBytes.length; i++) {
            contentStr += String.fromCharCode(contentBytes[i]);
        }

        var password = $('#password-file').val();

        var t1 = new Date();
        var ciphertext = Aes.Ctr.encrypt(contentStr, password, 256);
        var t2 = new Date();

        // use Blob to save encrypted file
        var blob = new Blob([ciphertext], { type: 'text/plain' });
        var filename = file.name+'.encrypted';
        saveAs(blob, filename);

        $('#encrypt-file-time').html(((t2 - t1)/1000)+'s'); // display time taken
        $('body').css({'cursor':'default'});
    }
}

function decryptFile(file) {

    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(evt) {
        $('body').css({'cursor':'wait'});

        var content = reader.result;
        var password = $('#password-file').val();

        var t1 = new Date();
        var plaintext = Aes.Ctr.decrypt(content, password, 256);
        var t2 = new Date();


        var contentBytes = new Uint8Array(plaintext.length);
        for (var i=0; i<plaintext.length; i++) {
            contentBytes[i] = plaintext.charCodeAt(i);
        }


        var blob = new Blob([contentBytes], { type: 'application/octet-stream' });
        var filename = file.name.replace(/\.encrypted$/,'')+'.decrypted';
        saveAs(blob, filename);

        $('#decrypt-file-time').html(((t2 - t1)/1000)+'s');
        $('body').css({'cursor':'default'});
    }
}

'use strict';

var Aes = {};


Aes.cipher = function(input, w) {
    var Nb = 4;
    var Nr = w.length/Nb - 1;

    var state = [[],[],[],[]];
    for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

    state = Aes.addRoundKey(state, w, 0, Nb);

    for (var round=1; round<Nr; round++) {
        state = Aes.subBytes(state, Nb);
        state = Aes.shiftRows(state, Nb);
        state = Aes.mixColumns(state, Nb);
        state = Aes.addRoundKey(state, w, round, Nb);
    }

    state = Aes.subBytes(state, Nb);
    state = Aes.shiftRows(state, Nb);
    state = Aes.addRoundKey(state, w, Nr, Nb);

    var output = new Array(4*Nb);
    for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];

    return output;
};


Aes.keyExpansion = function(key) {
    var Nb = 4;
    var Nk = key.length/4;
    var Nr = Nk + 6;

    var w = new Array(Nb*(Nr+1));
    var temp = new Array(4);


    for (var i=0; i<Nk; i++) {
        var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
        w[i] = r;
    }


    for (var i=Nk; i<(Nb*(Nr+1)); i++) {
        w[i] = new Array(4);
        for (var t=0; t<4; t++) temp[t] = w[i-1][t];

        if (i % Nk == 0) {
            temp = Aes.subWord(Aes.rotWord(temp));
            for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
        }

        else if (Nk > 6 && i%Nk == 4) {
            temp = Aes.subWord(temp);
        }

        for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
    }

    return w;
};


Aes.subBytes = function(s, Nb) {
    for (var r=0; r<4; r++) {
        for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
    }
    return s;
};


Aes.shiftRows = function(s, Nb) {
    var t = new Array(4);
    for (var r=1; r<4; r++) {
        for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];
        for (var c=0; c<4; c++) s[r][c] = t[c];
    }
    return s;
};


Aes.mixColumns = function(s, Nb) {
    for (var c=0; c<4; c++) {
        var a = new Array(4);
        var b = new Array(4);
        for (var i=0; i<4; i++) {
            a[i] = s[i][c];
            b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;
        }

        s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3];
        s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3];
        s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3];
        s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3];
    }
    return s;
};


// /**
//  * Xor Round Key into state S [§5.1.4]
//  * @private
//  */
// Aes.addRoundKey = function(state, w, rnd, Nb) {
//     for (var r=0; r<4; r++) {
//         for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
//     }
//     return state;
// };


// /**
//  * Apply SBox to 4-byte word w
//  * @private
//  */
// Aes.subWord = function(w) {
//     for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
//     return w;
// };


// /**
//  * Rotate 4-byte word w left by one byte
//  * @private
//  */
// Aes.rotWord = function(w) {
//     var tmp = w[0];
//     for (var i=0; i<3; i++) w[i] = w[i+1];
//     w[3] = tmp;
//     return w;
// };


// // sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
// Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
//              0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
//              0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
//              0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
//              0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
//              0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
//              0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
//              0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
//              0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
//              0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
//              0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
//              0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
//              0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
//              0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
//              0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
//              0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];


// // rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
// Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
//              [0x01, 0x00, 0x00, 0x00],
//              [0x02, 0x00, 0x00, 0x00],
//              [0x04, 0x00, 0x00, 0x00],
//              [0x08, 0x00, 0x00, 0x00],
//              [0x10, 0x00, 0x00, 0x00],
//              [0x20, 0x00, 0x00, 0x00],
//              [0x40, 0x00, 0x00, 0x00],
//              [0x80, 0x00, 0x00, 0x00],
//              [0x1b, 0x00, 0x00, 0x00],
//              [0x36, 0x00, 0x00, 0x00] ];


if (typeof module != 'undefined' && module.exports) module.exports = Aes;
if (typeof define == 'function' && define.amd) define([], function() { return Aes; });


function encryptFile(file) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function(evt) {
        $('body').css({'cursor':'wait'});

        var contentBytes = new Uint8Array(reader.result);
        var contentStr = '';
        for (var i=0; i<contentBytes.length; i++) {
            contentStr += String.fromCharCode(contentBytes[i]);
        }

        var password = $('#password-file').val();

        var t1 = new Date();
        var ciphertext = Aes.Ctr.encrypt(contentStr, password, 256);
        var t2 = new Date();

        var blob = new Blob([ciphertext], { type: 'text/plain' });
        var filename = file.name+'.encrypted';
        saveAs(blob, filename);

        $('#encrypt-file-time').html(((t2 - t1)/1000)+'s'); // display time taken
        $('body').css({'cursor':'default'});
    }
}

function decryptFile(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(evt) {
        $('body').css({'cursor':'wait'});

        var content = reader.result;
        var password = $('#password-file').val();

        var t1 = new Date();
        var plaintext = Aes.Ctr.decrypt(content, password, 256);
        var t2 = new Date();

        var contentBytes = new Uint8Array(plaintext.length);
        for (var i=0; i<plaintext.length; i++) {
            contentBytes[i] = plaintext.charCodeAt(i);
        }

        var blob = new Blob([contentBytes], { type: 'application/octet-stream' });
        var filename = file.name.replace(/\.encrypted$/,'')+'.decrypted';
        saveAs(blob, filename);

        $('#decrypt-file-time').html(((t2 - t1)/1000)+'s');
        $('body').css({'cursor':'default'});
    }
}