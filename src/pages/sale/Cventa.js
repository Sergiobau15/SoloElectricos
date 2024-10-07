import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CashierLayout from '../../components/CashierLayout';
import AdminLayout from '../../components/AdminLayout';


function Cventa() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetch('http://localhost:3001/venta')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });

    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol); // Asegurarse de que el rol esté guardado bajo la clave 'Rol'
    }
  }, []);


  const handleViewDetails = (orderId) => {
    navigate(`/user/detallesVenta/${orderId}`);
  };


  const filteredData = data.filter(order =>
    Object.values(order).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderProductContent = () => (

    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="p-6 flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Datos de Ventas</h1>


        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Buscar:
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Escribe para buscar..."
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>


        {filteredData.length === 0 && !loading && !error && (
          <p className="text-center text-lg text-gray-500">No se encontraron resultados.</p>
        )}


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredData.map((order) => (
            <div key={order.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">ID: {order.id}</h2>
              <div className="text-gray-700 mb-2">
                <p className="mb-1">Descuento: <span className="font-medium">${order.descuento}</span></p>
                <p className="mb-1">Subtotal: <span className="font-medium">${order.subtotal}</span></p>
                <p className="mb-1">Total: <span className="font-medium">${order.total}</span></p>
                <p className="mb-1">Método de Pago: <span className="font-medium">{order.metodoPago}</span></p>
                <p className="mb-3">Fecha y Hora: <span className="font-medium">{order.fechaHora}</span></p>
                <button
                  onClick={() => handleViewDetails(order.id)}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                  Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  )

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


  if (loading) return <p className="text-center text-lg">Cargando...</p>;
  if (error) return <p className="text-center text-lg text-red-600">Error: {error.message}</p>;


  return (
    <>
      {renderLayout()}
    </>
  );
}


export default Cventa;
