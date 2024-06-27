import { urlBackend } from "../urlBackend";

async function apiSaveSubServicios(servicio) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"sub/servicios/save",
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


  export {apiSaveSubServicios}