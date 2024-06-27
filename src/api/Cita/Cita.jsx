import { urlBackend } from "../urlBackend";

async function apiSaveCita(servicio) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"cita/save",
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

  async function apiListaCitas() {
    const token = localStorage.getItem("token");
    const result = await fetch(
        urlBackend+"cita",
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;
  }

  async function apiListaCitasMecanico() {
    const token = localStorage.getItem("token");
    const id = JSON.parse(localStorage.getItem("data")).id
    const result = await fetch(
        urlBackend+"cita/mecanico/"+id,
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;
  }


  export {apiSaveCita,apiListaCitas,apiListaCitasMecanico}