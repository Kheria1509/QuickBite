import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./Add.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const Add = ({ url = import.meta.env.VITE_API_URL || "https://quickbite-backend.vercel.app" }) => {
  const { api } = useContext(StoreContext);

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image || image.size > 5 * 1024 * 1024) {
      return toast.error("Please upload a valid image (max 5MB).");
    }

    if (data.price <= 0) {
      return toast.error("Price must be a positive number.");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      // Use regular axios for form data
      const response = await axios.post(`${url}/api/food/add`, formData);

      console.log("Response:", response);

      if (response.data.success) {
        setData({ name: "", description: "", price: "", category: "Salad" });
        setImage(null);
        toast.success(response.data.message);
      } else {
        console.log("Server message:", response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="add">
      <h2>Add New Food Item</h2>
      <form onSubmit={onSubmitHandler}>
        <div className="add-image-upload">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload preview"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            required
          />
        </div>
        
        <div>
          <p>Product Name</p>
          <input
            className="product-name"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Enter product name"
            required
          />
        </div>
        
        <div>
          <p>Product Description</p>
          <textarea
            className="product-description"
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        
        <div className="category-price">
          <div>
            <p>Product Category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
              required
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          
          <div>
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="₹200"
              min="1"
              required
            />
          </div>
        </div>
        
        <button type="submit" className="add-btn">
          ADD ITEM
        </button>
      </form>
    </div>
  );
};

export default Add;