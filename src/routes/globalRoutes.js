import express from "express";
import { HelloWorld } from "../controllers/globalController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { exampleSchema } from "../utils/schema.js";

const globalRoutes = express.Router();

globalRoutes.get("/hello-world", HelloWorld);
globalRoutes.post("/test-validate", validateRequest(exampleSchema), async (req, res) => {
    return res.json({
        "message": "SUCCESS"
    })
});

export default globalRoutes;
