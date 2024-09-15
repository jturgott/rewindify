import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpotifyAuthButton from "./SpotifyAuthButton.tsx";
import Callback from "./Callback.tsx";
import ViewTracks from "./ViewTracks.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {" "}
        {}
        <Route path="/" element={<SpotifyAuthButton />} /> {}
        <Route path="/callback" element={<Callback />} /> {}
        <Route path="/viewtracks" element={<ViewTracks />} /> {}
      </Routes>
    </Router>
  );
};

export default App;
