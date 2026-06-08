import express from "express"
import authRoutes from "./routes/auth.route.js"
import { connectKafka } from "./producer.js"
import { createClient } from "redis"
import cors from "cors"

const app = express()

export const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.connect().then(()=>console.log("Connected to Redis✅")).catch(console.error)

app.use(express.json())
app.use(cors())

connectKafka()

app.use("/api/auth", authRoutes)

export default app;