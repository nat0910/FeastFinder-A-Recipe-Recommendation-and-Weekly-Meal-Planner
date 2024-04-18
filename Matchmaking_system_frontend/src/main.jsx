import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AuthProvider from "./utils/context/AuthContext.jsx";
import Myroutes from "./routes/MyRoutes.jsx";
import { BrowserRouter } from "react-router-dom";
import RecipeProvider from "./utils/context/RecipeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RecipeProvider>
          <Myroutes />
        </RecipeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
