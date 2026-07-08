import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const DetalleContacto = ({ contacto, onActualizar, onEliminar }) => {
    
    // Destructuración
    const { id_contacto, nombre, apellido, dato_contacto } = contacto;
    
    // Estados para editar
    const [editandoBasicos, setEditandoBasicos] = useState(false);
    const [editNombre, setEditNombre] = useState(nombre);
    const [editApellido, setEditApellido] = useState(apellido);
    
    // que es lo que se esta editando
    const [idDatoEditando, setIdDatoEditando] = useState(null);
    const [editDatoCampos, setEditDatoCampos] = useState({
        tipo: "Personal",
        telefono: "",
        correo: "",
        direccion: ""
    });
    
    
    const [nuevoDatos, setNuevoDato] = useState({
        tipo: 'Personal',
        correo: '',
        telefono: '',
        direccion: ''
    });
    const [errorInput, setErrorInput] = useState('');
    const [mostrandoConfirmarEliminar, setMostrandoConfirmarEliminar] = useState(false);

    useEffect(() => {
        setEditNombre(nombre);
        setEditApellido(apellido);
        setEditandoBasicos(false);
        setIdDatoEditando(null);
        setErrorInput('');
        setMostrandoConfirmarEliminar(false);
    }, [nombre, apellido]);

    // Guardar Nombre y apellido 
    const guardarCambiosBasicos = async () => {
        if (!editNombre.trim() || !editApellido.trim()) {
            setErrorInput("Nombre y Apellido son obligatorios.");
            return;
        }
        try {
            const url = `https://uammecbzbbcvpaetvviv.supabase.co/rest/v1/contacto?id_contacto=eq.${id_contacto}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'apikey': 'sb_publishable_lz0WFQa6-U3oGAfkKZI6rQ_6PN_dvw3',
                    'Authorization': 'Bearer sb_publishable_lz0WFQa6-U3oGAfkKZI6rQ_6PN_dvw3',
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                },
                body: JSON.stringify({
                    nombre: editNombre.trim(),
                    apellido: editApellido.trim()
                })
            });
            if (!response.ok) throw new Error("Error al actualizar");
            setEditandoBasicos(false);
            setErrorInput('');
            onActualizar(); // Refresca el estado global en App
        } catch (err) {
            console.error(err);
            setErrorInput('Error al actualizar los datos básicos.');
        }
    };

    // Editar datos 
    const activarEdicionDato = (d) => {
        setIdDatoEditando(d.id_dato_contacto);
        setEditDatoCampos({
            tipo: d.tipo || "Personal",
            telefono: d.telefono || "",
            correo: d.correo || "",
            direccion: d.direccion || ""
        });
    };

    // Guardar Cambios del dato editado
    const guardarCambiosDato = async (idDato) => {
        const tel = editDatoCampos.telefono ? editDatoCampos.telefono.trim() : "";
        const corr = editDatoCampos.correo ? editDatoCampos.correo.trim() : "";
        const dir = editDatoCampos.direccion ? editDatoCampos.direccion.trim() : "";
    
        // Validar que al menos uno tenga informacion
        if (!tel && !corr && !dir) {
            setErrorInput("Debe rellenar al menos un campo para actualizar la información.");
            return;
        }
        
        // Validando el teléfono en Editar
        if (tel !== "") {
            if (!tel.startsWith("+569") || tel.length !== 12) {
                setErrorInput("El teléfono debe comenzar con +569 y tener 12 caracteres en total (Ej: +56912345678).");
                return;
            }
            const regexSoloNumeros = /^\+[0-9]+$/; 
            if (!regexSoloNumeros.test(tel)) {
                setErrorInput("El teléfono solo debe contener números después del símbolo (+).");
                return;
            }
        }
        if (corr !== "") {
        // Valida  @ y que termine  en .com o .cl
            const regexCorreo = /^[^\s@]+@[^\s@]+\.(com|cl)$/i;

            if (!regexCorreo.test(corr)) {
                setErrorInput("El formato del correo electrónico no es válido. Debe contener '@' y terminar en .com o .cl (Ej: usuario@correo.com o usuario@correo.cl).");
                return; 
        }
    }

        try {
            const url = `https://uammecbzbbcvpaetvviv.supabase.co/rest/v1/dato_contacto?id_dato_contacto=eq.${idDato}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'apikey': 'sb_publishable_lz0WFQa6-U3oGAfkKZI6rQ_6PN_dvw3',
                    'Authorization': 'Bearer sb_publishable_lz0WFQa6-U3oGAfkKZI6rQ_6PN_dvw3',
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                body: JSON.stringify({
                    tipo: editDatoCampos.tipo,
                    telefono: tel || null,
                    correo: corr || null,
                    direccion: dir || null
                })
            });

            if (!response.ok) throw new Error("Error al actualizar");
            
            setIdDatoEditando(null); 
            setErrorInput('');
            onActualizar(); 
        } catch (err) {
            console.error(err);
            setErrorInput('Error al actualizar la información adicional.');
        }
    };

    // Guardar nuevo dato
    const agregarDetalle = async (e) => {
        e.preventDefault();
        
        const tel = nuevoDatos.telefono ? nuevoDatos.telefono.trim() : "";
        const corr = nuevoDatos.correo ? nuevoDatos.correo.trim() : "";
        const dir = nuevoDatos.direccion ? nuevoDatos.direccion.trim() : "";

        // Validación: al menos uno de los campos de contacto debe tener información
        if (!tel && !corr && !dir) {
            setErrorInput("Debe rellenar al menos un campo de información");
            return;
        }

        if (tel !== "") {
            if (!tel.startsWith("+569") || tel.length !== 12){
                setErrorInput("El teléfono debe comenzar con +569 y tener 12 digitos");
                return;
            }
            const regexSoloNumeros = /^\+[0-9]+$/;
            if (!regexSoloNumeros.test(tel)){
                setErrorInput("El teléfono solo debe contener números");
                return;
            }
        }
        if (corr !== "") {
    // Valida que contenga @ y que termine estrictamente en .com o .cl 
            const regexCorreo = /^[^\s@]+@[^\s@]+\.(com|cl)$/i;
    
            if (!regexCorreo.test(corr)) {
                setErrorInput("El formato del correo electrónico no es válido. Debe contener '@' y terminar en .com o .cl (Ej: usuario@correo.com o usuario@correo.cl).");
                return;
            }
        }
        try { 
            const datosLimpios = {
                id_contacto,
                tipo: nuevoDatos.tipo,
                telefono: tel || null,
                correo: corr || null,
                direccion: dir || null
            };

            const { error } = await supabase
                .from('dato_contacto')
                .insert([datosLimpios]);
            
            if (error) throw error;
            
            setNuevoDato({ tipo: 'Personal', correo: '', telefono: '', direccion: '' });
            setErrorInput('');
            onActualizar(); 
        } catch (err) {
            console.error(err);
            setErrorInput('Error de conexión con supabase al guardar los datos');
        }
    };

    const eliminarDetalle = async (idDato) => {
        try {
            const { error } = await supabase
                .from('dato_contacto')
                .delete()
                .eq('id_dato_contacto', idDato);
            
            if (error) throw error;
            onActualizar();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="d-flex flex-column gap-4">
            <div className="border-bottom pb-2">
                {editandoBasicos ? (
                    <div className="d-flex gap-2 align-items-center">
                        <input 
                            type="text" 
                            className="form-control form-control-sm fw-bold fs-5 text-dark" 
                            value={editNombre} 
                            onChange={e => setEditNombre(e.target.value)} 
                        />
                        <input 
                            type="text" 
                            className="form-control form-control-sm fw-bold fs-5 text-dark" 
                            value={editApellido} 
                            onChange={e => setEditApellido(e.target.value)} 
                        />
                        <button 
                            className="btn btn-success btn-sm fw-semibold px-3" 
                            onClick={guardarCambiosBasicos}
                        >
                            Guardar 
                        </button>
                        <button 
                            className="btn btn-secondary btn-sm fw-semibold px-3" 
                            onClick={() => { 
                                setEditandoBasicos(false); 
                                setEditNombre(nombre); 
                                setEditApellido(apellido); 
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h3 className="m-0 text-dark fw-bold"> {nombre} {apellido}</h3>
                        <div className="d-flex flex-column align-items-end gap-2">
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-outline-warning btn-sm fw-semibold text-dark border-secondary-subtle"
                                    onClick={() => setEditandoBasicos(true)}
                                Amin>
                                    Editar Nombre
                                </button>
                                {!mostrandoConfirmarEliminar && (
                                    <button 
                                        className="btn btn-danger btn-sm fw-semibold" 
                                        onClick={() => setMostrandoConfirmarEliminar(true)}
                                    >
                                        Eliminar Contacto
                                    </button>
                                )}
                            </div>
                            {mostrandoConfirmarEliminar && (
                                <div className="alert alert-danger p-2 m-0 mt-2 shadow-sm rounded-3 d-flex align-items-center gap-3 animate__animated animate__fadeIn" style={{ fontSize: '0.85rem' }}>
                                    <span className="fw-medium text-danger-emphasis">¿Borrar contacto por completo?</span>
                                    <div className="d-flex gap-1">
                                        <button 
                                            className="btn btn-danger btn-sm py-0 px-2 fw-bold"
                                            onClick={() => {
                                                onEliminar(id_contacto);
                                                setMostrandoConfirmarEliminar(false);
                                            }}
                                        >
                                            Sí
                                        </button>
                                        <button 
                                            className="btn btn-light btn-sm py-0 px-2 border"
                                            onClick={() => setMostrandoConfirmarEliminar(false)}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
   
            {/* Lista de Datos */}
            <div>
                <h4 className="mb-2 text-secondary h6 text-uppercase small fw-bold">Datos de contacto guardados</h4>
                {errorInput && (
                    <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                         {errorInput}
                    </div>
                )}

                {dato_contacto && dato_contacto.length > 0 ? (
                    <ul className="list-group shadow-sm">
                        {dato_contacto.map((d) => (
                            <li key={d.id_dato_contacto} className="list-group-item bg-light border-light py-2">
                                {idDatoEditando === d.id_dato_contacto ? (
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex gap-2">
                                            <select 
                                                value={editDatoCampos.tipo} 
                                                onChange={e => setEditDatoCampos({...editDatoCampos, tipo: e.target.value})} 
                                                className="form-select form-select-sm w-auto"
                                            >
                                                <option value="Personal">Personal</option>
                                                <option value="Trabajo">Trabajo</option>
                                                <option value="Casa">Casa</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                placeholder="Teléfono" 
                                                className="form-control form-control-sm"
                                                value={editDatoCampos.telefono}
                                                onChange={e => setEditDatoCampos({...editDatoCampos, telefono: e.target.value})}
                                            />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <input 
                                                type="email" 
                                                placeholder="Correo" 
                                                className="form-control form-control-sm"
                                                value={editDatoCampos.correo}
                                                onChange={e => setEditDatoCampos({...editDatoCampos, correo: e.target.value})}
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="Dirección" 
                                                className="form-control form-control-sm"
                                                value={editDatoCampos.direccion}
                                                onChange={e => setEditDatoCampos({...editDatoCampos, direccion: e.target.value})}
                                            />
                                        </div>
                                        <div className="d-flex gap-2 justify-content-end mt-1">
                                            <button className="btn btn-success btn-sm py-0 px-2 small fw-bold" onClick={() => guardarCambiosDato(d.id_dato_contacto)}>Guardar</button>
                                            <button className="btn btn-outline-danger btn-sm fw-semibold text-dark border-secondary-subtle px-3" onClick={() => setIdDatoEditando(null)}>Cancelar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className={`badge me-2 ${
                                                d.tipo === 'Trabajo' ? 'bg-warning text-dark' : 
                                                d.tipo === 'Casa' ? 'bg-success' : 'bg-primary'
                                            }`}>
                                                {d.tipo}
                                            </span>
                                            <span className="text-dark small">
                                                {d.telefono && ` ${d.telefono} `}
                                                {d.correo && ` ${d.correo} `}
                                                {d.direccion && ` ${d.direccion}`}
                                            </span>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button 
                                                onClick={() => activarEdicionDato(d)} 
                                                className="btn btn-outline-info btn-sm fw-semibold text-dark border-secondary-subtle px-3" 
                                                title="Editar este dato"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => eliminarDetalle(d.id_dato_contacto)} 
                                                className="btn btn-outline-danger btn-sm fw-semibold text-dark border-secondary-subtle px-3"
                                                title="Eliminar este dato"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted small fst-italic bg-light p-3 rounded border text-center">
                        Este contacto no posee información adicional.
                    </p>
                )}
            </div>

            
            <form onSubmit={agregarDetalle} className="bg-white p-4 rounded border shadow-sm d-flex flex-column gap-3">
                <h5 className="m-0 h6 text-dark fw-bold">Añadir Información Adicional</h5>
                <div className="form-group">
                    <label className="form-label small text-secondary fw-semibold mb-1">Tipo de contacto:</label>
                    <select 
                        value={nuevoDatos.tipo} 
                        onChange={e => setNuevoDato({...nuevoDatos, tipo: e.target.value})} 
                        className="form-select form-select-sm"
                    >
                        <option value="Personal">Personal</option>
                        <option value="Trabajo">Trabajo</option>
                        <option value="Casa">Casa</option>
                    </select>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Teléfono (Ej: +56912345678)" 
                        value={nuevoDatos.telefono} 
                        onChange={e => setNuevoDato({...nuevoDatos, telefono: e.target.value})} 
                        className="form-control form-control-sm"
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                        placeholder="Correo Electrónico" 
                        value={nuevoDatos.correo} 
                        onChange={e => setNuevoDato({...nuevoDatos, correo: e.target.value})} 
                        className="form-control form-control-sm"
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Dirección Postal" 
                        value={nuevoDatos.direccion} 
                        onChange={e => setNuevoDato({...nuevoDatos, direccion: e.target.value})} 
                        className="form-control form-control-sm"
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-sm fw-bold mt-2 shadow-sm">
                    Guardar Datos
                </button>
            </form>
        </div>
    );
};

export default DetalleContacto;