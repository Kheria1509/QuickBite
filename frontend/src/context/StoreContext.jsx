import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const url = "http://localhost:4000";

  // Set up axios instance with base URL
  const api = axios.create({
    baseURL: url,
    withCredentials: true // This ensures cookies are sent with requests
  });

  // Configure axios with interceptors for token handling
  useEffect(() => {
    // Set up request interceptor to add token to all requests
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          config.headers.token = storedToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Set up response interceptor to handle common errors and token refresh
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
          originalRequest._retry = true;
          setIsRefreshing(true);

          try {
            // Try to refresh the token
            const refreshResponse = await axios.post(`${url}/api/auth/refresh`, {}, { 
              withCredentials: true 
            });

            if (refreshResponse.data.success) {
              // If refresh successful, update token and retry original request
              const newToken = refreshResponse.data.token;
              localStorage.setItem("token", newToken);
              setToken(newToken);
              
              // Update the token in the original request and retry
              originalRequest.headers.token = newToken;
              setIsRefreshing(false);
              return api(originalRequest);
            } else {
              // If refresh failed, logout user
              handleLogout();
              setIsRefreshing(false);
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // If refresh throws an error, logout user
            console.error("Token refresh failed:", refreshError);
            handleLogout();
            setIsRefreshing(false);
            return Promise.reject(error);
          }
        }

        // For other errors, just reject the promise
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [isRefreshing]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint if the user is logged in
      if (token) {
        await api.post('/api/auth/logout');
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state regardless of API success/failure
      localStorage.removeItem("token");
      setToken("");
      setCartItems({});
      toast.info("You have been logged out.");
    }
  };

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        const response = await api.post(`/api/cart/add`, { itemId });
        if (response.data.success) {
          toast.success("Item added to cart");
        } else {
          toast.error("Failed to add item to cart");
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          // Don't show error for auth errors - the interceptor handles those
          toast.error(error.response?.data?.message || "Error adding item to cart");
          console.error("Add to cart error:", error);
        }
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });

    if (token) {
      try {
        const response = await api.post(`/api/cart/remove`, { itemId });
        if (response.data.success) {
          toast.success("Item removed from cart");
        } else {
          toast.error("Failed to remove item from cart");
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          toast.error(error.response?.data?.message || "Error removing item from cart");
          console.error("Remove from cart error:", error);
        }
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await api.get(`/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        toast.error("Failed to fetch food list");
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || "Error fetching food list");
        console.error("Fetch food list error:", error);
      }
    }
  };

  const loadCartData = async () => {
    if (!token) return;
    
    try {
      const response = await api.post(`/api/cart/get`);
      if (response.data.success && response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Load cart data error:", error);
      }
    }
  };

  // Check token validity at startup
  const validateSession = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        // Verify if the token is valid
        const response = await api.post(`/api/auth/verify`);
        if (response.data.success) {
          setToken(storedToken);
          await loadCartData();
        } else {
          // If token is invalid, try to refresh it
          try {
            const refreshResponse = await axios.post(`${url}/api/auth/refresh`, {}, {
              withCredentials: true
            });
            
            if (refreshResponse.data.success) {
              const newToken = refreshResponse.data.token;
              localStorage.setItem("token", newToken);
              setToken(newToken);
              await loadCartData();
            } else {
              handleLogout();
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Session validation error:", error);
        handleLogout();
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await validateSession();
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    loadCartData,
    api,
    handleLogout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
