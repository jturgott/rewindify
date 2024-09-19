import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Callback page after authenticating with spotify.
//Redirects users to the ViewTracks page after loading.
const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          //Fetches access code for authentication
          const response = await fetch(
            `http://localhost:5000/auth?code=${code}`
          );
          console.log("after fetch");

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("Token response:", data);

          //Access token is stored so we can call spotify API from the server
          //With our application's secret
          localStorage.setItem("spotifyAccessToken", JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }

      navigate("/viewtracks");
    };

    getToken();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
