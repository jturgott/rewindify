import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpotifyAuthButton from "./SpotifyAuthButton.tsx";
import Callback from "./Callback.tsx";
import ViewTracks from "./ViewTracks.tsx";
import Calendar from './Calendar.tsx';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); 

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date); 
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpotifyAuthButton />} />
        <Route path="/callback" element={<Callback />} />
        <Route 
          path="/viewtracks" 
          element={
            <div className="view-tracks-container"> 
              <ViewTracks 
                selectedDate={selectedDate} 
              />
              <Calendar onDateSelected={handleDateSelected} /> 
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;