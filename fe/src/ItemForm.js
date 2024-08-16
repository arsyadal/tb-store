import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ItemForm() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/items/${id}`)
        .then((response) => {
          setName(response.data.name);
          setQuantity(response.data.quantity);
        })
        .catch((error) => {
          console.error("There was an error fetching the item!", error);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = { name, quantity };

    if (id) {
      axios
        .put(`http://localhost:8080/items/${id}`, item)
        .then((response) => {
          console.log("Item updated successfully:", response);
          navigate("/items");
        })
        .catch((error) => {
          console.error("There was an error updating the item!", error);
        });
    } else {
      axios
        .post("http://localhost:8080/items", item)
        .then((response) => {
          console.log("Item added successfully:", response);
          navigate("/items");
        })
        .catch((error) => {
          console.error("There was an error adding the item!", error);
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Edit Item" : "Add Item"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {id ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
}

export default ItemForm;
