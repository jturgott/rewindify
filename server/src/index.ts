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
  methods: ['GET', 'POST'],        // Allow these HTTP methods
  allowedHeaders: ['Content-Type',   
'Authorization'], // Allow these headers   

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
        res.json(data);

        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }else{
        res.status(400).json({ error: 'Missing authorization code' });
      }
    });

    export interface TrackDetails{
        name: string,
        artists: string[],
        album: string,
        image: string,
    }

let sdk: SpotifyApi;

app.post('/get-track-list', async (req,res) => {
  let data = req.body;
  console.log(`In the post body ${JSON.stringify(data)}`)
  sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID, data); // SDK now authenticated as client-side user
  await storeTopTracks();
  const recentTracks = await TopTracks(new Date().toISOString().slice(0, 10));
  const oldTracks = await TopTracks(new Date().toISOString().slice(0,10));
  res.json({recentTracks: recentTracks.songs, oldTracks: oldTracks.songs});
})

async function storeTopTracks(){
  const tracks = await sdk.currentUser.topItems("tracks");
  const date = new Date().toISOString().slice(0, 10);
  const userProfile = await sdk.currentUser.profile();
  const userId = userProfile.id;
  let trackList = tracks.items.map((track) => ({
    name: track.name, 
    artists: track.artists.map((artist) => artist.name), 
    albumName: track.album.name,
    albumImageUrl: track.album.images[0].url
}));
  console.log(trackList);
  const songs = new Song({time: date,
                          userId: userId,
                          songs: trackList,
  })
  await songs.save();
}
async function TopTracks(beforeDate?: string) {
  const userProfile = await sdk.currentUser.profile();
  const userId = userProfile.id;

  try {
    const query: any = { userId };
    if (beforeDate) {
      query.time = { $lte: beforeDate }; // Add date filter if beforeDate is provided
    }

    const mostRecentEntry = await Song.findOne(query)
      .sort({ time: -1 })
      .limit(1);

    if (mostRecentEntry) {
      return mostRecentEntry;
    } else {
      console.error('No entries found for the user before the specified date');
      // You might want to handle this case differently in your application
      // (e.g., return an empty list or a specific error response)
    }
  } catch (error) {
    console.error("Error fetching most recent entry:", error);
    // Handle the error appropriately
  }
}

const db = mongoose.connect(
    process.env.MONGO_URL!
    ).then(
    () => {
        console.log(`listening on port ${PORT}`)
        app.listen(PORT);
    }
)