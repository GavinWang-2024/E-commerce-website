import React from "react"
import Login from "./components/Login"
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import { Route, Routes } from "react-router-dom";
const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
};

export default App
