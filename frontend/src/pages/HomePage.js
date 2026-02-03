import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/accommodations");
      const data = await response.json();

      const listingsData = data.data || data || [];

      const updatedListings = listingsData.map((listing) => {
        const priceInRands = listing.price;

        if (listing._id === "691293b13de31d4e8fea6b7a") {
          return {
            ...listing,
            price: priceInRands,
            images: [
              "https://cf.bstatic.com/xdata/images/hotel/max1024x768/599569921.jpg?k=63db9d0d77d71825956c9272840841017fc9e7513174c9e95d9917410c03fef4&o=",
              ...(listing.images || []).slice(1),
            ],
          };
        }

        return {
          ...listing,
          price: priceInRands,
        };
      });

      setListings(
        Array.isArray(updatedListings) ? updatedListings.slice(0, 8) : []
      );
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/locations?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/locations");
    }
  };

  const heroStyle = {
    minHeight: "100vh",
    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/BigCard.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    padding: "2rem",
  };

  const propertyTypes = [
    {
      image:
        "https://images.unsplash.com/photo-1696620130708-0869eac484d5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Southern Sun Hotel Durban",
    },
    {
      image:
        "https://images.unsplash.com/photo-1567450221352-567904a7f8e4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Ds",
      name: "Mount Nelson Hotel Cape Town",
    },
    {
      image:
        "https://images.unsplash.com/photo-1567625911658-140777a65f4c?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Beverly Hills Durban",
    },
    {
      image:
        "https://images.unsplash.com/photo-1607881482746-37afbd871aca?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "Oyster Box Durban",
    },
  ];

  return (
    <div className="homepage">
      <div style={heroStyle}>
        <div className="hero-content">
          <h1>Not sure where to go? Perfect.</h1>
          <button onClick={() => navigate("/locations")} className="cta-button">
            I'm flexible
          </button>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <h2>Inspirations for your next trip</h2>
          <div className="property-type-grid">
            {propertyTypes.map((type, index) => (
              <div key={index} className="property-type-card">
                <img src={type.image} alt={type.name} />
                <h3>{type.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="become-host-section">
        <div className="container">
          <div className="host-content">
            <div className="host-text">
              <h2>Shop airbnb gift cards</h2>
              <button className="host-button">Learn more</button>
            </div>
            <div className="host-image">
              <img
                src="https://plus.unsplash.com/premium_photo-1728398068094-d3d30740000f?q=80&w=1295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Gift Cards"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="become-host-section">
        <div className="container">
          <div className="host-content">
            <div className="host-text">
              <h2>Questions about hosting?</h2>
              <button className="host-button">Ask a superhost</button>
            </div>
            <div className="host-image">
              <img
                src="https://media.istockphoto.com/id/2152851992/photo/thoughtful-young-caucasian-woman-wearing-glasses-and-looking-at-exhibition-concept-of-museum.jpg?s=2048x2048&w=is&k=20&c=_TsH3UCwQMZaFku5fRRJ2Bv7vJxwU9DTaWfolQEVefk="
                alt="Host"
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Support</h4>
              <a href="/help">Help Center</a>
              <a href="/safety">AirCover</a>
              <a href="/safety">Safety information</a>
              <a href="/cancellation">Cancellation options</a>
              <a href="/covid">Our COVID-19 Response</a>
              <a href="/disabilities">Supporting people with disabilities</a>
              <a href="/neighborhood">Report a neighboorhood concern</a>
            </div>
            <div className="footer-section">
              <h4>Community</h4>
              <a href="/community">Airbnb.org: disaster relief housing</a>
              <a href="/support">Support: Afghan refugees</a>
              <a href="/accessibility">Celebrating diversity & belonging</a>
              <a href="/support">Combating discrimination</a>
            </div>
            <div className="footer-section">
              <h4>Hosting</h4>
              <a href="/host">Try hosting</a>
              <a href="/experience">Aircover: protection for Hosts</a>
              <a href="/resources">Explore hosting resources</a>
              <a href="/community">Visit our community forum</a>
              <a href="/responsible">How to host responsibly</a>
            </div>
            <div className="footer-section">
              <h4>About</h4>
              <a href="/news">Newsroom</a>
              <a href="/careers">Learn about new features</a>
              <a href="/careers">Letter from our founders</a>
              <a href="/careers">Careers</a>
              <a href="/investors">Investors</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Airbnb, Inc. Privacy.Terms</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
