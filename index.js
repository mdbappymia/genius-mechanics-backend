const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iuevi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanics");
    const servicesCollection = database.collection("services");

    // GET SERVICE API
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.json(services);
    });

    // GET SINGLE SERVICE
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      console.log(service);
      res.send(service);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api");
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.error);

app.get("/", (req, res) => {
  res.send("server is running");
});

const port = process.env.port || 5000;

app.listen(port, () => {
  console.log("Server running on port", port);
});
