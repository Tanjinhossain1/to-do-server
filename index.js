const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ja3y1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const todoCollection = client.db("todo").collection("task");
        app.post('/addTodo', async (req, res) => {
            const todoDetail = req.body;
            const result = await todoCollection.insertOne(todoDetail);
            res.send(result)
        })
        app.get('/todo', async (req, res) => {
            const email = req.query.email
            const allTodo = await todoCollection.find({ email: email }).toArray();
            res.send(allTodo)
        })
        app.delete('/todoDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {
        // client.close();
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('TODO APP IS RUNNING')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})