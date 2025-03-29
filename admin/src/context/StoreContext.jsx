import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext({
  token: "",
  setToken: () => {},
  admin: true,
  setAdmin: () => {},
});

const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
    api
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
