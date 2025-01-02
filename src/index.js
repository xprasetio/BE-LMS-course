import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import globalRoutes from "./routes/globalRoutes.js";
const app = express();

dotenv.config();

const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    name: "Eko Prasetio Pratama",
    age: 22,
  });
});

app.use("/api", globalRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
