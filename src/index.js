import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import globalRoutes from "./routes/globalRoutes.js";
import { connectDB } from "./utils/database.js";
import paymentRoutes from "./routes/paymentRoutes.js";
const app = express();

dotenv.config();

connectDB();

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
app.use("/api", authRoutes);
app.use("/api", paymentRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
