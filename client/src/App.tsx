import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login"
import Home from "./pages/Home";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import EmailReset from "./pages/EmailReset";
import ResetPassword from "./pages/ResetPassword";
// import Home from "./pages/Home";

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/emailreset" element={<EmailReset />} />
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>
      </div>
  );
}

export default App;