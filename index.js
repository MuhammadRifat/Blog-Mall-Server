const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a7xog.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogsCollection = client.db(`${process.env.DB_NAME}`).collection("blogs");
  console.log("database connected");

  app.get('/', (req, res) => {
    res.send("It' Working!");
  })

  app.post('/addPost', (req, res) => {
    const postData = req.body;
    blogsCollection.insertOne(postData)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

//   app.post('/allPosts', (req, res) => {
//     const email = req.body.email;
//     memoriesCollection.find({email: email})
//       .toArray((err, result) => {
//         res.send(result);
//       })
//   })

//   app.delete('/deletePost/:id', (req, res) => {
//     memoriesCollection.deleteOne({ _id: ObjectId(req.params.id) })
//       .then(result => {
//         res.send(result.deletedCount > 0);
//       })
//   })

});

app.listen(process.env.PORT || port);