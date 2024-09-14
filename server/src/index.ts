import * as express from "express";
import * as mongoose from "mongoose";

import { config } from 'dotenv';
config();

import Song from "./models/songs";

const PORT = 5000;
const app = express();

app.get('/hello', (req, res) => {
    res.send('gg')
})

app.post("/songs", async (req, res) => {
    const newSong = new Song({title: 'Cool song fr'});
    const createdSong = await newSong.save();
    res.json(createdSong);

})

const db = mongoose.connect(
    process.env.MONGO_URL!
    ).then(
    () => {
        console.log(`listening on port ${PORT}`)
        app.listen(PORT);
    }
)

