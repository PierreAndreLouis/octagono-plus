
import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get("/api/test", (req, res) => {
  console.log("Route test OK !");
  res.json({ message: "Serveur Express OK" });
});

app.get("/api/test2", (req, res) => {
  console.log("Route test OK 222 !");
  res.json({ message: "Serveur Express OK 222" });
});



