import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ItemList() {
  const [items, setItems] = useState([]);

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

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/items/${id}`)
      .then((response) => {
        console.log("Item deleted successfully:", response);
        setItems(items.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the item!", error);
      });
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="container mt-4">
      <h2>Stok Barang</h2>
      <Link to="/items/new" className="btn btn-primary mb-3">
        Tambah Barang
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.image}</td>
              <td>{formatPrice(item.price)}</td>
              <td>{item.description}</td>
              <td>
                <Link to={`/items/${item.id}/edit`} className="btn btn-warning btn-sm mr-2">
                  Edit
                </Link>
                <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemList;
