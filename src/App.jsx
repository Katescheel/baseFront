import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ListaContactos from './components/ListaContactos';
import FormularioContacto from './components/FormularioContacto';
import DetalleContacto from './components/DetalleContacto';
import './App.css';

// Definiendo bloque principal 
const App = () => {
    // Inicialización segura de estado para prevenir fallos de carga en el localhost
    const [contactos, setContactos] = useState(() => {
        try {
            const localData = localStorage.getItem('cache_contactos');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error al decodificar el cache local:", error);
            return [];
        }
    });

    /// Estado para saber qué contacto está seleccionado para ver detalle
    const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
    const [error, setError] = useState('');

    // Cargar datos en la API al inicializar
    useEffect(() => {
        obtenerContactos();
    }, []);
    
    /// Función flecha para traer contactos 
    const obtenerContactos = async () => {
        try {
            
            // Pedimos contactos y se adjuntan sus datos_contacto 
            const url = "https://uammecbzbbcvpaetvviv.supabase.co/rest/v1/contacto?select=id_contacto,nombre,apellido,dato_contacto(id_dato_contacto,tipo,correo,telefono,direccion)"
            
            // Fetch con autorizaciones 
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'apikey': 'sb_publishable_lz0WFQa6-U3oGAfkKZI6rQ_6PN_dvw3',
                    'Authorization': 'Bearer sb_publishable_lz0WFQa6-U3oGAfkKZI6rQ_6PN_dvw3',
                    'Content-Type': 'application/json',
                    'Prefer':'return=minimal',
                    'Cache-Control':'no-cache',
                    'Pragma':'no-cache'
                }
            });

            
            if (!response.ok) throw new Error("Error al consultar la API");
            
            // Conversión en datos legibles para react
            const data = await response.json();
            setContactos(data);
            
            /// Guardamos en LocalStorage para persistencia local rápida
            localStorage.setItem('cache_contactos', JSON.stringify(data));
            
            // Sincroniza el panel de detalles buscando el contacto actualizado
            setContactoSeleccionado((prev) => {
                if (!prev) return null;
                return data.find(c => c.id_contacto === prev.id_contacto) || null;
            });
        } catch (err) {
            setError("Error al cargar los contactos de la base de datos");
            console.error(err);
        }
    };

    const agregarContacto = async (datosCompletos) => {
        try {
            // Destructuración 
            const { nombre, apellido, telefono, correo } = datosCompletos;
            
            const { data: dataContacto, error: dbError } = await supabase
                .from('contacto')
                .insert([{ nombre, apellido }])
                .select();

            if (dbError) throw dbError;

            // Si pasa esto, nos devuelve el id generado
            const nuevoIdContacto = dataContacto[0].id_contacto;
            
            // Se guardan los datos correo y teléfono en tabla 2
            const { data: dataDato, error: datoError } = await supabase
                .from('dato_contacto')
                .insert([{
                    id_contacto: nuevoIdContacto,
                    tipo: 'Personal',
                    telefono: telefono,
                    correo: correo,
                    direccion: null 
                }])
                .select();
                
            if (datoError) throw datoError;

            // Datos se vinculan a la tabla datos_contacto y se guardan en ella
            const nuevoContactoConId = {
                id_contacto: nuevoIdContacto,
                nombre: dataContacto[0].nombre,
                apellido: dataContacto[0].apellido,
                dato_contacto: [dataDato[0]]
            };
            
            // Actualizando los estados de forma inmutable
            const listaActualizada = [...contactos, nuevoContactoConId];
            setContactos(listaActualizada);
            localStorage.setItem('cache_contactos', JSON.stringify(listaActualizada));
            
            // Muestra el detalle en el panel de inmediato
            setContactoSeleccionado(nuevoContactoConId);
            setError(""); // Se limpia el error previo si existe

        } catch (err) {
            setError("No se pudo agregar el contacto a la base de datos");
            console.error(err);
        }
    };

    const eliminarContacto = async (id) => {
        try {
            const { error: dbError } = await supabase
                .from('contacto')
                .delete()
                .eq('id_contacto', id);

            if (dbError) throw dbError;
            
            const listaActualizada = contactos.filter(c => c.id_contacto !== id);
            setContactos(listaActualizada);
            localStorage.setItem('cache_contactos', JSON.stringify(listaActualizada));
            
            if (contactoSeleccionado?.id_contacto === id) {
                setContactoSeleccionado(null);
            }
        } catch (err) {
            setError('Error al eliminar el contacto');
            console.error(err);
        }
    };

    return (
        <div className="min-vh-100 bg-light py-5 text-secondary">
            <header className="text-center mb-5">
                <h1 className="display-5 fw-extrabold text-primary m-0 tracking-tight">Agenda de Contactos </h1>
            </header>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>¡Atención!</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
                </div>
            )}
            
            <div className="row g-4">
                {/* Columna Izquierda: Formulario y Lista */}
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm p-4 mb-4 bg-body rounded">
                        <h2 className="h4 text-secondary mb-3">Nuevo Contacto</h2>
                        <FormularioContacto onAgregar={agregarContacto} />
                    </div>
                    
                    <div className="card shadow-sm p-4 bg-body rounded">
                        <h2 className="h4 text-secondary mb-3">Mis Contactos</h2>
                        <ListaContactos 
                            contactos={contactos} 
                            onSeleccionar={setContactoSeleccionado} 
                            onEliminar={eliminarContacto} 
                        />
                    </div>
                </div>

                {/* Columna Derecha: Detalles del contacto seleccionado */}
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm p-4 bg-body rounded h-100">
                        <h2 className="h4 text-secondary mb-3">Datos Adicionales</h2>
                        {contactoSeleccionado ? (
                            <DetalleContacto 
                                contacto={contactoSeleccionado} 
                                onActualizar={obtenerContactos}
                                onEliminar={eliminarContacto}
                            />
                        ) : (
                            <div className="d-flex align-items-center justify-content-center h-75 text-center text-muted">
                                <p className="fst-italic">Selecciona un contacto para ver o gestionar sus datos de contacto.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;