import express from "express"
import authRoutes from "./routes/route.auth.js"
import { connectKafka } from "./producer.js"
import { createClient } from "redis"

const app = express()

export const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.connect().then(()=>console.log("Connected to Redis✅")).catch(console.error)

app.use(express.json())

connectKafka()

app.use("/api/auth", authRoutes)

export default app;