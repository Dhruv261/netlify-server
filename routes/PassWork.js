const express = require('express');
const mongoose = require('mongoose');
const router = new express.Router();
const PasswordSchema = require('../models/PasswordSchema');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const { encryptMessage, decryptMessage } = require('../utils/blowfish');
const { encryptMessageAES, decryptMessageAES } = require('../utils/aes');
const { encryptMessageDES, decryptMessageDES } = require('../utils/des')
const { encryptMessageTDES, decryptMessageTDES } = require('../utils/tripledes');
const { sortFromObject } = require('../utils/sort');

router.post('/new-cipher-pass', auth, async (req, res) => {
  console.log('working');
  const { title, cipherPassword } = req.body;
  const isUser = req.user._id;
  try {
    if (isUser) {
      const playlist = new PasswordSchema({
        owner: isUser.valueOf(),
        title,
        passwordOrg: cipherPassword,
      });
      playlist.save();
      res.status(200).send({ message: 'New Password saved.',response: 200 });
    }
  } catch (error) {
    console.log('error in playlist.js:', error);
  }
});

router.post('/give-access-password', auth, async (req, res) => {});

router.get('/pass-list', auth, async (req, res) => {
  const user = req.user._id;
  console.log('/playlist-list user: ', user);
  try {
    const data = await PasswordSchema.find({
      owner: mongoose.Types.ObjectId(user),
    }).select({ title: 1 });
    console.log(data);
    res.status(200).send(data);
  } catch (error) {
    console.log('/home in playlist: ', error);
  }
});

// for simple
router.post('/encrypt-unauth', async (req, res) => {
  const { key, message, algo } = req.body;
  // const user = req.user._id;
  try {
    // const allKey = await PasswordSchema.find({
    //   owner: mongoose.Types.ObjectId(user),
    // });
    // let sKey;
    let encrypted;
    // sKey = sortFromObject(allKey, key);
    if (algo === 'blowfish') {
      encrypted = encryptMessage(key, message);
    } else if (algo === 'aes') {
      encrypted = encryptMessageAES(key, message);
    } else if (algo === 'tripleDes') {
      encrypted = encryptMessageTDES(key, message);
    } else if (algo === 'des') {
      encrypted = encryptMessageDES(key, message);
    }
    console.log(encrypted);
    res.status(200).send({ encrypted });
  } catch (error) {
    console.log(error);
  }
});

router.post('/decrypt-unauth', async (req, res) => {
  const { key, message, algo } = req.body;

  try {
    // const allKey = await PasswordSchema.find({
    //   owner: mongoose.Types.ObjectId(user),
    // });
    // let sKey;
    let decrypted;
    // sKey = sortFromObject(allKey, key);
    if (algo === 'blowfish') {
      decrypted = decryptMessage(key, message);
    } else if (algo === 'aes') {
      decrypted = decryptMessageAES(key, message);
    } else if (algo === 'tripleDes') {
      decrypted = decryptMessageTDES(key, message);
    } else if (algo === 'des') {
      decrypted = decryptMessageDES(key, message);
    }
    res.status(200).send({ decrypted });
  } catch (error) {
    console.log(error);
  }
});




//for saved
router.post('/encrypt', auth, async (req, res) => {
  const { key, message, algo } = req.body;
  const user = req.user._id;
  try {
    const allKey = await PasswordSchema.find({
      owner: mongoose.Types.ObjectId(user),
    });
    let sKey;
    let encrypted;
    sKey = sortFromObject(allKey, key);
    if (algo === 'blowfish') {
      encrypted = encryptMessage(sKey, message);
    } else if (algo === 'aes') {
      encrypted = encryptMessageAES(sKey, message);
    } else if (algo === 'tripleDes') {
      encrypted = encryptMessageTDES(sKey, message);
    } else if (algo === 'des') {
      encrypted = encryptMessageDES(sKey, message);
    }
    console.log(encrypted);
    res.status(200).send({ encrypted });
  } catch (error) {
    console.log(error);
  }
});

router.post('/decrypt', auth, async (req, res) => {
  const { key, message, algo } = req.body;
  const user = req.user._id;
  try {
    const allKey = await PasswordSchema.find({
      owner: mongoose.Types.ObjectId(user),
    });
    let sKey;
    let decrypted;
    sKey = sortFromObject(allKey, key);
    if (algo === 'blowfish') {
      decrypted = decryptMessage(sKey, message);
    } else if (algo === 'aes') {
      decrypted = decryptMessageAES(sKey, message);
    } else if (algo === 'tripleDes') {
      decrypted = decryptMessageTDES(sKey, message);
    } else if (algo === 'des') {
      decrypted = decryptMessageDES(sKey, message);
    }
    res.status(200).send({ decrypted });
  } catch (error) {
    console.log(error);
  }
});

// router.get('/public-list', auth, async (req, res) => {
//   try {
//     const data = await PasswordSchema.find({ title: 'yes' });
//     // .select({ , title: 1 });
//     res.status(200).send(data);
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.post('/playlist-movies', async (req, res) => {
//   const { id } = req.body;
//   try {
//     const list = await PasswordSchema.findById(mongoose.Types.ObjectId(id));
//     console.log(list);
//     await res.status(200).send(list);
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.post('/concat-list', auth, async (req, res) => {
//   const { objectId, movieToAdd } = req.body;
//   console.log('movieToAdd: ', movieToAdd);
//   console.log('objectId: ', objectId);
//   try {
//     const playlist = await PasswordSchema.findById(
//       mongoose.Types.ObjectId(objectId)
//     );
//     console.log(playlist);
//     console.log(playlist.content);
//     playlist.content = playlist.content.concat({ title: movieToAdd });
//     await playlist.save();
//     res.status(200).send({ message: 'Added to playlist.' });
//   } catch (e) {
//     console.log(e);
//   }
// });

// router.get('/aplaylist/:id', async (req, res) => {
//   console.log('req.params: ', req.params.id);
//   const deta = req.params.id;

//   try {
//     const requestedData = await PasswordSchema.findById(
//       mongoose.Types.ObjectId(deta)
//     );
//     console.log(requestedData);
//     res.status(200).send(requestedData);
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
