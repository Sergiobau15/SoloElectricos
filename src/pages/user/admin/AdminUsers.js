import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../components/AdminLayout';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
    const [selectedUser, setSelectedUser] = useState(null); // Estado para el usuario seleccionado

    useEffect(() => {
        axios.get('http://localhost:3001/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }, []);

    const filteredUsers = users.filter(user => {
        const fullName = `${user.Nombres} ${user.Apellidos}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole ? user.Rol === selectedRole : true;
        return matchesSearch && matchesRole;
    });

    // Función para abrir el modal y cargar los datos del usuario seleccionado
    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true); // Abre el modal
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null); // Limpia el usuario seleccionado
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/users/${selectedUser.id}`, selectedUser)
            .then(response => {
                console.log('Usuario actualizado:', response.data);
                closeModal();
                window.location.reload(); // Recarga la página después de actualizar
            })
            .catch(error => {
                console.error('Error al actualizar el usuario:', error);
            });
    };    

    const handleDelete = (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario permanentemente?')) {
            axios.delete(`http://localhost:3001/users/${userId}`)
                .then(response => {
                    console.log('Usuario eliminado:', response.data);
                    window.location.reload(); // Recarga la página después de eliminar
                })
                .catch(error => {
                    console.error('Error al eliminar el usuario:', error);
                });
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-1">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                        <h1 className="text-2xl font-bold mb-6">Usuarios del sistema</h1>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <Link to="/registroUsuarioAdministrador" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Registrar usuario</Link>
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar usuario"
                                        className="border rounded px-3 py-2"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <select
                                        className="border rounded px-3 py-2"
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    >
                                        <option value="">Todos los roles</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Cajero">Cajero</option>
                                        <option value="Almacenista">Almacenista</option>
                                        <option value="Cliente">Cliente</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {filteredUsers.map(user => (
                                    <div key={user.ID} className="border rounded-lg p-4 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold">{user.Nombres} {user.Apellidos}</h3>
                                        <p className="text-gray-600 mb-4">{user.Rol}</p>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>

                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>

                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-3xl">
                        <h2 className="text-xl mb-4 font-semibold text-center">Editar Usuario</h2>
                        <form>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Nombres</label>
                                    <input
                                        type="text"
                                        value={selectedUser.Nombres}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Nombres: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Apellidos</label>
                                    <input
                                        type="text"
                                        value={selectedUser.Apellidos}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Apellidos: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Correo</label>
                                    <input
                                        type="email"
                                        value={selectedUser.Correo}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Correo: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Teléfono</label>
                                    <input
                                        type="number"
                                        value={selectedUser.Telefono}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Telefono: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Dirección</label>
                                    <input
                                        type="text"
                                        value={selectedUser.Direccion}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Direccion: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Género</label>
                                    <select
                                        value={selectedUser.Genero}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Genero: e.target.value })}
                                    >
                                        <option value="">Selecciona un género</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="femenino">Femenino</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Rol</label>
                                    <select
                                        value={selectedUser.Rol}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Rol: e.target.value })}
                                    >
                                        <option value="Administrador">Administrador</option>
                                        <option value="Cajero">Cajero</option>
                                        <option value="Almacenista">Almacenista</option>
                                        <option value="Cliente">Cliente</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="hidden"
                                        value={selectedUser.Contrasena}
                                        className="border rounded w-full px-2 py-1"
                                        onChange={(e) => setSelectedUser({ ...selectedUser, Contrasena: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" className="bg-white text-black border border-gray-300 p-2 rounded hover:bg-gray-300 text-sm" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 text-sm" onClick={handleUpdate}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



        </AdminLayout>
    );
}
