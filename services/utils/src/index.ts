import express, { urlencoded } from "express";
import dotenv from "dotenv";
import routes from "./routes/upload.route.js";
import routeAI from "./routes/ai.routes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { startSendMailConsumer } from "./consumer.js";

dotenv.config();

startSendMailConsumer();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();

const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/utils", routes);
app.use("/api/utils", routeAI);

app.listen(PORT, () => {
  console.log(`Utils service running on http://localhost:${PORT}`);
});
