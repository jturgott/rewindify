import React from "react";
import "./SongChartEntry.css";

interface SongChartEntryProps {
  rank: number;
  title: string;
  artist: string;
  isNew: boolean;
  isFavorite: boolean;
  albumArtUrl: string;
  rankDifference: number;
}

// Component for each element on the tracklist
const SongChartEntry: React.FC<SongChartEntryProps> = ({
  rank,
  title,
  artist,
  isNew,
  albumArtUrl,
  rankDifference,
}) => {
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
        {/*If a track is in the new list but not the old list, there will be a right arrow. 
        If the track is higher up on the new list, there will be an up arrow. 
        If the track is further down on the new list, there will be a down arrow. 
        If the track in the same place in both lists, there will be a circle.*/}
        <span className={`trend ${isNew ? "new" : "same"}`}>
          {isNew && "→"}
          {!isNew && rankDifference != 0 && (
            <>
              {rankDifference > 0 && "▲"}
              {rankDifference < 0 && "▼"}
              {` (${rankDifference})`} {}
            </>
          )}
          {!isNew && rankDifference === 0 && "●"}
        </span>
      </div>
    </div>
  );
};

export default SongChartEntry;
