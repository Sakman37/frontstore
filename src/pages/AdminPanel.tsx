import { useEffect, useState } from "react";
import { obtenerProductos, eliminarProducto, agregarProducto, actualizarProducto } from "../services/productService";
import "../styles/admin.css";

interface Producto {
  _id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  imagen: string;
  category: "tecnologia" | "ropa" | "zapatos" | "otros";
  favorito?: boolean;
}

interface Pedido {
  _id: string;
  usuario: string;
  productos: Producto[];
  estado: string;
  envio: {
    nombre: string;
    apellidos: string;
    direccion: string;
    ciudad: string;
    departamento: string;
  };
  metodoPago: string;
}

const AdminDashboard = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [mostrarPedidos, setMostrarPedidos] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productoActual, setProductoActual] = useState<Producto>({
    nombre: "",
    descripcion: "",
    precio: 0,
    cantidad: 0,
    imagen: "",
    category: "otros",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosData = await obtenerProductos();
        setProductos(productosData);

        const storedPedidos = Object.keys(localStorage)
          .filter((key) => key.startsWith("pedido_"))
          .map((key) => JSON.parse(localStorage.getItem(key) || "{}"));
        setPedidos(storedPedidos);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        alert("Error al cargar los productos");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && productoActual._id) {
        const productoActualizado = await actualizarProducto(productoActual._id, productoActual);
        setProductos(productos.map((p) => (p._id === productoActual._id ? productoActualizado : p)));
        alert("Producto actualizado exitosamente");
      } else {
        const nuevoProducto = await agregarProducto(productoActual);
        setProductos([...productos, nuevoProducto]);
        alert("Producto agregado exitosamente");
      }

      resetForm();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert(error instanceof Error ? error.message : "Error al procesar la operación");
    }
  };

  const handleEditarProducto = (producto: Producto) => {
    setProductoActual(producto);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteProducto = async (id: string) => {
    try {
      await eliminarProducto(id);
      setProductos(productos.filter((p) => p._id !== id));
      alert("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto");
    }
  };

  const resetForm = () => {
    setProductoActual({
      nombre: "",
      descripcion: "",
      precio: 0,
      cantidad: 0,
      imagen: "",
      category: "otros",
      favorito: false,
    });
    setShowForm(false);
    setIsEditing(false);
  };

  const handleActualizarPedido = (id: string) => {
    const updatedPedidos = pedidos.map((p) =>
      p._id === id ? { ...p, estado: "Enviado" } : p
    );
    setPedidos(updatedPedidos);
    localStorage.setItem(`pedido_${id}`, JSON.stringify(updatedPedidos.find((p) => p._id === id)));
  };

  const handleEliminarPedido = (id: string) => {
    const nuevosPedidos = pedidos.filter((p) => p._id !== id);
    setPedidos(nuevosPedidos);
    localStorage.removeItem(`pedido_${id}`);
  };

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>

      <button className="toggle-header" onClick={() => setMostrarProductos(!mostrarProductos)}>
        Gestionar Productos
      </button>
      {mostrarProductos && (
        <div className="section-content active">
          <h2>Gestión de Productos</h2>
          <button onClick={() => { setShowForm(true); setIsEditing(false); }}>
            Agregar Nuevo Producto
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="product-form">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={productoActual.nombre}
                onChange={(e) => setProductoActual({ ...productoActual, nombre: e.target.value })}
                required
              />
              <textarea
                placeholder="Descripción"
                value={productoActual.descripcion}
                onChange={(e) => setProductoActual({ ...productoActual, descripcion: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={productoActual.precio}
                onChange={(e) => setProductoActual({ ...productoActual, precio: Number(e.target.value) })}
                required
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={productoActual.cantidad}
                onChange={(e) => setProductoActual({ ...productoActual, cantidad: Number(e.target.value) })}
                required
              />
              <input
                type="text"
                placeholder="URL de la imagen"
                value={productoActual.imagen}
                onChange={(e) => setProductoActual({ ...productoActual, imagen: e.target.value })}
                required
              />
              <select
                value={productoActual.category}
                onChange={(e) => setProductoActual({ ...productoActual, category: e.target.value as Producto["category"] })}
                required
              >
                <option value="tecnologia">Tecnología</option>
                <option value="ropa">Ropa</option>
                <option value="zapatos">Zapatos</option>
                <option value="otros">Otros</option>
              </select>
              <div className="form-buttons">
                <button type="submit">
                  {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
                </button>
                <button type="button" onClick={resetForm}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto._id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.category}</td>
                  <td>
                    <button onClick={() => handleEditarProducto(producto)}>Editar</button>
                    <button onClick={() => handleDeleteProducto(producto._id!)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="toggle-header" onClick={() => setMostrarPedidos(!mostrarPedidos)}>
        Gestionar Pedidos
      </button>
      {mostrarPedidos && (
        <div className="section-content active">
          <h2>Lista de Pedidos</h2>
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="card">
              <h3>Pedido ID: {pedido._id}</h3>
              <p>Usuario: {pedido.envio.nombre} {pedido.envio.apellidos}</p>
              <p>Dirección: {pedido.envio.direccion}</p>
              <p>Ciudad: {pedido.envio.ciudad}</p>
              <p>Departamento: {pedido.envio.departamento}</p>
              <p>Estado: {pedido.estado}</p>
              <p>Método de Pago: {pedido.metodoPago}</p>
              <div className="button-group">
                <button onClick={() => handleActualizarPedido(pedido._id)}>
                  Marcar como Enviado
                </button>
                <button onClick={() => handleEliminarPedido(pedido._id)}>
                  Eliminar Pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
