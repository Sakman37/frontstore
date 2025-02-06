import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import { FaUserShield } from "react-icons/fa";
import "../styles/login.css";

const API_URL = "https://backstore-nirr.onrender.com/api/users";


const DualLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Si estamos en modo admin, solo permitimos login
      const endpoint = (!isAdminMode && isRegistering) ? "register" : "login";
      const data = isRegistering ? { nombre: name, email, password } : { email, password };

      const res = await axios.post(`${API_URL}/${endpoint}`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (!isRegistering) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        
        // Decodificar el token para verificar si es admin
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(jsonPayload);
        
        if (isAdminMode && !decodedToken.esAdmin) {
          alert("No tienes permisos de administrador");
          return;
        }

        localStorage.setItem("user", JSON.stringify(res.data.user));
        setIsAuthenticated(true);
        
        // Redirigir según el tipo de usuario
        if (decodedToken.esAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        alert("Registro exitoso, ahora inicia sesión.");
        setIsRegistering(false);
      }
    } catch (error: any) {
      console.error("Error en la operación:", error);
      alert(error.response?.data?.message || "Error en la operación");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    // Resetear el formulario al cambiar de modo
    setEmail("");
    setPassword("");
    setIsRegistering(false);
  };

  return (
    <Container className="login-container">
      <div className="login-form">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{isAdminMode ? "Panel Administrativo" : (isRegistering ? "Registro de Usuario" : "Iniciar Sesión")}</h2>
          <Button 
            variant="outline-secondary" 
            className="rounded-circle p-2" 
            onClick={toggleAdminMode}
            title={isAdminMode ? "Cambiar a modo usuario" : "Cambiar a modo administrador"}
          >
            <FaUserShield className={isAdminMode ? "text-primary" : "text-secondary"} />
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          {(!isAdminMode && isRegistering) && (
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            {!isAdminMode && isRegistering ? "Registrarse" : "Iniciar Sesión"}
          </Button>
        </Form>

        {!isAdminMode && (
          <Button
            variant="link"
            onClick={() => setIsRegistering(!isRegistering)}
            className="toggle-button"
          >
            {isRegistering ? "Ya tengo cuenta, Iniciar Sesión" : "¿No tienes cuenta? Regístrate"}
          </Button>
        )}
        
        {isAuthenticated && (
          <Button variant="danger" className="w-100 mt-3" onClick={logout}>
            Cerrar sesión
          </Button>
        )}
      </div>
    </Container>
  );
};

export default DualLogin;