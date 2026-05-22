const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

dotenv.config();

const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
);

const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
};

async function run() {
  try {
    // await client.connect();

    const db = client.db("ideavault");
    const ideaCollection = db.collection("ideas");
    const commentCollection = db.collection("comments");

    app.post("/ideas", verifyToken, async (req, res) => {
      const ideaData = req.body;
      console.log(ideaData);
      const result = await ideaCollection.insertOne(ideaData);

      res.json(result);
    });

    app.get("/ideas/trending", async (req, res) => {
      const result = await ideaCollection.find().sort({ likes: -1 }).limit(6).toArray();
      res.json(result);
    });

    app.get("/ideas", async (req, res) => {
      const { search, category } = req.query;
      const filter = {};

      if (search) {
        filter.title = { $regex: search, $options: "i" };
      }

      if (category) {
        filter.category = category;
      }

      const result = await ideaCollection.find(filter).toArray();
      res.json(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("IdeaVault Server is running smoothly");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
