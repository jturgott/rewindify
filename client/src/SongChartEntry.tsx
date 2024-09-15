import React from 'react';
import './SongChartEntry.css'; // Import the CSS file

interface SongChartEntryProps {
  rank: number;
  title: string;
  artist: string;
  isNew: boolean;
  isFavorite: boolean;
  albumArtUrl: string
  // Add other properties as needed
}

const SongChartEntry: React.FC<SongChartEntryProps> = ({
  rank,
  title,
  artist,
  isNew,
  isFavorite,
  albumArtUrl,
}) => {
  console.log(albumArtUrl);
  return (
    <div className="song-chart-entry">
      <div className="rank">{rank}</div>
      <div className="song-info">
        <div className="album-art"> <img src={albumArtUrl}/></div>
        <div>
          <div className="title">{title}</div>
          <div className="artist">{artist}</div>
        </div>
      </div>
      <div className="actions">
              {isNew ? ( 
            <span className="new-icon">→</span> 
        ) : ( 
            <span className="new-icon">●</span> 
        )} 
        {isFavorite && <span className="favorite-icon">★</span>}
      </div>
      {/* Add more divs for the additional columns as needed */}
    </div>
  );
};

export default SongChartEntry;