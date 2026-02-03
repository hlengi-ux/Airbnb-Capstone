import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LocationsPage from "./pages/LocationsPage";
import LocationDetails from "./pages/LocationDetails";
import CreateListing from "./pages/CreateListing";
import ViewListings from "./pages/ViewListings";
import EditListing from "./pages/EditListing";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/property/:id" element={<LocationDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/create" element={<CreateListing />} />
                <Route path="/admin/listings" element={<ViewListings />} />
                <Route path="/admin/edit/:id" element={<EditListing />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
