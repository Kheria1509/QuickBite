import React, { useContext, useState } from "react";
import "./loginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, api, loadCartData } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onLogin = async (event) => {
    event.preventDefault();
    if (isSubmitting) return; // Prevent multiple clicks during submission
    setIsSubmitting(true);

    const endpoint =
      currState === "Login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      currState === "Login"
        ? { email: data.email, password: data.password }
        : { name: data.name, email: data.email, password: data.password };

    try {
      const response = await api.post(endpoint, payload);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        
        // Load cart data after successful login
        await loadCartData();
        
        toast.success(
          currState === "Login" 
            ? "Login successful!" 
            : "Account created successfully!"
        );
        
        setShowLogin(false);
      } else {
        toast.error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Error during request:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            className="close-icon"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <div className="password-container">
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? "text" : "password"} // Toggle type based on state
              placeholder="Password"
              required
              minLength={8}
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <i className="fa fa-eye-slash" aria-hidden="true"></i>
              ) : (
                <i className="fa fa-eye" aria-hidden="true"></i>
              )}
            </span>
          </div>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Processing..." // Show processing state
            : currState === "Sign Up"
            ? "Create account"
            : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, you agree to our Terms and Conditions.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
