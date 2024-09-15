import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          console.log("before fetch");
          const response = await fetch(`http://localhost:5000/auth?code=${code}`);
          console.log("after fetch");

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Token response:', data);

          // Store the token in local storage (or consider more secure options)

      } catch (error) {
          console.error('Error fetching token:', error);
          // Handle errors gracefully
      }
      } 

      navigate('/viewtracks'); // Navigate after token handling, regardless of success/failure
    };

    getToken();
  }, [navigate]); // Include navigate in dependency array

  return <div>Loading...</div>;
};

export default Callback;