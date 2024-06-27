import { urlBackend } from "../urlBackend";


async function apiSaveMetodoPagoServicios(servicio) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"metodo/pago/save",
      {
        method: "POST",
        body:JSON.stringify(servicio),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
      }
    );
    return result;
  }

  export {apiSaveMetodoPagoServicios}