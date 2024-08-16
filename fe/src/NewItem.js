import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function NewItem() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 3000); // Hide alert after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than zero";
    }

    if (!image) {
      newErrors.image = "Image is required";
    }

    if (!price) {
      newErrors.price = "Price is required";
    } else if (price <= 0) {
      newErrors.price = "Price must be greater than zero";
    }

    if (!description) {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Handle form submission logic here
      const item = {
        name,
        quantity: parseInt(quantity, 10), // Ensure quantity is an integer
        image,
        price: parseFloat(price), // Ensure price is a float
        description,
      };

      try {
        const response = await fetch("http://localhost:8080/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong");
        }

        const data = await response.json();
        console.log("Item created successfully:", data);
        setAlert({ message: "Item created successfully!", type: "success" });
        // Reset form
        setName("");
        setQuantity("");
        setImage("");
        setPrice("");
        setDescription("");
        setErrors({});
        setSubmitError("");
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setSubmitError(error.message);
        setAlert({ message: "Failed to create item: " + error.message, type: "danger" });
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Tambahkan Barang Baru</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input type="text" id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity:
          </label>
          <input type="number" id="quantity" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image:
          </label>
          <input type="text" id="image" className="form-control" value={image} onChange={(e) => setImage(e.target.value)} />
          {errors.image && <div className="text-danger">{errors.image}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price:
          </label>
          <input type="number" step="0.01" id="price" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
          {errors.price && <div className="text-danger">{errors.price}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea id="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
          {errors.description && <div className="text-danger">{errors.description}</div>}
        </div>
        {submitError && <div className="text-danger">{submitError}</div>}
        <button type="submit" className="btn btn-primary">
          Create Item
        </button>
      </form>
    </div>
  );
}

export default NewItem;
