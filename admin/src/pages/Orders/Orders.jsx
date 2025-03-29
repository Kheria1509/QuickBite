import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./Orders.css";
import { assets } from "../../assets/assets";

const Orders = ({ url = "http://localhost:4000" }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrder = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      toast.error("Error fetching orders.");
    }
  }, [url]);

  const statusHandler = useCallback(
    async (orderId, status) => {
      try {
        const response = await axios.post(`${url}/api/order/status`, {
          orderId,
          status,
        });
        
        if (response.data.success) {
          toast.success(response.data.message);
          fetchAllOrder();
        } else {
          toast.error(response.data.message || "Failed to update status.");
        }
      } catch (error) {
        toast.error("Error updating order status.");
      }
    },
    [url, fetchAllOrder]
  );

  // Format date for better display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllOrder();
  }, [fetchAllOrder]);

  return (
    <div className="orders">
      <h1>Customer Orders</h1>
      
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="order-item">
            <div className="order-header">
              <span className="order-id">Order ID: {order._id.slice(-8)}</span>
              <span className="order-date">{formatDate(order.createdAt)}</span>
            </div>
            
            <div className="order-food-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-food-item">
                  <img 
                    src={`${url}/images/${item.image || "placeholder.jpg"}`}
                    alt={item.name}
                    onError={(e) => (e.target.src = assets.food_placeholder)}
                  />
                  <span className="food-name">{item.name}</span>
                  <span className="food-quantity">x{item.quantity}</span>
                  <span className="food-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="order-customer">
              <strong>Customer:</strong> {order.address.firstName} {order.address.lastName} | 
              <strong> Phone:</strong> {order.address.phone}
            </div>
            
            <div className="order-address">
              <strong>Address:</strong> {order.address.street}, 
              {[order.address.city, order.address.state, order.address.country]
                .filter(Boolean)
                .join(", ")}, 
              {order.address.zipcode}
            </div>
            
            <div className="order-total">
              <span>Total Amount</span>
              <span>₹{order.amount}</span>
            </div>
            
            <div className="order-actions">
              <button 
                className={`order-btn ${order.status === "Food Processing" ? "btn-accept" : "btn-disabled"}`}
                onClick={() => statusHandler(order._id, "Food Processing")}
                disabled={order.status !== "Food Processing"}
              >
                Processing
              </button>
              <button 
                className={`order-btn ${order.status === "Out for delivery" ? "btn-deliver" : "btn-disabled"}`}
                onClick={() => statusHandler(order._id, "Out for delivery")}
                disabled={order.status !== "Out for delivery"}
              >
                Out for Delivery
              </button>
              <button 
                className={`order-btn ${order.status === "Delivered" ? "btn-accept" : "btn-disabled"}`}
                onClick={() => statusHandler(order._id, "Delivered")}
                disabled={order.status !== "Delivered"}
              >
                Delivered
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-orders">No orders found.</div>
      )}
    </div>
  );
};

export default Orders;
