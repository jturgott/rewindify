import express from "express";
import * as mongoose from "mongoose";
import cors from 'cors';
import { config } from 'dotenv';
import Song from "./models/songs";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";




const PORT = 5000;
const app = express();

config();
const REDIRECT_URI = 'http://localhost:5173/callback/';
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow these HTTP methods
}));

app.get('/hello', (req, res) => {
    res.send('gg')
})

app.post("/songs", async (req, res) => {
    const newSong = new Song({title: 'Cool song fr'});
    const createdSong = await newSong.save();
    res.json(createdSong);

})

// Used to get the user's token for future API calls.
app.get('/auth', async (req, res) => {
      const code = req.query.code as string;

      if (code) {
        console.log("valid code");
        try {
          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`), 
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: REDIRECT_URI,
            }),
          });
          if (!response.ok) {
            throw new Error('Network response was not ok'); 
          }

          const data = await response.json();
          console.log(data);
          fetch('http://localhost:5000/accept-user-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Important: Specify JSON content type
            },
            body: JSON.stringify(data), // Send the token in the request body
        })
        res.json(data);

        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }else{
        res.status(400).json({ error: 'Missing authorization code' });
      }
    });

    interface TrackDetails{
        name: string,
        artists: string[],
        album: string,
        image: string,
    }

let sdk: SpotifyApi;

app.post('/accept-user-token', async(req, res) => {
    let data = req.body;
    console.log(`In the post body ${JSON.stringify(data)}`)
    sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID, data); // SDK now authenticated as client-side user
    const tracks = await sdk.currentUser.topItems("tracks");
    console.log(tracks);
}); 

const db = mongoose.connect(
    process.env.MONGO_URL!
    ).then(
    () => {
        console.log(`listening on port ${PORT}`)
        app.listen(PORT);
    }
)