import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

export default function ViewProfile() {
  const [profile, setProfile] = useState(null);
  const artistId = localStorage.getItem("artist_id");

  useEffect(() => {
    // Fetch user data from the backend
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        const user = response.data.find(
          (user) => user.artist_id === Number(artistId)
        );
        setProfile(user);
      })
      .catch((error) => {
        console.error("There was an error fetching the user data!", error);
      });
  }, [artistId]);

  if (!profile) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Profile Details</h1>
        <div style={styles.profileCard}>
          {profile.profile_picture && (
            <img
              src={`data:image/jpeg;base64,${profile.profile_picture}`}
              alt="Profile"
              style={styles.profileImage}
            />
          )}
          <p style={styles.text}>
            <strong>Username:</strong> {profile.username}
          </p>
          <p style={styles.text}>
            <strong>First Name:</strong> {profile.first_name}
          </p>
          <p style={styles.text}>
            <strong>Last Name:</strong> {profile.last_name}
          </p>
          <p style={styles.text}>
            <strong>Email:</strong> {profile.email}
          </p>
          <p style={styles.text}>
            <strong>Contact No:</strong> {profile.contact_no}
          </p>
          <p style={styles.text}>
            <strong>Type of User:</strong> {profile.type_of_user}
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "2em",
    marginBottom: "20px",
    color: "#333",
  },
  profileCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1.2em",
    color: "#555",
    margin: "10px 0",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.5em",
    color: "#777",
    marginTop: "50px",
  },
};
