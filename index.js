// Initialization
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log('shift up is running on ', port)
});

// Initialization done

/******************* */
/*mongoDb*/
/******************* */

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wtx9jbs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const database = client.db("AllcarDB");
        const userCollection = client.db("AllcarDB").collection('users');
        const cartCollection = client.db("AllcarDB").collection('cartlist')
        const carsCollection = database.collection("cars");



        app.get('/allcars', async (req, res) => {

            const cursor = carsCollection.find();
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);

        })
        app.get('/addedtocart', async (req, res) => {
            const result = await cartCollection.find().toArray();
            res.send(result)
        })
        // delete
        app.get('/addedtocart/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.findOne(query);
            console.log(result);
            res.send(result)
            console.log(id);

        })
        app.delete('/addedtocart/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query);
            console.log(result);
            res.send(result)
            console.log(id);

        })


        app.get('/allcars/:id', async (req, res) => {
            const id = req.params.id;
            const news = { _id: new ObjectId(id) };
            const car = await carsCollection.findOne(news);
            res.send(car)
            console.log(car, "hello");

        })
        app.post('/allcars', async (req, res) => {
            const newCar = req.body;
            const result = await carsCollection.insertOne(newCar)
            res.send(result)
        })
        app.get('/user', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        app.post('/addedtocart', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await cartCollection.insertOne(product);
            res.send(result)
        })

        app.put('/allcars/:id', async (req, res) => {
            const updateCars = req.body;
            const id = req.params.id;
            const options = { upsert: true };
            console.log(updateCars);
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    image: updateCars.image,
                    Bname: updateCars.Bname,
                    Cname: updateCars.Cname,
                    Ctype: updateCars.Ctype,
                    price: updateCars.price,
                    rating: updateCars.rating
                },
            };
            const result = await carsCollection.updateOne(query, updateDoc, options);
            res.send(result);

        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);






/******************* */
/*mongoDb end here*/
/******************* */










app.get('/', async (req, res) => {
    res.send('shift up server is running......')
})


