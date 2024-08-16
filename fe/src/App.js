import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ItemsList from "./ItemsList";
import Login from "./Login";
import Register from "./Register";
import NewItem from "./NewItem"; // Import the NewItem component
import EditItem from "./EditItem"; // Import the EditItem component
import ItemDisplay from "./ItemDisplay"; // Import the ItemDisplay component
import Navbar from "./Navbar"; // Import the Navbar component
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [cartCount, setCartCount] = useState(0); // State for cart count

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <Router>
      <div>
        <Navbar cartCount={cartCount} /> {/* Add Navbar component */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items/new" element={<NewItem />} /> {/* New route */}
          <Route path="/items/:id/edit" element={<EditItem />} /> {/* Edit route */}
          <Route path="/items" element={<ItemsList />} />
          <Route path="/display" element={<ItemDisplay />} /> {/* Item display route */}
          <Route path="/" element={<ItemDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
