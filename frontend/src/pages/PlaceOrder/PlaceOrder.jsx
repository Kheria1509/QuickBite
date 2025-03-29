import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url, api } = useContext(StoreContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    
    if (!token) {
      toast.error("Please login first");
      navigate("/cart");
      return;
    }
    
    setIsSubmitting(true);
    let orderItems = [];
    
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = {...item};
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    
    if (orderItems.length === 0) {
      toast.error("Your cart is empty");
      setIsSubmitting(false);
      navigate("/cart");
      return;
    }
    
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 20,
    };
    
    try {
      const response = await api.post(`/api/order/place`, orderData);
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        toast.error(response.data.message || "Failed to place order!");
        setIsSubmitting(false);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Place order error:", error);
        toast.error(error.response?.data?.message || "Error placing your order");
      }
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Please add items to cart");
      navigate("/cart");
    }
  }, [token, navigate, getTotalCartAmount]);

  return (
    <div className="place-order-container">
      <form className="place-order" onSubmit={placeOrder}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              required
              name="firstName"
              value={data.firstName}
              onChange={onChangeHandler}
              type="text"
              placeholder="First name"
            />
            <input
              required
              name="lastName"
              value={data.lastName}
              onChange={onChangeHandler}
              type="text"
              placeholder="Last name"
            />
          </div>
          <input
            required
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            required
            name="street"
            value={data.street}
            onChange={onChangeHandler}
            type="text"
            placeholder="Street"
          />
          <div className="multi-fields">
            <input
              required
              name="city"
              value={data.city}
              onChange={onChangeHandler}
              type="text"
              placeholder="City"
            />
            <input
              required
              name="state"
              value={data.state}
              onChange={onChangeHandler}
              type="text"
              placeholder="State"
            />
          </div>
          <div className="multi-fields">
            <input
              required
              name="zipcode"
              value={data.zipcode}
              onChange={onChangeHandler}
              type="text"
              placeholder="Zip Code"
            />
            <input
              required
              name="country"
              value={data.country}
              onChange={onChangeHandler}
              type="text"
              placeholder="Country"
            />
          </div>
          <input
            required
            name="phone"
            value={data.phone}
            onChange={onChangeHandler}
            type="tel"
            placeholder="Phone"
          />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotals</p>
                <p>₹{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₹{getTotalCartAmount() === 0 ? 0 : 20}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>
                  ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}
                </b>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={isSubmitting ? "submitting" : ""}
            >
              {isSubmitting ? "PROCESSING..." : "PROCEED TO PAYMENT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;