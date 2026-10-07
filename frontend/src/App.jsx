import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResumeProfile from "./pages/ResumeProfile";
import Signup from "./pages/Signup";
import Optimizer from "./pages/Optimizer";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
          path="/resume-profile"
          element={<ResumeProfile />}
        />

        <Route path="/optimizer" element={<Optimizer />} />
        </Route>

       

        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;