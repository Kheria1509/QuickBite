import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    food_list,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const deliveryFee = getTotalCartAmount() === 0 ? 0 : 20;
  const totalAmount = getTotalCartAmount() + deliveryFee;

  return (
    <div className="cart">
      <h1 className="cart-heading">Your Cart</h1>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.some((item) => cartItems[item._id] > 0) ? (
          food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id} className="cart-item-container">
                  <div className="cart-items-title cart-items-item">
                    <div className="item-image-container">
                      <img src={`${url}/images/${item.image}`} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <div className="item-price-mobile">
                        <span>Price:</span> ₹{item.price}
                      </div>
                      <div className="item-quantity-mobile">
                        <span>Qty:</span> {cartItems[item._id]}
                      </div>
                      <div className="item-total-mobile">
                        <span>Total:</span> ₹{item.price * cartItems[item._id]}
                      </div>
                    </div>
                    <p className="item-price-desktop">₹{item.price}</p>
                    <p className="item-quantity-desktop">{cartItems[item._id]}</p>
                    <p className="item-total-desktop">₹{item.price * cartItems[item._id]}</p>
                    <div
                      onClick={() => removeFromCart(item._id)}
                      className="cross"
                    >
                      x
                    </div>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty. Add some items to get started!</p>
            <button onClick={() => navigate("/")} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {food_list.some((item) => cartItems[item._id] > 0) && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>₹{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₹{deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>₹{totalAmount}</b>
              </div>
            </div>
            <button onClick={() => navigate("/order")} className="checkout-button">PROCEED TO CHECKOUT</button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>If you have a promo code, enter it here</p>
              <div className="cart-promocode-input">
                <input type="text" placeholder="Promo code" />
                <button>Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
