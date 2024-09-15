import React, { useState, useEffect } from 'react';
import SongChartEntry from './SongChartEntry';

interface TrackDetails {
  name: string;
  artists: string[];
  album: string;
  albumImageUrl: string;
  isNew: boolean;
}

const ViewTracks: React.FC = () => {
  const [tracks, setTracks] = useState<TrackDetails[]>([]); // Use state to store fetched tracks
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<Error | null>(null); // Add error state

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        console.log((localStorage.getItem('spotifyAccessToken')))
        const response = fetch('http://localhost:5000/get-track-list', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json', // Important: Specify JSON content type
          },
          body: localStorage.getItem('spotifyAccessToken'), // Send the token in the request body
      })

      const result = await response;
        if (!result.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await result.json();
        const oldTrackIds = new Set(data.oldTracks.map((track: TrackDetails) => track.name)); // Assuming your TrackDetails has an 'id' field

        // Mark tracks as new if they're in recentTracks but not in oldTracks
        const markedTracks = data.recentTracks.map((track: TrackDetails) => ({
          ...track,
          isNew: !oldTrackIds.has(track.name)
        }));

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
        />
      ))}
    </div>
  );
};

export default ViewTracks;