import React, { useState, useRef } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';

const Create = () => {
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [genero, setGenero] = useState("");
    const [rol] = useState("Cliente");
    const [error, setError] = useState("");
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const accountDropdownRef = useRef(null);

    // Expresiones regulares
    const regexNombre = /^[a-zA-Z\s]+$/; // Solo letras y espacios
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato de correo válido
    const regexTelefono = /^3\d{9}$/;
    const regexContrasena = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Mínimo 8 caracteres, al menos una letra y un número

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones
        if (!regexNombre.test(nombres)) {
            setError("El nombre solo puede contener letras y espacios.");
            return;
        }
        if (!regexNombre.test(apellidos)) {
            setError("Los apellidos solo pueden contener letras y espacios.");
            return;
        }
        if (!regexCorreo.test(correo)) {
            setError("El formato del correo electrónico no es válido.");
            return;
        }
        if (!regexTelefono.test(telefono)) {
            setError("El número de teléfono debe contener 10 dígitos.");
            return;
        }
        if (!regexContrasena.test(contrasena)) {
            setError("La contraseña debe tener al menos 8 caracteres, una letra y un número.");
            return;
        }
        if (contrasena !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setError(""); // Si todo está bien, limpia el error
        registroUsuario();
    }

    const registroUsuario = () => {
        axios.post("http://localhost:3001/users", {
            Nombres: nombres,
            Apellidos: apellidos,
            Correo: correo,
            Contrasena: contrasena,
            Telefono: telefono,
            Direccion: direccion,
            Genero: genero,
            Rol: rol
        }).then(() => {
            alert("Registro exitoso");
        }).catch(error => {
            console.error("Hubo un error en el registro:", error);
            alert("Hubo un error en el registro.");
        });
    }

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
            <main className="container mx-auto p-4 m-4">
                <div className="max-w-md mx-auto p-8 bg-white rounded-md shadow-md">
                    <h2 className="text-2xl font-semibold text-center mb-6">Crear una cuenta</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="flex mb-4">
                            <div className="w-1/2 pr-2">
                                <label htmlFor="Nombres" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                                <input
                                    type="text"
                                    id="Nombres"
                                    name="Nombres"
                                    placeholder="Ingresar nombre"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    onChange={e => setNombres(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label htmlFor="Apellidos" className="block text-gray-700 text-sm font-bold mb-2">Apellidos</label>
                                <input
                                    type="text"
                                    id="Apellidos"
                                    name="Apellidos"
                                    placeholder="Ingresar apellidos"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    onChange={e => setApellidos(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex mb-4">
                            <div className="w-1/2 pr-2">
                                <label htmlFor="Telefono" className="block text-gray-700 text-sm font-bold mb-2">Número de teléfono</label>
                                <input
                                    type="text"
                                    id="Telefono"
                                    name="Telefono"
                                    placeholder="Ingresar número telefónico"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    onChange={e => setTelefono(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label htmlFor="Genero" className="block text-gray-700 text-sm font-bold mb-2">Género</label>
                                <select
                                    id="Genero"
                                    name="Genero"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                    onChange={e => setGenero(e.target.value)}
                                >
                                    <option value="">Seleccionar género</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Direccion" className="block text-gray-700 text-sm font-bold mb-2">Dirección de residencia</label>
                            <input
                                type="text"
                                id="Direccion"
                                name="Direccion"
                                placeholder="Ingresar dirección"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                onChange={e => setDireccion(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Correo" className="block text-gray-700 text-sm font-bold mb-2">Correo electrónico</label>
                            <input
                                type="email"
                                id="Correo"
                                name="Correo"
                                placeholder="Ingresar correo electrónico"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                onChange={e => setCorreo(e.target.value)}
                            />
                        </div>
                        <div className="flex mb-4">
                            <div className="w-1/2 pr-2">
                                <label htmlFor="Contrasena" className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                                <input
                                    type="password"
                                    id="Contrasena"
                                    name="Contrasena"
                                    placeholder="Ingresar contraseña"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    onChange={e => setContrasena(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirmar contraseña</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirmar contraseña"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-center mx-auto">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue">
                                Registrarme
                            </button>
                            <Link to="/login" className="text-blue-500 hover:text-blue-700 underline block mt-4">¿Ya tienes una cuenta?</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>

    );
};

export default Create;
