import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/artists", { withCredentials: true })
      .then((response) => {
        setArtists(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching artists:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Artists</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              <strong>ID:</strong> {artist.id}, <strong>Email:</strong>{" "}
              {artist.email}, <strong>Name:</strong> {artist.name},{" "}
              <strong>Password:</strong> {artist.password}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
