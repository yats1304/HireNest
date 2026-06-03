import express, { json } from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT;

app.use(express.json())

app.use("/api/user", userRoutes)

app.listen(PORT, ()=>{
    console.log(`User service running on http://localhost:${PORT}`)
})