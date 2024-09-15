import React, { useState, useEffect } from 'react';
import SongChartEntry from './SongChartEntry';

interface TrackDetails {
  rankDifference: number;
  name: string;
  artists: string[];
  album: string;
  albumImageUrl: string;
  isNew: boolean;
  trend: 'new' | 'up' | 'down' | 'same';
}

const ViewTracks: React.FC = () => {
  const [tracks, setTracks] = useState<TrackDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        console.log((localStorage.getItem('spotifyAccessToken')))
        const response = fetch('http://localhost:5000/get-track-list', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: localStorage.getItem('spotifyAccessToken'),
      })

      const result = await response;
        if (!result.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await result.json();

        const shuffledOldTracks = data.oldTracks
          .map((value: TrackDetails) => ({ value, sort: Math.random() }))
          .sort((a: { sort: number; }, b: { sort: number; }) => a.sort - b.sort)
          .map((element: {value: TrackDetails}) => element.value);

        console.log(shuffledOldTracks);
        const oldTrackMap = new Map(); 
        shuffledOldTracks.forEach((element: TrackDetails, index: number) => {
          oldTrackMap.set(element.name, index);
        });

        console.log(oldTrackMap);
        const markedTracks = data.recentTracks.map((track: TrackDetails, index: number) => {
          const oldRank = oldTrackMap.get(track.name);
          const currentRank = index + 1;
          const rankDifference = oldRank !== undefined ? oldRank - currentRank : 0;

          return { ...track, isNew: oldRank === undefined, rankDifference };
        });


        console.log(markedTracks);
        setTracks(markedTracks);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {tracks.map((track, index) => (
        <SongChartEntry
          key={index}
          rank={index + 1}
          title={track.name}
          artist={track.artists.join(', ')}
          isNew={track.isNew}
          isFavorite={false} 
          albumArtUrl={track.albumImageUrl}
          rankDifference={track.rankDifference} // Pass the rankDifference to SongChartEntry
        />
      ))}
    </div>
  );
};

export default ViewTracks;