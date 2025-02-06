import "../styles/infoProducto.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaSearchPlus } from "react-icons/fa";

const InfoProducto: React.FC = () => {
  const [producto, setProducto] = useState<any>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [seleccion, setSeleccion] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      axios
        .get(`https://backstore-nirr.onrender.com/api/products/${id}`)
        .then((response) => {
          setProducto(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener el producto:", error);
        });
    }
  }, [id]);

  const añadirAlCarrito = () => {
    if (!token) {
      setMensaje("Por favor, inicia sesión para añadir productos al carrito.");
      return;
    }

    const productoConSeleccion = { ...producto, cantidad, seleccion };
    let carrito = JSON.parse(localStorage.getItem(`carrito_${token}`) || "[]");
    carrito.push(productoConSeleccion);
    localStorage.setItem(`carrito_${token}`, JSON.stringify(carrito));
    setMensaje("¡Producto añadido al carrito con éxito!");
    setTimeout(() => setMensaje(""), 3000);
  };

  if (!producto) return <div>Cargando...</div>;

  return (
    <div className="info-producto-container">
      <div className="info-producto">
        <div className="info-producto-imagen">
          <img 
            src={producto.imagen || "/default-image.jpg"} 
            alt={producto.nombre} 
          />
          <FaSearchPlus className="lupa-icon" />
        </div>
        <div className="info-producto-detalles">
          <h2>{producto.nombre}</h2>
          <p><strong>Precio:</strong> ${producto.precio}</p>
          <p><strong>Disponibles:</strong> {producto.cantidad}</p>
          
          <label>Cantidad:</label>
          <input 
            type="number" 
            value={cantidad} 
            min={1} 
            max={producto.cantidad} 
            onChange={(e) => setCantidad(Number(e.target.value))} 
          />

          {producto.category === "ropa" && (
            <div>
              <label>Selecciona Talla:</label>
              <select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
                <option value="">Selecciona</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
          )}

          {producto.category === "tecnologia" && (
            <div>
              <label>Selecciona equipo:</label>
              <select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
                <option value="">Selecciona</option>
                <option value="Básico">Básico</option>
                <option value="Completo">Completo</option>
              </select>
            </div>
          )}

          {producto.category === "zapatos" && (
            <div>
              <label>Selecciona Talla:</label>
              <select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
                <option value="">Selecciona</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
              </select>
            </div>
          )}

          {producto.category === "otros" && (
            <div>
              <label>Selecciona Talla:</label>
              <select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
                <option value="">Selecciona</option>
                <option value="Unica">Unica</option>
              </select>
            </div>
          )}

          <button onClick={añadirAlCarrito}>Añadir al carrito</button>
          {mensaje && <p className="mensaje-exito">{mensaje}</p>}
          <p>{producto.descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoProducto;
