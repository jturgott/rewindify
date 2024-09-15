import React from "react";
import "./SongChartEntry.css"; // Import the CSS file

interface SongChartEntryProps {
  rank: number;
  title: string;
  artist: string;
  isNew: boolean;
  isFavorite: boolean;
  albumArtUrl: string;
  rankDifference: number;
  // Add other properties as needed
}

const SongChartEntry: React.FC<SongChartEntryProps> = ({
  rank,
  title,
  artist,
  isNew,
  isFavorite,
  albumArtUrl,
  rankDifference,
}) => {
  console.log(albumArtUrl);
  return (
    <div className="song-chart-entry">
      <div className="rank">{rank}</div>
      <div className="song-info">
        <div className="album-art">
          {" "}
          <img src={albumArtUrl} alt={title} />{" "}
        </div>
        <div>
          <div className="title">{title}</div>
          <div className="artist">{artist}</div>
        </div>
      </div>
      <div className="actions">
        {isFavorite && <span className="favorite-icon">★</span>}

        <span className={`trend ${isNew ? "new" : "same"}`}>
          {isNew && "→"}
          {!isNew && rankDifference != 0 && (
            <>
              {rankDifference > 0 && "▲"}
              {rankDifference < 0 && "▼"}
              {` (${Math.abs(rankDifference)})`} {}
            </>
          )}
          {!isNew && rankDifference === 0 && "●"}
        </span>
      </div>
    </div>
  );
};

export default SongChartEntry;
