const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gtc9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully')

        const database = client.db("bdTourPlanner");
        const toursCollection = database.collection('tours');
        const bookingsCollection = database.collection('bookings')
        const reviewsCollection = database.collection("reviews")

        // get tour API
        app.get('/tours', async (req, res) => {
            const cursor = toursCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        })

        // get booking API
        app.get('/bookings', async (req, res) => {
            const cursor = bookingsCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        })

        // get reviews API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({})
            const review = await cursor.toArray();
            res.send(review);
        })

        // get single Tour Location
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tour = await toursCollection.findOne(query);
            res.json(tour);
        })


        // post (add) a new tour in API
        app.post('/tours', async (req, res) => {
            const tour = req.body;
            const result = await toursCollection.insertOne(tour);
            res.json(result);
        })


        // post booking API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log('hitting the post', booking);

            const result = await bookingsCollection.insertOne(booking);
            res.json(result);
        })

        // post reviews API
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);

        })

        // update booking status in API


        // delete single booking API

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server Running Properly')
});

app.listen(port, () => {
    console.log('server running on port: ', port);
})