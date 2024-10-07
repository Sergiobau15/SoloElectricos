import React, { useState, useEffect } from "react";


const AdministradorActualizarProducto = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);


  // Fetch product details by ID
  useEffect(() => {

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/products/${productId}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };


    fetchProduct();
  }, [productId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3001/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      onClose(); // Close the form after successful update
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  
  if (!product) return <div>Loading...</div>;


  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center overflow-auto">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm max-h-screen overflow-auto">
        <h2 className="text-xl mb-2">Actualizar Producto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={product.nombre}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded text-sm"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={product.cantidad}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded text-sm"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm">Precio</label>
            <input
              type="number"
              name="precio"
              value={product.precio}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded text-sm"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm">Descripción</label>
            <textarea
              name="descripcion"
              value={product.descripcion}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded text-sm"
              rows="3"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm">
              URL de la imagen
            </label>
            <input
              type="text"
              name="imagen"
              value={product.imagen}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded text-sm"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm">Categoría</label>
            <select
              name="categoria"
              value={product.categoria}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded text-sm"
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="Herramientas manuales">
                Herramientas manuales
              </option>
              <option value="Materiales de construcción">
                Materiales de construcción
              </option>
              <option value="Pinturas">Pinturas</option>
              <option value="Electricidad">Iluminacion y electricidad</option>
              <option value="Jardineria y exteriores">
                Jardineria y exteriores
              </option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            {" "}
            {/* Añadir espacio entre botones */}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 text-sm"
            >
              Actualizar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-black border border-gray-300 p-2 rounded hover:bg-gray-300 text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default AdministradorActualizarProducto;