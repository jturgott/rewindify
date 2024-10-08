import React, { useState, useEffect } from "react";
import SongChartEntry from "./SongChartEntry";

// Holds details about tracks from the new tracklist and how they compare to the
// older tracklist
interface TrackDetails {
  rankDifference: number;
  name: string;
  artists: string[];
  album: string;
  albumImageUrl: string;
  isNew: boolean;
}

interface ViewTracksProps {
  selectedDate: Date | null;
}

const ViewTracks: React.FC<ViewTracksProps> = ({ selectedDate }) => {
  const [tracks, setTracks] = useState<TrackDetails[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        //Fetches a list of track details
        const response = fetch("http://localhost:5000/get-track-list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("spotifyAccessToken"),
            date: selectedDate ? selectedDate : new Date(),
          }),
          credentials: "include",
        });

        const result = await response;
        if (!result.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await result.json();

        const oldTracks = data.oldTracks;

        const oldTrackMap = new Map();
        oldTracks.forEach((element: TrackDetails, index: number) => {
          oldTrackMap.set(element.name, index + 1);
        });

        console.log(oldTrackMap);
        const markedTracks = data.recentTracks.map(
          (track: TrackDetails, index: number) => {
            const oldRank = oldTrackMap.get(track.name);
            const currentRank = index + 1;
            const rankDifference =
              oldRank !== undefined ? oldRank - currentRank : 0;

            return { ...track, isNew: oldRank === undefined, rankDifference };
          }
        );

        console.log(markedTracks);
        setTracks(markedTracks);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [selectedDate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div id="tracklist">
      {tracks!.map((track, index) => (
        <SongChartEntry
          key={index}
          rank={index + 1}
          title={track.name}
          artist={track.artists.join(", ")}
          isNew={track.isNew}
          isFavorite={false}
          albumArtUrl={track.albumImageUrl}
          rankDifference={track.rankDifference}
        />
      ))}
    </div>
  );
};

export default ViewTracks;
