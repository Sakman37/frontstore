import api from "./api";

// Obtener todos los productos
export const obtenerProductos = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Eliminar un producto por ID
export const eliminarProducto = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Actualizar un producto por ID
export const actualizarProducto = async (id: string, productoActualizado: any) => {
  const response = await api.put(`/products/${id}`, productoActualizado);
  return response.data;
};

// En el servicio agregarProducto
export const agregarProducto = async (producto: any) => {
  const response = await api.post("/products", producto);
  return response.data;
};