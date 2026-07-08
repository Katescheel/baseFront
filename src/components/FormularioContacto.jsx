import { useState } from "react";
const FormularioContacto = ({onAgregar}) =>{
    const[nombre,setNombre] = useState("");
    const[apellido,setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const[errorForm,setErrorForm]= useState("");

    const handleSubmit =async (e) =>{
        e.preventDefault();

        const nom = nombre.trim();
        const ape = apellido.trim();
        const tel = telefono.trim();
        const corr= correo.trim();

        //campos obligatorios
        if(!nom || !ape || !tel || !corr){
            setErrorForm("Los campos Nombre,Apellido,Telefono y correo son obligatorios");
            return;
        }
        // Nombre debe empezar con mayuscula
        if (nom[0] !== nom[0].toUpperCase() || nom[0].toLowerCase() === nom[0].toUpperCase()) {
        setErrorForm("El Nombre debe comenzar con una letra mayúscula.");
        return;
        }
        //validando que solo sean letras y espacios
        for (let i = 0; i < nom.length; i++) {
            const caracter = nom[i];
        
            if (caracter !== " " && caracter.toLowerCase() === caracter.toUpperCase()) {
                setErrorForm("El Nombre debe contener letras.");
                return;
            }
        }
        //validando que Apellido empience con mayuscula
        if (ape[0] !== ape[0].toUpperCase() || ape[0].toLowerCase() === ape[0].toUpperCase()) {
        setErrorForm("El Apellido debe comenzar con una letra mayúscula.");
        return;
        
        }
        // validar que apellido solo contenga letras
        for (let i = 0; i < ape.length; i++) {
            const caracter = ape[i];
            if (caracter !== " " && caracter.toLowerCase() === caracter.toUpperCase()) {
                setErrorForm("El Apellido debe contener únicamente letras.");
                return;
            }
        }
    //validando telefono
        if (!tel.startsWith("+569") || tel.length !== 12) {
            setErrorForm("El teléfono debe comenzar con +569 y tener 11 caracteres en total (Ej: +56912345678).");
            return;
        }
    //Validando que despues del + sean solo numeros
        const parteNumerica = tel.substring(1); 
        if (isNaN(parteNumerica)) {
            setErrorForm("El teléfono solo debe contener números después del símbolo (+).");
            return;
        }
    // validando correo 
        if (!corr.includes("@")) {
            setErrorForm("El correo electrónico debe incluir un '@'.");
            return;
        }
    // terminacion en '.com' o '.cl'
        if (!corr.endsWith(".com") && !corr.endsWith(".cl")) {
            setErrorForm("El correo electrónico debe terminar en .cl o .com.");
            return;
        }

        setErrorForm("");
        await onAgregar({nombre: nom, 
            apellido:ape,
            telefono:tel,
            correo:corr});

        setNombre("");
        setApellido("");
        setTelefono("");
        setCorreo("");
    };
    
    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded border shadow-sm mb-4 d-flex flex-column gap-3">
            {errorForm && (
                <div className="alert alert-danger py-2 px-3 small m-0" role="alert">
                     {errorForm}
                </div>
            )}
            
            <div className="form-group">
                <label className="form-label small text-secondary fw-semibold mb-1">Nombre:</label>
                <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: Juan"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label small text-secondary fw-semibold mb-1">Apellido:</label>
                <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: Pérez"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="form-label small text-secondary fw-semibold mb-1">Teléfono :</label>
                <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: +56912345678"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="form-label small text-secondary fw-semibold mb-1">Correo:</label>
                <input 
                    type="email" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: katherine@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold py-2 shadow-sm">
                 Guardar Contacto
            </button>
        </form>
    );
};

export default FormularioContacto;