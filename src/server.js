require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {connectToDb, getDb} = require("./db");
const {ObjectId} = require("mongodb");
const cron = require("node-cron");
const {scrape} = require("./scrape");
const {sendEmail} = require("./email");

const server = express();

server.use(cors())
server.use(express.json())

const PORT = process.env.PORT;

let db;

connectToDb((err) => {
    if (!err) {
        server.listen(PORT, function () {
            console.log(`server started on http://localhost:${PORT}/`)
        })
        db = getDb()
    }
})

cron.schedule("* * * * *", async function () {
    const products = await db.collection('products')
        .find()
        .toArray();
    let acc = ""
    try {
        for (const item of products) {
            const res = await scrape(item.link, item.priceSelector)
            acc += res + "\n"
        }
    } catch (err) {
        console.log(err.message);
    }
    sendEmail(acc)
});

server.get('/products', (req, res) => {
    let products = []
    db.collection('products')
        .find()
        .forEach(b => products.push(b))
        .then(() => {
            res.status(200).json(products)
        })
        .catch(() => {
            res.status(500).json({error: 'could not fetch products'})
        })
})

server.post('/products', (req, res) => {
    const product = req.body;
    db.collection('products')
        .insertOne(product)
        .then(result => {
            res.status(201).json(product)
        })
        .catch(err => {
            res.status(500).json({error: 'could not add a product'})
        })
})

server.delete('/products/:id', (req, res) => {
    const id = req.params.id
    if (ObjectId.isValid(id)) {
        db.collection('products')
            .deleteOne({_id: new ObjectId(id)})
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({error: 'could not delete'})
            })
    } else {
        res.status(500).json({error: 'Not a valid id'})
    }
})
