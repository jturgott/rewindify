import React from 'react';

const SPOTIFY_CLIENT_ID = '233aa45be06b44d4be8c02dd58cd2264';
const REDIRECT_URI = 'http://localhost:5173/callback/';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SCOPES = 'user-read-private user-read-email user-top-read'; 

const SpotifyAuthButton: React.FC = () => {
  const handleLogin = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_type=code&show_dialog=true`;
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Spotify
    </button>
  );
};

export default SpotifyAuthButton;
