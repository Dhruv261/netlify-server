const mongoose = require('mongoose');
require('dotenv').config();
// mongoose.connect('mongodb://127.0.0.1:27017/FoodRepublic');

const name = process.env.DBNAME
const pass = process.env.DBPASS

mongoose
  .connect(
    `mongodb+srv://${name}:${pass}@db.ahjywno.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log('DB connected'))
  .catch((e) => console.log('Error in db', e));


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri =
//   'mongodb+srv://dhruv:asdfghjkl@cluster0.eb7gs5l.mongodb.net/?retryWrites=true&w=majority';
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// client.connect((err) => {
//   const collection = client.db('test').collection('devices');
//   // perform actions on the collection object
//   client.close();
// });

