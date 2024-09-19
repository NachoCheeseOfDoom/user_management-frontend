import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Login } from "./components/Login";
import { NotFound } from "./components/NotFound";
import { Dashboard } from "./components/Dashboard";
import { Register } from "./components/Register";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
