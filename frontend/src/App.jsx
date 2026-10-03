import Footer from "./components/common/Footer.jsx";
import Navbar from "./components/common/Navbar.jsx";
import Home from "./pages/Home.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Pagetransition from "./components/layout/Pagetransition.jsx";
import ProtectedRoutes from "./components/security/ProtectedRoutes.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Pagetransition>
                <Navbar />
                <Home />
                <Footer />
              </Pagetransition>
            }
          />
          <Route
            path="/login"
            element={
              <Pagetransition>
                <Login />
              </Pagetransition>
            }
          />
          <Route
            path="/register"
            element={
              <Pagetransition>
                <Register />
              </Pagetransition>
            }
          />
          <Route element={<ProtectedRoutes />}>
            <Route
              path="/dashboard"
              element={
                <Pagetransition>
                  <Dashboard />
                </Pagetransition>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
