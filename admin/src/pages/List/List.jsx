import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./List.css";

const List = ({ url = "http://localhost:4000" }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        setFilteredList(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch the food list.");
      }
    } catch (error) {
      toast.error("Error fetching the food list.");
    }
  }, [url]);

  const removeFood = useCallback(
    async (foodId) => {
      try {
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
        if (response.data.success) {
          toast.success(response.data.message);
          fetchList(); // Refresh list after deletion
        } else {
          toast.error(response.data.message || "Failed to remove food item.");
        }
      } catch (error) {
        toast.error("Error removing food item.");
      }
    },
    [url, fetchList]
  );

  const handleSearch = () => {
    const filtered = list.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="list">
      <h1>Food Items List</h1>
      
      <div className="list-search">
        <input 
          type="text" 
          placeholder="Search by name or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="list-search-btn" onClick={handleSearch}>Search</button>
      </div>
      
      {/* Table view for larger screens */}
      <table className="list-table">
        <thead>
          <tr className="list-table-header">
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length > 0 ? (
            filteredList.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="list-food-item">
                    <img
                      src={`${url}/images/${item.image || "placeholder.jpg"}`}
                      alt={item.name || "Food Item"}
                      onError={(e) => (e.target.src = "/path/to/placeholder.jpg")}
                    />
                  </div>
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>₹{item.price}</td>
                <td>
                  <div className="list-actions">
                    <button 
                      className="list-btn btn-delete"
                      onClick={() => removeFood(item._id)}
                      title="Remove Food Item"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No food items found.</td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Mobile view for smaller screens */}
      <div className="list-table-mobile">
        {filteredList.length > 0 ? (
          filteredList.map((item, index) => (
            <div key={index} className="list-item-mobile">
              <div className="list-item-header">
                <div className="list-food-item">
                  <img
                    src={`${url}/images/${item.image || "placeholder.jpg"}`}
                    alt={item.name || "Food Item"}
                    onError={(e) => (e.target.src = "/path/to/placeholder.jpg")}
                  />
                  <h3>{item.name}</h3>
                </div>
                <span>₹{item.price}</span>
              </div>
              <div className="list-item-details">
                <p><strong>Category:</strong> {item.category}</p>
              </div>
              <div className="list-actions">
                <button 
                  className="list-btn btn-delete"
                  onClick={() => removeFood(item._id)}
                  title="Remove Food Item"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No food items found.</p>
        )}
      </div>
    </div>
  );
};

export default List;
