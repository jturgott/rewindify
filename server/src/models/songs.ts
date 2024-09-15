import * as mongoose from "mongoose";
import { TrackDetails } from "..";

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const SongSchema = new Schema({
    time: String,
    userId: String,
    songs: [
        {
            name: String,
            artists: [String], 
            albumName: String, // Add albumName
            albumImageUrl: String, // Add albumImageUrl
        }
    ],
});

const SongModel = mongoose.model("Song", SongSchema)

export default SongModel