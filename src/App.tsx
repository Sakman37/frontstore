import React from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contac";
import AdminPanel from "./pages/AdminPanel";
import InfoProducto from "./pages/infoproducto";
import Basquet from "./pages/Basquet";  
import PrivateRoute from "./pages/PrivateRoute";  

const App: React.FC = () => {
  return (
    <>
      <AnimatePresence mode="wait"> {/* */}
        <Routes>
          {/* Ruta para login */}
          <Route
            path="/login"
            element={
              <motion.div
                key="login"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Navbar />
                <Login />
                <Footer />
              </motion.div>
            }
          />

          {/* Página principal */}
          <Route
            path="/"
            element={
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Navbar />
                <Home />
                <Footer />
              </motion.div>
            }
          />

          {/* Página de contacto */}
          <Route
            path="/contact"
            element={
              <motion.div
                key="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Navbar />
                <Contact />
                <Footer />
              </motion.div>
            }
          />

          {/* Página de Admin protegida */}
          <Route
            path="/admin"
            element={
              <PrivateRoute isAdminRequired={true} element={
                <motion.div
                  key="admin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Navbar />
                  <AdminPanel />
                  <Footer />
                </motion.div>
              } />
            }
          />

          {/* Ruta de detalles del producto */}
          <Route
            path="/infoproducto/:id"
            element={
              <motion.div
                key="infoproducto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Navbar />
                <InfoProducto />
                <Footer />
              </motion.div>
            }
          />

          {/* Ruta del carrito */}
          <Route
            path="/basquet"
            element={
              <motion.div
                key="basquet"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Navbar />
                <Basquet />
                <Footer />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
