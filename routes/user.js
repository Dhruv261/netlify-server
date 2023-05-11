const express = require('express');
const router = new express.Router();
const User = require('../models/User');

router.get('/test', async (req, res) => {
  res.send('Working');
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const isUserPresent = await User.find({ email });

  if (isUserPresent.length > 0) {
    res.send('User Already present');
  } else {
    const user = new User({
      name,
      email,
      password,
    });

    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(200).send({ user, token, response: 200 });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send('There is an error in signup-method: ', error.message);
    }
  }
});

// in this the return value will be received as an array which contains the following

// name of user, email of user and jwt token
router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  console.log(email, ' ', password);
  try {
    const user = await User.findByCreds(email, password);
    console.log('User data from login: ',user)
    // if(user.error) {
    //   res.status(400).send({ response: 401 });
    // }
    res.status(200).send({ user, response: 200 });
  } catch (error) {
    console.error('this is the error in /login catch ', error.message);
    console.log('error: ', error);
    res.status(400).send(error);
  }
});

module.exports = router;
