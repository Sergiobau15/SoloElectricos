import React from 'react';


const ProductRow = ({ product, onQuantityChange, onAddProduct, tempQuantity }) => (
  <tr key={product.id}>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.descripcion}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.precio}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.cantidad}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <input
        type="number"
        min="1"
        value={tempQuantity[product.id] || ""}
        onChange={(e) => onQuantityChange(e, product.id)}
        className="w-24 px-2 py-1 border border-gray-300 rounded-md"
      />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <button
        type="button"
        onClick={() => onAddProduct(product)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Añadir
      </button>
    </td>
  </tr>
);


export default ProductRow;
