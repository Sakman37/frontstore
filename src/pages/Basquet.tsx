import React, { useEffect, useState } from "react";

import "../styles/basquet.css";

import { CreditCard, Truck } from "lucide-react";

// Definición de interfaces
interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen?: string;
  talla?: string;
  equipo?: string;
  cantidad: number;
}

interface DatosEnvio {
  nombre: string;
  apellidos: string;
  direccion: string;
  ciudad: string;
  departamento: string;
}

interface DatosTarjeta {
  numero: string;
  nombre: string;
  fechaExp: string;
  cvv: string;
}

interface Pedido {
  _id: string; // Agregamos el ID único
  usuario: string | null;
  productos: Producto[];
  envio: DatosEnvio;
  metodoPago: string;
  datosTarjeta: DatosTarjeta | null;
  estado: string;
  total: number;
}

const Basquet: React.FC = () => {
  const [productosEnCarrito, setProductosEnCarrito] = useState<Producto[]>([]);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<boolean>(false);
  const [datosEnvio, setDatosEnvio] = useState<DatosEnvio>({
    nombre: "",
    apellidos: "",
    direccion: "",
    ciudad: "",
    departamento: ""
  });
  const [datosTarjeta, setDatosTarjeta] = useState<DatosTarjeta>({
    numero: "",
    nombre: "",
    fechaExp: "",
    cvv: ""
  });
  const [metodoPago, setMetodoPago] = useState<string>("");
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setUsuarioAutenticado(false);
      setProductosEnCarrito([]);
    } else {
      setUsuarioAutenticado(true);
      const carrito = JSON.parse(localStorage.getItem(`carrito_${token}`) || "[]") as Producto[];
      setProductosEnCarrito(carrito);
    }
  }, [token]);

  const calcularTotal = (): number => {
    return productosEnCarrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  };

  const eliminarProducto = (id: string): void => {
    const nuevoCarrito = productosEnCarrito.filter(producto => producto.id !== id);
    setProductosEnCarrito(nuevoCarrito);

    // Actualiza el carrito en localStorage
    if (token) {
      localStorage.setItem(`carrito_${token}`, JSON.stringify(nuevoCarrito));
    }

    // Si no hay productos en el carrito, elimina el carrito de localStorage
    if (nuevoCarrito.length === 0 && token) {
      localStorage.removeItem(`carrito_${token}`);
    }
  };

  const realizarPedido = (): void => {
    if (!datosEnvio.nombre || !datosEnvio.direccion || !metodoPago) {
      alert("Por favor, completa todos los campos de envío y elige un método de pago.");
      return;
    }

    if (metodoPago === "Tarjeta" && (!datosTarjeta.numero || !datosTarjeta.cvv)) {
      alert("Por favor, completa los datos de la tarjeta.");
      return;
    }

    // Generar un ID único para el pedido
    const pedidoId = `${Date.now()}_${Math.random()}`;

    const pedido: Pedido = {
      _id: pedidoId, // Asignamos el ID único
      usuario: token,
      productos: productosEnCarrito,
      envio: datosEnvio,
      metodoPago,
      datosTarjeta: metodoPago === "Tarjeta" ? datosTarjeta : null,
      estado: "Pendiente",
      total: calcularTotal()
    };

    if (token) {
      // Guarda el pedido en localStorage con el ID único
      localStorage.setItem(`pedido_${pedidoId}`, JSON.stringify(pedido));

      // Elimina el carrito del localStorage después de realizar el pedido
      localStorage.removeItem(`carrito_${token}`);
    }

    // Limpia el carrito de productos en el estado
    setProductosEnCarrito([]);
    
    alert("¡Pedido realizado con éxito!");
  };

  const handleDatosEnvioChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDatosEnvio(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDatosTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDatosTarjeta(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!usuarioAutenticado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">No has iniciado sesión</h1>
        <p className="text-gray-600">Por favor, inicia sesión para ver tu carrito.</p>
      </div>
    );
  }

  return (
    <div className="container-no ">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tu Carrito</h1>
      
      {productosEnCarrito.length === 0 ? (
        <p className="text-gray-600 text-center">No tienes productos en tu carrito.</p>
      ) : (
        <div className="container-produc">
          <div className="lg:col-span-2">
            <ul className="space-y-4">
              {productosEnCarrito.map((producto) => (
                <li key={producto.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
                  <img 
                    src={producto.imagen || "/default-image.jpg"} 
                    alt={producto.nombre}
                    className="imagen-producto"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{producto.nombre}</h4>
                    <p className="text-blue-600 font-medium">
                      ${producto.precio} x {producto.cantidad}
                    </p>
                    {producto.talla && <p className="text-gray-600">Talla: {producto.talla}</p>}
                    {producto.equipo && <p className="text-gray-600">Equipo: {producto.equipo}</p>}
                    <button 
                      onClick={() => eliminarProducto(producto.id)}
                      className="mt-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="container-resumen">
            <div className="">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen del Pedido</h2>
              <div className="flex justify-between items-center text-lg font-bold text-blue-600">
                <span>Total:</span>
                <span>${calcularTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="container-envio">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos de Envío</h2>
              <div className="space-y-4">
                {Object.keys(datosEnvio).map((campo) => (
                  <input
                    key={campo}
                    type="text"
                    name={campo}
                    placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                    value={datosEnvio[campo as keyof DatosEnvio]}
                    onChange={handleDatosEnvioChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>

            <div className="container-pago">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Método de Pago</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    value="Tarjeta"
                    checked={metodoPago === "Tarjeta"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="text-blue-600"
                  />
                  <CreditCard className="text-gray-600" size={20} />
                  <span>Tarjeta de Crédito</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    value="Contra entrega"
                    checked={metodoPago === "Contra entrega"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="text-blue-600"
                  />
                  <Truck className="text-gray-600" size={20} />
                  <span>Contra entrega</span>
                </label>
              </div>

              {metodoPago === "Tarjeta" && (
                <div className="mt-4 space-y-4">
                  {Object.keys(datosTarjeta).map((campo) => (
                    <input
                      key={campo}
                      type={campo === "cvv" ? "password" : "text"}
                      name={campo}
                      placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                      value={datosTarjeta[campo as keyof DatosTarjeta]}
                      onChange={handleDatosTarjetaChange}
                      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={realizarPedido}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Realizar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Basquet;
