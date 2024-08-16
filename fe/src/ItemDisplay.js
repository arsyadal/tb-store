import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar"; // Import the Navbar component
import "./App.css"; // Import the CSS file

function ItemDisplay() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/items")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the items!", error);
      });
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const addCart = (item, event) => {
    setCart([...cart, item]);
    console.log("Item added to cart:", item);

    // Get the position of the item image
    const itemImage = event.target.closest(".card").querySelector("img");
    const rect = itemImage.getBoundingClientRect();

    // Create a clone of the item image for animation
    const clone = itemImage.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.classList.add("cart-animation");

    document.body.appendChild(clone);

    // Remove the clone after animation
    clone.addEventListener("animationend", () => {
      document.body.removeChild(clone);
    });
  };

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="container mt-4">
        <h2>Daftar Barang</h2>
        <input type="text" className="form-control mb-4" placeholder="Cari barang..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <div className="row">
          {filteredItems.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card">
                <img src={item.image} className="card-img-top" alt={item.name} />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Quantity: {item.quantity}</p>
                  <p className="card-text">Price: {formatPrice(item.price)}</p>
                  <p className="card-text">{item.description}</p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-primary">Beli Sekarang</button>
                    <button className="btn btn-secondary" onClick={(e) => addCart(item, e)}>
                      Tambah Keranjang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemDisplay;
