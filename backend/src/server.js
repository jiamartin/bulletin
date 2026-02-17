import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"

import rateLimiter from "../middleware/ratelimiter.js";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001
const __dirname = path.resolve();

connectDB();

// middleware
if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin: "http://localhoast:5173",
    }));
}
app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

//custom middleware
// app.use((req, res, next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// })

app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT: ", PORT);
    });
});