import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const getToken = () => localStorage.getItem("token");

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/login", { email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        setUser(decoded);
        setIsAdmin(decoded.role === "ADMIN");

        toast.success("Login Successfull");
        navigate("/");
        if (decoded.role !== "ADMIN") {
          await fetchProducts();
          navigate("/admin");
        }
      } else {
        toast.error(data.message || "Login Failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Something went wrong !");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAdmin(false);
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product");
      console.log("API Response Data:", data); // Verify the response

      // Ensure we handle both array and single object responses
      const productsData = Array.isArray(data) ? data : [data];
      setProducts(productsData); // This should update the state

      console.log("Products state after set:", productsData); // Verify update
    } catch (error) {
      console.error("Fetch error:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });
      toast.error(error.response?.data?.message || "Failed to load products");
      setProducts([]); // Reset on error
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        if (decoded.role !== "ADMIN") {
          fetchProducts();
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    setLoading(false);
  }, []);

  const value = {
    isAdmin,
    user,
    loading,
    products,
    login,
    logout,
    fetchProducts,
    location,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
