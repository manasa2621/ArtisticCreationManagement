import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/login/SignIn";
import SignupForm from "./components/login/Signuppage";
import LandingPage from "./components/landing/landingPage";
import Home from "./components/login/home";
import ArtImageForm from "./components/admin/artImageForm";
import ArtDetailsPage from "./components/admin/artDetails";
import ViewPurchaseDetails from "./components/admin/view-purchase-details";
import ViewProfile from "./components/admin/ViewProfile";
import UserHomePage from "./components/user/UserHomePage";
import UserProfile from "./components/user/view_user_profile";
import Purchase from "./components/login/Purchase";
import ViewPurchaseHistory from "./components/user/viewPurchaseHistory";
import CongratulationsBanner from "./components/congratulationBanner"
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />{" "}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/view-user-profile" element={<UserProfile />} />
          <Route
            path="/view-purchase-history"
            element={<ViewPurchaseHistory />}
          />
          <Route
            path="/view-purchase-details"
            element={<ViewPurchaseDetails />}
          />
          <Route path="/admin-home" element={<ArtImageForm />} />{" "}
          <Route path="/congrats" element={<CongratulationsBanner />} />{" "}
          <Route path="/user-home" element={<UserHomePage />} />{" "}
          <Route path="/purchase" element={<Purchase />} />{" "}
          <Route path="/add-art-details" element={<ArtDetailsPage />} />{" "}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
