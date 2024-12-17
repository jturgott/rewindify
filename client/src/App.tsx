import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpotifyAuthButton from "./SpotifyAuthButton.tsx";
import Callback from "./Callback.tsx";
import ViewTracks from "./ViewTracks.tsx";
import Calendar from "./Calendar.tsx";
import Navbar from "./Navbar.tsx"
import "./App.css"

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // Used to update the date that we're comparing with the current date.
  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
  };
  const toggleCalendarVisibility = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="homepage"><SpotifyAuthButton /></div>} />
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/viewtracks"
          element={
            <div className="view-tracks-container">
              <Navbar                 toggleCalendarVisibility={toggleCalendarVisibility} 
                isCalendarVisible={isCalendarVisible} />
              <div className="content-wrapper"> {/* Wrap ViewTracks and Calendar */}
                <ViewTracks selectedDate={selectedDate} />
                {isCalendarVisible && (
                  <Calendar onDateSelected={handleDateSelected} />
                )}
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
