import React from "react";
import ReactDOM from "react-dom/client";
import { TaskProvider } from "./context/TaskContext";
import Home from "./pages/Home";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TaskProvider>
      <Home />
    </TaskProvider>
  </React.StrictMode>
);
