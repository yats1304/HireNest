import express, { urlencoded } from "express"
import dotenv from "dotenv"
import routes from "./routes/upload.route.js";
import cors from "cors"
import { v2 as cloudinary } from 'cloudinary';

dotenv.config()

  cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });

const app = express();

const PORT = process.env.PORT;

app.use(cors())

app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({limit: "50mb", extended: true}))

app.use("/api/utils", routes)

app.listen(PORT, ()=>{
    console.log(`Utils service running on http://localhost:${PORT}`)
})