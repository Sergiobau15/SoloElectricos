
// import React from 'react';

// const Modal = ({ isVisible, message, onClose, onConfirm }) => {
//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
//       <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
//         <h2 className="text-xl font-semibold mb-4">Alerta</h2>
//         <p className="mb-4">{message}</p>
//         <div className="flex justify-end">
//           {onConfirm && (
//             <button
//               onClick={onConfirm}
//               className="bg-red-500 text-white p-2 rounded-lg mr-2"
//             >
//               Confirmar
//             </button>
//           )}
//           <button
//             onClick={onClose}
//             className="bg-blue-500 text-white p-2 rounded-lg"
//           >
//             Cancelar
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

const Modal = ({ isVisible, message, onClose, onConfirm, isConfirmation }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          {isConfirmation ? (
            <>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white p-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="bg-blue-500 text-white p-2 rounded-lg ml-2"
              >
                Confirmar
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded-lg"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
