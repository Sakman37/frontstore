import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/home.css";

interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  imagen: string;
  category: "tecnologia" | "ropa" | "zapatos" | "otros";
}

const Home: React.FC = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>("");

  const banners = [
    "/src/pages/banner1.jpg",
    "/src/pages/banner2.jpg",
    "/src/pages/banner3.jpg"
  ];

  useEffect(() => {
    axios.get("https://backstore-nirr.onrender.com/api/products").then((response) => {
      setProductos(response.data);
    });
  }, []);

  // Filtrar por categoría y luego por búsqueda
  const filteredProducts = productos
    .filter(product => selectedCategory === "todos" || product.category === selectedCategory)
    .filter(product => product.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  const categories = [
    { id: 'todos', name: 'Todos los productos' },
    { id: 'tecnologia', name: 'Tecnología' },
    { id: 'ropa', name: 'Ropa' },
    { id: 'zapatos', name: 'Zapatos' },
    { id: 'otros', name: 'Otros' }
  ];

  return (
    <div className="home-container">
      {/* Sección del Carrusel */}
      <div className="carousel-section">
        <Carousel autoPlay infiniteLoop showStatus={false} showThumbs={false} interval={5000}>
          {banners.map((banner, index) => (
            <div key={index} className="banner-slide">
              <img src={banner} alt={`Banner ${index + 1}`} />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="main-content">
        {/* Sidebar de Categorías */}
        <div className="sidebar">
          <h3 className="sidebar-title">Categorías</h3>
          <ul className="category-list">
            {categories.map(category => (
              <li 
                key={category.id}
                className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Sección de Productos */}
        <div className="products-section">
          <h2 className="section-title">
            {selectedCategory === 'todos' 
              ? 'Todos los productos' 
              : `Productos - ${categories.find(c => c.id === selectedCategory)?.name}`}
          </h2>

          {/* Barra de búsqueda */}
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Grid de productos */}
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((producto) => (
                <ProductCard
                  key={producto._id}
                  _id={producto._id}
                  nombre={producto.nombre}
                  precio={producto.precio}
                  imagen={producto.imagen}
                />
              ))
            ) : (
              <p className="no-results">No se encontraron productos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
