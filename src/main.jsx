import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.jsx'
import { supabase } from './supabaseClient';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

//probando conexion de supabase en la consola
async function probarConexion() {
  const { data, error } = await supabase.from('contacto').select('*').limit(1);
  
  if (error) {
    console.error('¡Error de conexión con Supabase!:', error.message);
  } else {
    console.log(' ¡Conexión exitosa! La base de datos responde:', data);
  }
}

probarConexion();

