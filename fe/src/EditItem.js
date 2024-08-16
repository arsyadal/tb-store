import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    // Fetch item details
    const fetchItem = async () => {
      try {
        const response = await fetch(`http://localhost:8080/items/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }
        const data = await response.json();
        setName(data.name);
        setQuantity(data.quantity);
        setImage(data.image);
        setPrice(data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")); // Format price
        setDescription(data.description);
      } catch (error) {
        console.error("Error fetching item:", error);
        setSubmitError(error.message);
      }
    };

    fetchItem();
  }, [id]);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 3000); // Hide alert after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const formatPrice = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\./g, ""); // Remove existing dots
    setPrice(formatPrice(value));
  };

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
    } else if (parseFloat(price.replace(/\./g, "")) <= 0) {
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
        price: parseFloat(price.replace(/\./g, "")), // Ensure price is a float without dots
        description,
      };

      try {
        const response = await fetch(`http://localhost:8080/items/${id}`, {
          method: "PUT",
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
        console.log("Item updated successfully:", data);
        setAlert({ message: "Item updated successfully!", type: "success" });
        // Redirect to items list
        navigate("/items");
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setSubmitError(error.message);
        setAlert({ message: "Failed to update item: " + error.message, type: "danger" });
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Item</h2>
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
          <input type="text" id="price" className="form-control" value={price} onChange={handlePriceChange} />
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
          Update Item
        </button>
      </form>
    </div>
  );
}

export default EditItem;
