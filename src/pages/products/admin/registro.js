import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/AdminLayout';
import StoreKeeperLayout from '../../../components/StoreKeeperLayout';

// Formulario de Producto Component
const ProductoForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    precio: '',
    descripcion: '',
    imagen: '',
    categoria: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol); // Asegurarse de que el rol esté guardado bajo la clave 'Rol'
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    const productData = {
      nombre: formData.nombre,
      cantidad: parseInt(formData.cantidad),
      precio: parseFloat(formData.precio),
      descripcion: formData.descripcion,
      imagen: formData.imagen,
      categoria: formData.categoria,
    };


    try {
      const response = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });


      if (response.ok) {
        setMessage('Producto registrado con éxito.');
        navigate('/consultaProducto');
      } else {
        const errorData = await response.json();
        setMessage(`Error al registrar el producto: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      setMessage(`Error en la solicitud: ${error.message}`);
    }
  };

  const renderProductContent = () => (
    <div className="flex h-screen">


      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-auto">


        {/* Contenido de la página */}
        <main className="flex-grow p-2"> {/* Reducido el padding */}
          <div className="max-w-lg mx-auto"> {/* Ajustado el ancho máximo */}
            <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">Registro de Producto</h1> {/* Texto más pequeño */}
            <div className="bg-white p-4 rounded-lg shadow-lg"> {/* Reducido el padding */}
              <form onSubmit={handleSubmit} className="space-y-3"> {/* Espaciado entre elementos más pequeño */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="nombre">Nombre del Producto</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3"> {/* Ajustado el espacio entre las columnas */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="cantidad">Cantidad</label>
                    <input
                      type="number"
                      id="cantidad"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="precio">Precio</label>
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="imagen">URL de la Imagen</label>
                  <input
                    type="text"
                    id="imagen"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="categoria">Categoría</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="Herramientas manuales">Herramientas manuales</option>
                    <option value="Materiales de construcción">Materiales de construcción</option>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Jardineria y exteriores">Jardineria y exteriores</option>
                    <option value="Pinturas">Pinturas</option>
                  </select>
                </div>
                {message && <p className="text-red-500">{message}</p>}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Registrar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>


    </div>
  );

  const renderLayout = () => {
    if (userRole === 'Administrador') {
      return (
        <AdminLayout>
          {renderProductContent()}
        </AdminLayout>
      );
    } else if (userRole === 'Almacenista') {
      return (
        <StoreKeeperLayout>
          {renderProductContent()}
        </StoreKeeperLayout>
      );
    }
    return null;
  };

  return (
    <>
      {renderLayout()}
    </>
  );
};


export default ProductoForm;