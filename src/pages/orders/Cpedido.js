import React, { useState, useEffect } from 'react';
import CashierLayout from '../../components/CashierLayout';
import AdminLayout from '../../components/AdminLayout';
import Modal from './modal'; // Asegúrate de que la ruta sea correcta

function Cpedido() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    Nombres: '',
    num: '',
    adress: '',
    paymentMethod: '',
    orderDate: '',
    products: [],
    totalPrice: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/pedido')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol);
    }
  }, []);

  useEffect(() => {
    const results = data.filter((order) =>
      (order.Nombres?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (order.num?.includes(searchQuery) || '') ||
      (order.adress?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (order.paymentMethod?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (order.orderDate?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      order.products.some((product) =>
        product.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredData(results);
  }, [searchQuery, data]);

  const handleAlert = (message, isDelete = false) => {
    setAlertMessage(message);
    setIsDeleteConfirmation(isDelete);
    setShowAlert(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
    handleAlert("¿Estás seguro de que deseas eliminar esta orden?", true);
  };

  const confirmDeleteOrder = () => {
    fetch(`http://localhost:3001/pedido/${confirmDeleteId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setData(data.filter((order) => order.id !== confirmDeleteId));
          setFilteredData(filteredData.filter((order) => order.id !== confirmDeleteId));
          handleAlert("Orden eliminada con éxito.");
        }
      })
      .catch((error) => handleAlert(error.message));
    setConfirmDeleteId(null);
  };

  const handleEdit = (order) => {
    setEditOrder(order);
    setFormData({ ...order });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.num || !formData.adress || !formData.paymentMethod) {
      handleAlert("Por favor, completa todos los campos requeridos.");
      return;
    }

    fetch(`http://localhost:3001/pedido/${formData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((updatedOrder) => {
        setData(data.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
        setFilteredData(filteredData.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
        setEditOrder(null);
        handleAlert("Orden guardada con éxito.");
      })
      .catch((error) => handleAlert(error.message));
  };

  const handleShowProducts = (products) => {
    setSelectedProducts(products);
    setShowProductsModal(true);
  };

  const renderLayout = () => {
    if (userRole === 'Administrador') {
      return (
        <AdminLayout>
          {renderProductContent()}
        </AdminLayout>
      );
    } else if (userRole === 'Cajero') {
      return (
        <CashierLayout>
          {renderProductContent()}
        </CashierLayout>
      );
    }
    return null;
  };

  const renderProductContent = () => (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Datos de Pedido</h1>
  
          <div className="mb-6 text-center">
            <label className="block mb-2">
              Buscar:
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1 block w-1/3 mx-auto border border-gray-300 rounded-lg p-2"
              />
            </label>
          </div>

          {editOrder && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-2">Editar Orden</h2>
                <form>
                  <label className="block mb-2">
                    Número:
                    <input
                      type="text"
                      name="num"
                      value={formData.num}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    />
                  </label>
                  <label className="block mb-2">
                    Dirección:
                    <input
                      type="text"
                      name="adress"
                      value={formData.adress}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    />
                  </label>
                  <label className="block mb-2">
                    Método de Pago:
                    <input
                      type="text"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    />
                  </label>
                  <label className="block mb-2">
                    Precio Total:
                    <input
                      type="number"
                      name="totalPrice"
                      disabled
                      value={formData.totalPrice}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-blue-500 text-white p-2 rounded-lg mt-4"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditOrder(null)}
                    className="bg-gray-500 text-white p-2 rounded-lg mt-4 ml-4"
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            </div>
          )}

          {showProductsModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-2">Productos en la Orden</h2>
                <ul className="list-disc pl-5 mb-4">
                  {selectedProducts.map((product) => (
                    <li key={product.id} className="mb-1">
                      {product.nombre} - Precio: ${product.precio} - Cantidad: {product.quantityToAdd}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowProductsModal(false)}
                  className="bg-gray-500 text-white p-2 rounded-lg mt-4"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredData.map((order) => (
              <div key={order.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h2 className="text-xl font-semibold mb-2">Cliente: {order.Nombres}</h2>
                <p className="text-gray-700 mb-1">Número: {order.num}</p>
                <p className="text-gray-700 mb-1">Dirección: {order.adress}</p>
                <p className="text-gray-700 mb-1">Método de Pago: {order.paymentMethod}</p>
                <p className="text-gray-700 mb-3">Fecha de Orden: {order.orderDate || 'No especificada'}</p>
                <p className="font-bold">Total: ${order.totalPrice}</p>
                
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Productos:</h3>
                  <button
                    onClick={() => handleShowProducts(order.products)}
                    className="text-blue-500 underline"
                  >
                    Ver Productos
                  </button>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleEdit(order)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex-1"
                  >
                    Modificar
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {renderLayout()}

      <Modal 
        isVisible={showAlert} 
        message={alertMessage} 
        onClose={() => setShowAlert(false)} 
        onConfirm={isDeleteConfirmation ? confirmDeleteOrder : null} 
        isConfirmation={isDeleteConfirmation} 
      />
    </>
  );
}

export default Cpedido;
