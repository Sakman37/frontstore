import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

const Navbar: React.FC = () => {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<boolean>(false);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false); // Estado para el menú
  const navigate = useNavigate();

  const actualizarCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    console.log("Carrito actualizado: ", carrito);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUsuarioAutenticado(!!token);
    actualizarCarrito();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "carrito") {
        actualizarCarrito();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [usuarioAutenticado]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuarioAutenticado(false);
    localStorage.removeItem("carrito");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#000000" }}>
      <div className="container-fluid">
      <img src="/images/icono2.png" style={{ width: "200px", marginLeft: "20px" }} className="navbar-brand" alt="Logo" />

        
        {/* Botón del menú móvil */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú desplegable controlado por el estado */}
        <div className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`} id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
            <li className="nav-item">
              <Link className="nav-link" to="/">Productos</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Ayuda</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/basquet" className="nav-link">Carrito</Link>
            </li>
            {!usuarioAutenticado ? (
              <li className="nav-item">
              <Link to="/login" className="btn btn-outline-light">
                <PersonCircle size={30} />
              </Link>
            </li>
            
            ) : (
              <li className="nav-item">
                <Button variant="outline-danger" onClick={cerrarSesion}>
                  <PersonCircle size={30} /> 
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
