import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'; // Importar iconos
import Header from '../../components/Header';

const Login = () => {
    const [correo, setCorreo] = useState(''); // Minúsculas para las variables de estado
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const accountDropdownRef = useRef(null);
    const navigate = useNavigate();


    const validarCorreo = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo); // Usar el argumento de la función, no el estado
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
    
        if (!correo || !contrasena) {
            setError('Todos los campos son obligatorios');
            return;
        }
    
        if (!validarCorreo(correo)) {
            setError('El correo electrónico no es válido');
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:3001/users'); // Asegúrate de que la ruta es correcta
            const usuarios = response.data;
    
            // Encontrar el usuario que coincide con el correo y la contraseña
            const usuarioEncontrado = usuarios.find(
                user => user.Correo === correo && user.Contrasena === contrasena
            );
    
            if (!usuarioEncontrado) {
                setError('Credenciales incorrectas');
                return;
            }
    
            console.log('Datos del usuario:', usuarioEncontrado);
    
            // Almacena el usuario en sessionStorage, incluyendo el ID
            sessionStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
    
            switch (usuarioEncontrado.Rol) {
                case 'Administrador':
                    navigate('/bienvenidaAdministrador');
                    break;
                case 'Almacenista':
                    navigate('/bienvenidaAlmacenista');
                    break;
                case 'Cajero':
                    navigate('/bienvenidaCajero');
                    break;
                case 'Cliente':
                    navigate('/consultaProductoCliente');
                    break;
                default:
                    navigate('/');
                    break;
            }
        } catch (error) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
            console.error('Error al iniciar sesión:', error.response ? error.response.data.error : error.message);
        }
    };
    

    return (
        <div>
            <header className="bg-gray-800 py-4 shadow-md w-full">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <Link to="/" className="text-lg font-bold text-gray-100">
                        Solo Electricos
                    </Link>

                    <nav className="flex justify-center space-x-4 mt-4 md:mt-0">
                        <ul className="flex flex-wrap justify-center space-x-4">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-100 hover:text-gray-300"
                                >
                                    Inicio
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center space-x-6 mt-4 md:mt-0">

                        <div className="relative" ref={accountDropdownRef}>
                            <button
                                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                className="flex items-center text-gray-100 hover:text-gray-300 focus:outline-none"
                            >
                                <span>Mi Cuenta</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 ml-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </button>
                            {isAccountDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <Link
                                        to="/registroUsuarioCliente"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Registrarme
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto p-4">
                <main className="bg-white p-8 rounded shadow-md max-w-md mx-auto m-4">
                    <h2 className="text-xl font-bold mb-6 text-center">Iniciar sesión</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="correo" className="block mb-2">Correo electrónico</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                placeholder="Ingresar correo electrónico"
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => setCorreo(e.target.value)}
                                value={correo}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contrasena" className="block mb-2">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={mostrarContrasena ? 'text' : 'password'}
                                    id="contrasena"
                                    name="contrasena"
                                    placeholder="Ingresar contraseña"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    onChange={(e) => setContrasena(e.target.value)}
                                    value={contrasena}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                    className="absolute right-2 top-2 text-sm text-gray-500"
                                >
                                    {mostrarContrasena ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-4">Iniciar sesión</button>
                        <Link to="/registroUsuarioCliente" className="text-blue-500 block mb-4">¿No tienes una cuenta?</Link>
                    </form>
                </main>
            </div>
        </div>

    );
};

export default Login;
