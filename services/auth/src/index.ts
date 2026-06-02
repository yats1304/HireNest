import app from "./app.js";
import dotenv from "dotenv";
import { initDB } from "./db/init.js";

dotenv.config();

const PORT = process.env.PORT;

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Auth service is running on http://localhost:${PORT}`);
    });
});