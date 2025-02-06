// Definimos la interfaz para nuestros productos
interface ProductProps {
    _id: string;
    nombre: string;
    precio: number;
    imagen: string;
  }
  
  import React from "react";
  import { Link } from "react-router-dom";
  import "../styles/ProductCard.css";
  const ProductCard: React.FC<ProductProps> = ({ _id, nombre, precio, imagen }) => {
    return (
      <div className="product-card">
        <div className="product-image-container">
          <img src={imagen} alt={nombre} className="product-image" />
          {/* Agregamos un contenedor para el efecto hover */}
          <div className="product-overlay">
            <Link 
              to={`/infoproducto/${_id}`} 
              className="view-details-button"
            >
              Ver detalles
            </Link>
          </div>
        </div>
        <div className="product-info">
          <div className="product-header">
            <h2 className="product-title">{nombre}</h2>
            <p className="product-price">${precio}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductCard;