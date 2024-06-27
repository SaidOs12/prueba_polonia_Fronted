import {  urlBackend } from "../../urlBackend";
async function apiLlamadaMecanico(id) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"twilio/call/"+id,
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;
  }
  async function apiSegundaLlamadaMecanico(servicio) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"twilio/call/mecanico/"+servicio.mecanico.id+"/"+servicio.id,
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;
  }


  export {apiLlamadaMecanico,apiSegundaLlamadaMecanico}