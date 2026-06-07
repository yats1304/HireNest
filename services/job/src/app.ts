import express from "express"
import jobRoute from "./routes/job.route.js"
import { connectKafka } from "./producer.js"

const app = express()

app.use(express.json())

connectKafka()

app.use("/api/job",jobRoute)

export default app