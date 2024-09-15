import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          console.log("before fetch");
          const response = await fetch(
            `http://localhost:5000/auth?code=${code}`
          );
          console.log("after fetch");

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("Token response:", data);

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
