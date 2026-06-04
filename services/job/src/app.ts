import express from "express"
import jobRoute from "./routes/route.job.js"

const app = express()

app.use(express.json())

app.use("/api/job",jobRoute)

export default app