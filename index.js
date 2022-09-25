const express = require('express');
const app = express();
const port = process.env.PROT || 5000;
const cors = require('cors');
app.use(cors())
app.use(express.json())
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.px8ct6k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("ToDoApp").collection("task");

        app.get('/task', async (req, res) => {
            const query = {}
            const task = await taskCollection.find(query).toArray();
            res.send(task)
        })


        app.post('/task', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask)
            res.send(result)
        })
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const { title, description, status } = req.body
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: title,
                    description: description,
                    status: status,
                },
            };

            const result = await taskCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        })



    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Node server is running");
})
app.listen(port, () => {
    console.log("CRUD server is running");
})
