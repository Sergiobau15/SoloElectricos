import React, { useState, useEffect } from 'react';
import AdministradorActualizarProducto from './actualizar';
import ConfirmModal from '../../../components/deleteProduct';
import StoreKeeperLayout from '../../../components/StoreKeeperLayout';
import AdminLayout from '../../../components/AdminLayout';

const AdministradorConsultaProducto = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [userRole, setUserRole] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol);
    }
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => product.categoria === selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  };

  const handleProductUpdate = async () => {
    await fetchProducts();
  };

  const handleProductDelete = async () => {
    try {
      await fetch(`http://localhost:3001/products/${selectedProductId}`, {
        method: 'DELETE',
      });
      await fetchProducts();
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openUpdateForm = (productId) => {
    setSelectedProductId(productId);
    setIsUpdateFormOpen(true);
  };

  const closeUpdateForm = () => {
    setIsUpdateFormOpen(false);
    setSelectedProductId(null);
  };

  const confirmDelete = (productId) => {
    setSelectedProductId(productId);
    setIsConfirmModalOpen(true);
  };

  const renderProductContent = () => (
    <div className="flex flex-col h-full bg-gray-100">
      <main className="flex-grow p-4 overflow-y-auto">
        <center>
          <h1 className="text-3xl mb-6 p-6 bg-gray-700 text-white font-bold rounded-lg shadow-md">
            Nuestros productos
          </h1>
        </center>

        <div className="mb-4 text-center">
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="p-2 border border-gray-300 rounded-md text-gray-700"
          >
            <option value="">Todos los productos</option>
            <option value="Herramientas manuales">Herramientas manuales</option>
            <option value="Materiales de construcción">Materiales de construcción</option>
            <option value="Electricidad">Electricidad</option>
            <option value="Jardinería y exteriores">Jardinería y exteriores</option>
            <option value="Pinturas">Pinturas</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between min-h-[400px]">
              <div className="relative w-full h-32 bg-gray-200 rounded overflow-hidden">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 break-words">{product.nombre}</h2>
                <p className="text-gray-700 mb-2">Stock: {product.cantidad}</p>
                <p className="text-gray-700 mb-2">Precio: ${product.precio}</p>
                <p className="text-gray-700 mb-4 flex-grow break-words">{product.descripcion}</p>
              </div>
              <div className="flex space-x-2 mt-4">
              <button
                    onClick={() => openUpdateForm(product.id)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-300 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => confirmDelete(product.id)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-300 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
              </div>
            </div>
          ))}
        </div>

        {isUpdateFormOpen && (
          <AdministradorActualizarProducto
            productId={selectedProductId}
            onClose={() => {
              closeUpdateForm();
              handleProductUpdate();
            }}
          />
        )}

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onConfirm={handleProductDelete}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      </main>
    </div>
  );

  const renderLayout = () => {
    if (userRole === 'Administrador') {
      return <AdminLayout>{renderProductContent()}</AdminLayout>;
    } else if (userRole === 'Almacenista') {
      return <StoreKeeperLayout>{renderProductContent()}</StoreKeeperLayout>;
    }
    return null;
  };

  return <>{renderLayout()}</>;
};

export default AdministradorConsultaProducto;
