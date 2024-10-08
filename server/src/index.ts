import "./instrument";
import express from "express";
import * as mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import Song from "./models/songs";
import { AccessToken, SpotifyApi } from "@spotify/web-api-ts-sdk";
import * as Sentry from "@sentry/node";

const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://b7e8d4ed2036bb24852fd05f30412b34@o4507980203163648.ingest.us.sentry.io/4507980286197760",
  integrations: [nodeProfilingIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
const cookieParser = require("cookie-parser");
const PORT = 5000;
const app = express();

config();
const REDIRECT_URI = "http://localhost:3000/callback/";
let sdk: SpotifyApi;

app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "baggage",
      "sentry-trace",
    ], // Allow these headers
    credentials: true,
  })
);

// Get's a user's token for future API calls
app.get("/auth", async (req, res) => {
  const code = req.query.code as string;

  if (code) {
    console.log("valid code");
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            btoa(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("data:" + JSON.stringify(data));
      res.cookie("token", data, { httpOnly: true });
      res.status(201).json({ data: null, message: "cookie set successfully." });
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  } else {
    res.status(400).json({ error: "Missing authorization code" });
  }
});

export interface TrackDetails {
  name: string;
  artists: string[];
  album: string;
  image: string;
}

//Returns a list containing a list of tracks from the old date and new date
app.post("/get-track-list", async (req, res) => {
  let data = req.body;
  console.log(req.cookies);
  sdk = SpotifyApi.withAccessToken(
    process.env.SPOTIFY_CLIENT_ID,
    req.cookies.token // Access the token directly from req.cookies
  );

  await storeTopTracks();
  const recentTracks = await TopTracks(new Date().toISOString());
  const oldTracks = await TopTracks(data.date);
  res.json({ recentTracks: recentTracks.songs, oldTracks: oldTracks.songs });
});

// Stores the tracklist in the database
async function storeTopTracks() {
  const tracks = await sdk.currentUser.topItems("tracks");
  const date = new Date();
  const userProfile = await sdk.currentUser.profile();
  const userId = userProfile.id;
  let trackList = tracks.items.map((track) => ({
    name: track.name,
    artists: track.artists.map((artist) => artist.name),
    albumName: track.album.name,
    albumImageUrl: track.album.images[0].url,
  }));
  console.log(trackList);
  const songs = new Song({ time: date, userId: userId, songs: trackList });
  await songs.save();
}

// Fetches the most recent tracklist befor ethe parameter date
async function TopTracks(beforeDate?: string) {
  const userProfile = await sdk.currentUser.profile();
  const userId = userProfile.id;
  console.log("ID" + userId);

  try {
    const query: any = { userId };
    if (beforeDate) {
      const endOfDay = new Date(beforeDate);
      endOfDay.setHours(23, 59, 59, 999); // Set to the last millisecond of the day

      query.time = { $lte: endOfDay.toISOString() };
    }

    const mostRecentEntry = await Song.findOne(query)
      .sort({ time: -1 })
      .limit(1);

    if (mostRecentEntry) {
      return mostRecentEntry;
    } else {
      console.error("No entries found for the user before the specified date");
    }
  } catch (error) {
    console.error("Error fetching most recent entry:", error);
  }
}

// Returns a list of dates where the user has a stored tracklist.
app.post("/dates", async (req, res) => {
  try {
    console.log(req.cookies);
    const data: AccessToken = req.cookies.token;
    console.log(`In the post body ${JSON.stringify(data)}`);
    sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID, data);
    const userProfile = await sdk.currentUser.profile();
    const userId = userProfile.id;
    const dateStrings = await Song.distinct("time", { userId });

    res.json(dateStrings);
  } catch (error) {
    console.error("Error fetching dates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

Sentry.setupExpressErrorHandler(app);

const db = mongoose.connect(process.env.MONGO_URL!).then(() => {
  console.log(`listening on port ${PORT}`);
  app.listen(PORT);
});
