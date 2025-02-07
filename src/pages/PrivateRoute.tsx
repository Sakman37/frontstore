import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

interface PrivateRouteProps {
  element: JSX.Element;
  isAdminRequired?: boolean;  // wawa
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, isAdminRequired = false }) => {
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      isAdmin = decodedToken?.esAdmin;
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  }

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si es admin requerido y el usuario no es admin, redirige al home
  if (isAdminRequired && !isAdmin) {
    return <Navigate to="/" />;
  }

  // Si pasa las verificaciones, renderiza el componente
  return element;
};

export default PrivateRoute;
