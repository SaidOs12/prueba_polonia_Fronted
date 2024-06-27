import {  urlBackend } from "../urlBackend";
async function apiListaTiposPagos() {
    const token = localStorage.getItem("token");
    const result = await fetch(
        urlBackend+"tipo/pago",
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;
  }

  export {apiListaTiposPagos}