import express from "express";
import { HelloWorld } from "../controllers/globalController.js";

const globalRoutes = express.Router();

globalRoutes.get("/hello-world", HelloWorld);

export default globalRoutes;
