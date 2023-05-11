const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtCode = 'unknownCode';
const auth = async (req, res, next) => {
  console.log('Auth running');
  try {
    const token = req.headers.token.replace('Bearer', '');
    console.log('token in auth: ', token);
    const decoded = jwt.verify(token, jwtCode);
    console.log('decoded: ', decoded);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) {
      throw new Error();
    }
    console.log('user is authenticated');
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.', e: e.message });
  }
};
module.exports = auth;
