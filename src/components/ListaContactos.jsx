import React, { useState } from 'react';

const ListaContactos = ({ contactos, onSeleccionar, onEliminar }) => {
  // contacto que se quiere eliminar
  const [idContactoAEliminar, setIdContactoAEliminar] = useState(null);

  return (
    <div className="mt-3">
      {contactos.length === 0 ? (
        <p className="text-muted small fst-italic bg-light p-3 rounded border text-center">
          No hay contactos registrados en la agenda.
        </p>
      ) : (
        <div className="list-group shadow-sm">
          {contactos.map((contacto) => (
            <div
              key={contacto.id_contacto}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center bg-white border py-2"
              style={{ cursor: 'pointer' }}
              onClick={() => onSeleccionar(contacto)}
            >
              {/* Información del Contacto */}
              <div className="flex-grow-1">
                <span className="fw-semibold text-dark">
                  {contacto.nombre} {contacto.apellido}
                </span>
                {contacto.dato_contacto && contacto.dato_contacto.length > 0 && (
                  <span className="badge bg-secondary ms-2 bg-opacity-75" style={{ fontSize: '0.75rem' }}>
                    {contacto.dato_contacto.length} datos
                  </span>
                )}
              </div>

              
              {idContactoAEliminar === contacto.id_contacto ? (
                //  Alerta integrada 
                <div 
                  className="alert alert-danger m-0 py-1 px-2 d-flex align-items-center gap-2 animate__animated animate__fadeIn"
                  style={{ fontSize: '0.85rem' }}
                  onClick={(e) => e.stopPropagation()} //
                >
                  <span className="fw-medium text-danger-emphasis">¿Desea borrar a este contacto?</span>
                  <div className="d-flex gap-1">
                    <button 
                      className="btn btn-danger btn-sm py-0 px-2 fw-bold"
                      style={{ fontSize: '0.8rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEliminar(contacto.id_contacto);
                        setIdContactoAEliminar(null); //
                      }}
                    >
                      Sí
                    </button>
                    <button 
                      className="btn btn-light btn-sm py-0 px-2 border"
                      style={{ fontSize: '0.8rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdContactoAEliminar(null);
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setIdContactoAEliminar(contacto.id_contacto); 
                  }}
                  className="btn btn-outline-danger btn-sm fw-semibold px-2"
                  title="Eliminar contacto"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaContactos;
    
