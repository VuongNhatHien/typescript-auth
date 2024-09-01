import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login"
import Home from "./pages/Home";
// import Home from "./pages/Home";

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </div>
  );
}

export default App;