import React from "react";
import painting from "./painting.png";
import Photography from "./photography.png";
import sculpture from "./sculpture.png";
import graphic from "./graphicDesign.png";
import nail from "./nail.png";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };
  return (
    <div>
      <header style={{ backgroundColor: "#004d40", color: "#fff", padding: "20px 0", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
        <div style={{ width: "90%", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>Artistic Creations</div>
          <div>
            <button style={{ marginLeft: "10px", backgroundColor: "#4caf50", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer" }} onClick={handleLogin}>
              Login
            </button>
            <button style={{ marginLeft: "10px", backgroundColor: "#4caf50", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer" }} onClick={handleSignup}>
              Signup
            </button>
          </div>
        </div>
      </header>
      <main style={{ paddingTop: "120px", paddingBottom: "60px", overflowY: "auto" }}>
        <section style={{ textAlign: "center", marginTop: "80px", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>Welcome to Artistic Creations</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Unlock your creativity with our platform.</p>
        </section>
        <section style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100px", marginRight: "20px" }}>
              <img src={painting} alt="Painting" style={{ width: "100%", height: "auto" }} />
              <h3 style={{ marginTop: "10px" }}>Painting</h3>
            </div>
            <div style={{ width: "100px", marginRight: "20px" }}>
              <img src={Photography} alt="Photography" style={{ width: "100%", height: "auto" }} />
              <h3 style={{ marginTop: "10px" }}>Photography</h3>
            </div>
            <div style={{ width: "100px", marginRight: "20px" }}>
              <img src={sculpture} alt="Sculpture" style={{ width: "100%", height: "auto" }} />
              <h3 style={{ marginTop: "10px" }}>Sculpture</h3>
            </div>
            <div style={{ width: "100px", marginRight: "20px" }}>
              <img src={graphic} alt="Graphic Design" style={{ width: "100%", height: "auto" }} />
              <h3 style={{ marginTop: "10px" }}>Graphic Design</h3>
            </div>
            <div style={{ width: "100px" }}>
              <img src={nail} alt="Nail Art" style={{ width: "100%", height: "auto" }} />
              <h3 style={{ marginTop: "10px" }}>Nail Art</h3>
            </div>
          </div>
        </section>
        {/* Other sections */}
      </main>
      <footer style={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 1000, backgroundColor: "#004d40", color: "#fff", padding: "20px 0", textAlign: "center" }}>
        <div style={{ width: "90%", margin: "0 auto" }}>
          <p>&copy; 2024 Artistic Creations. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
