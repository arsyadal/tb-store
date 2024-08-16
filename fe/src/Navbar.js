import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Navbar({ cartCount }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`/api/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">
        MyShop
      </a>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link" href="#">
              Home <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Features
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Pricing
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ml-2">
          <li className="nav-item position-relative">
            <a className="nav-link" href="#">
              <i className="fas fa-shopping-cart" style={{ fontSize: "24px" }}></i>
              {cartCount > 0 && (
                <span className="badge badge-danger position-absolute" style={{ top: "-10px", right: "-10px" }}>
                  {cartCount}
                </span>
              )}
            </a>
          </li>
        </ul>
      </div>
      <div className="search-results">
        {searchResults.map((result) => (
          <div key={result.id}>{result.name}</div>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
