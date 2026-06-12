import express from "express";
import jobRoute from "./routes/job.route.js";
import { connectKafka } from "./producer.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

connectKafka();

app.use("/api/job", jobRoute);

export default app;
