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
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");
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

    app.get('/blogs', (req, res) => {
        blogsCollection.find({})
            .toArray((err, result) => {
                res.send(result);
            })
    })

    app.delete('/deleteBlog', (req, res) => {
        blogsCollection.deleteOne({ _id: ObjectId(req.body.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    // checking logged in user is admin or not
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents.length > 0);
            })
    })

});

app.listen(process.env.PORT || port);