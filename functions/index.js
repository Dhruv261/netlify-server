require('dotenv').config();
const express = require('express');
const app = express();
// const cors = require('cors');
// app.use(cors());
const serverless = require('serverless-http');
require('../database/mongoose');
app.use(express.json());
const userRouter = require('../routes/user');
const playlistRouter = require('../routes/PassWork');
const router = express.Router();



router.get('/', (req, res) => {
  res.json({
    path: 'Home',
  });
});

router.get('/json', (req, res) => {
  res.json({
    path: '/json',
  });
});

app.use('/', router);
app.use('/', userRouter);
app.use('/', playlistRouter);

module.exports.handler = serverless(app);
