import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "./FormField";
import ProductRow from "./ProductRow";
import actualizarCantidadProducto from './act'; // Asegúrate de la ruta correcta
import CashierLayout from '../../components/CashierLayout';
import AdminLayout from '../../components/AdminLayout';
import Modal from "../modal";

const Rpedido = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({
    Nombres: "", // Cambiado a "Nombres"
    num: "",
    adress: "",
    paymentMethod: "",
  });
  
  const [availableProducts, setAvailableProducts] = useState([]);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [tempQuantity, setTempQuantity] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        if (response.ok) {
          const data = await response.json();
          setAvailableProducts(data);
        } else {
          console.error("Error al obtener productos");
        }
      } catch (error) {
        console.error("Error en la solicitud de productos:", error);
      }
    };

    const userSession = sessionStorage.getItem('usuario');
    if (userSession) {
      const sessionData = JSON.parse(userSession);
      setUserRole(sessionData.Rol);
    }

    fetchProducts();
  }, []);

  const filteredProducts = availableProducts.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuantityChange = (e, productId) => {
    setTempQuantity(prevState => ({
      ...prevState,
      [productId]: e.target.value,
    }));
  };

  const handleProductAdd = (product) => {
    const quantity = parseInt(tempQuantity[product.id], 10) || 0;
    if (quantity <= 0) {
      showModal("La cantidad debe ser mayor a cero.");
      return;
    }
    if (quantity > product.cantidad) {
      showModal("No hay suficiente stock para esta cantidad.");
      return;
    }

    setOrderedProducts(prevProducts => [
      ...prevProducts,
      { ...product, quantityToAdd: quantity },
    ]);
    setTempQuantity(prevState => ({
      ...prevState,
      [product.id]: "",
    }));
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = orderedProducts.filter((_, i) => i !== index);
    setOrderedProducts(updatedProducts);
  };

  const getTotalPrice = () => {
    return orderedProducts.reduce(
      (total, product) => total + product.precio * product.quantityToAdd,
      0
    );
  };

  const getTotalPriceWithIVA = () => {
    const total = getTotalPrice();
    const iva = total * 0.19; // IVA del 19%
    return total + iva;
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { Nombres, num, adress, paymentMethod } = formData; // Cambiado aquí
    if (!Nombres || !num || !adress || !paymentMethod) { // Cambiado aquí
      showModal("Por favor, complete todos los campos del formulario.");
      return;
    }

    if (orderedProducts.length === 0) {
      showModal("Por favor, añada al menos un producto al pedido.");
      return;
    }

    const totalPriceWithIVA = getTotalPriceWithIVA();
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const productsToSend = orderedProducts.map(
      ({ id, nombre, precio, quantityToAdd }) => ({
        id,
        nombre,
        precio,
        quantityToAdd,
      })
    );

    try {
      const response = await fetch("http://localhost:3001/pedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          products: productsToSend,
          totalPrice: totalPriceWithIVA,
          orderDate: formattedDate,
          status: "activo",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Pedido registrado:", result);
        const updatedAvailableProducts = [...availableProducts];

        for (const product of orderedProducts) {
          const currentProduct = updatedAvailableProducts.find(p => p.id === product.id);
          if (currentProduct) {
            const updatedQuantity = currentProduct.cantidad - product.quantityToAdd;
            await actualizarCantidadProducto(product.id, updatedQuantity);
            currentProduct.cantidad = updatedQuantity;
          }
        }

        setAvailableProducts(updatedAvailableProducts);
        showModal("Pedido registrado con éxito");
        setFormData({
          Nombres: "", // Cambiado aquí
          num: "",
          adress: "",
          paymentMethod: "",
        });
        setOrderedProducts([]);
      } else {
        console.error("Error en el registro");
        showModal("Error en el registro");
      }
    } catch (error) {
      console.error("Error:", error);
      showModal("Error en la conexión");
    }
  };

  const handleConsultOrder = () => {
    navigate("/user/cpedido");
  };

  const renderProductContent = () => (
    <div>
      <div className="flex min-h-screen">
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Registrar Pedido</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField id="Nombres" name="Nombres" value={formData.Nombres} onChange={handleChange} /> {/* Cambiado aquí */}
              <FormField id="num" name="Número" value={formData.num} onChange={handleChange} type="number" />
              <FormField id="adress" name="Dirección" value={formData.adress} onChange={handleChange} />
              <FormField
                id="paymentMethod"
                name="Método de Pago"
                value={formData.paymentMethod}
                onChange={handleChange}
                type="select"
                options={[
                  { value: "efectivo", label: "Efectivo" },
                  { value: "tarjeta", label: "Tarjeta" },
                ]}
              />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Buscar Productos</h2>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <table className="min-w-full divide-y divide-gray-200 mb-6">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponible</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    tempQuantity={tempQuantity}
                    onQuantityChange={(e) => handleQuantityChange(e, product.id)}
                    onAddProduct={() => handleProductAdd(product)}
                  />
                ))}
              </tbody>
            </table>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Productos Añadidos</h2>
              <ul>
                {orderedProducts.map((product, index) => (
                  <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span>{product.nombre} (x{product.quantityToAdd})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <p>Subtotal: ${getTotalPrice()}</p>
                <p>IVA (19%): ${getTotalPrice() * 0.19}</p>
                <p>Total: ${getTotalPriceWithIVA()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Registrar Pedido
              </button>
              <button
                type="button"
                onClick={handleConsultOrder}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Consultar Pedido
              </button>
            </div>
          </form>
        </main>
      </div>

      <Modal 
        isVisible={modalVisible} 
        message={modalMessage} 
        onClose={() => setModalVisible(false)} 
      />
    </div>
  );

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

  return (
    <>
      {renderLayout()}
    </>
  );
};

export default Rpedido;
