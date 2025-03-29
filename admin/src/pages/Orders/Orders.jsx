import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./Orders.css";
import { assets } from "../../assets/assets";

const Orders = ({ url = "http://localhost:4000" }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchAllOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      toast.error("Error fetching orders.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const statusHandler = useCallback(
    async (orderId, status) => {
      try {
        setUpdatingOrderId(orderId);
        const response = await axios.post(`${url}/api/order/status`, {
          orderId,
          status,
        });
        
        if (response.data.success) {
          // Update order status locally to avoid refetching
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order._id === orderId ? { ...order, status } : order
            )
          );
          toast.success(`Order status updated to ${status}`);
        } else {
          toast.error(response.data.message || "Failed to update status.");
        }
      } catch (error) {
        toast.error("Error updating order status.");
        console.error(error);
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [url]
  );

  // Get the next available status based on current status
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return "Food Processing";
      case "Food Processing":
        return "Out for delivery";
      case "Out for delivery":
        return "Delivered";
      case "Delivered":
        return null; // No next status
      default:
        return "Food Processing";
    }
  };

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
      
      {loading && !updatingOrderId && <div className="loading">Loading orders...</div>}
      
      {orders.length > 0 ? (
        orders.map((order) => {
          const nextStatus = getNextStatus(order.status);
          return (
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
              
              <div className={`order-status ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                <strong>Current Status:</strong> {order.status}
                {updatingOrderId === order._id && <span className="status-updating"> (Updating...)</span>}
              </div>
              
              <div className="order-actions">
                {nextStatus ? (
                  <button 
                    className="order-btn btn-next-action"
                    onClick={() => statusHandler(order._id, nextStatus)}
                    disabled={updatingOrderId === order._id}
                  >
                    Update to: {nextStatus}
                  </button>
                ) : (
                  <span className="order-complete">Order completed</span>
                )}
                
                <div className="all-status-actions">
                  <p>Or set specific status:</p>
                  <div className="status-buttons">
                    <button 
                      className={`order-btn ${order.status === "Food Processing" ? "btn-active" : ""}`}
                      onClick={() => statusHandler(order._id, "Food Processing")}
                      disabled={updatingOrderId === order._id}
                    >
                      Processing
                    </button>
                    <button 
                      className={`order-btn ${order.status === "Out for delivery" ? "btn-active" : ""}`}
                      onClick={() => statusHandler(order._id, "Out for delivery")}
                      disabled={updatingOrderId === order._id}
                    >
                      Out for Delivery
                    </button>
                    <button 
                      className={`order-btn ${order.status === "Delivered" ? "btn-active" : ""}`}
                      onClick={() => statusHandler(order._id, "Delivered")}
                      disabled={updatingOrderId === order._id}
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-orders">No orders found.</div>
      )}
    </div>
  );
};

export default Orders;
