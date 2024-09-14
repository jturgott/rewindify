import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const SongSchema = new Schema({
    title: String,
})

const SongModel = mongoose.model("Song", SongSchema)

export default SongModel