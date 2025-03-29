import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { token, api } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await api.post(`/api/order/userorders`, {});
      if (response.data.success) {
        setData(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Fetch orders error:", error);
        toast.error(error.response?.data?.message || "Error fetching your orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);
  
  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      
      {loading ? (
        <div className="loading">Loading your orders...</div>
      ) : data.length === 0 ? (
        <div className="no-orders">You haven't placed any orders yet.</div>
      ) : (
        <div className="container">
          {data.map((order, index) => {
            return (
              <div key={index} className="my-orders-order">
                <div className="order-icon">
                  <img src={assets.parcel_icon} alt="Order" />
                </div>
                <div className="order-details">
                  <p className="order-items">
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return item.name + " X " + item.quantity;
                      } else {
                        return item.name + " X " + item.quantity + ", ";
                      }
                    })}
                  </p>
                  <div className="order-meta">
                    <p className="order-price">₹{order.amount}.00</p>
                    <p className="order-count">Items: {order.items.length}</p>
                    <p className="order-status">
                      <span className="status-dot">&#x25cf;</span>
                      <b> {order.status}</b>
                    </p>
                  </div>
                </div>
                <button onClick={fetchOrders} className="track-btn">Track Order</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;