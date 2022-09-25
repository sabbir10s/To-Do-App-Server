const express = require('express');
const app = express();
const port = process.env.PROT || 5000;
const cors = require('cors');
app.use(cors())
app.use(express.json())
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.px8ct6k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("ToDoApp").collection("task");
        const task = { title: 'Book Reading', description: "To I will Read Book", status: "todo" }
        const result = await taskCollection.insertOne(task)
        console.log(result.insertedId);

    } finally {
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
