import {  urlBackend } from "../urlBackend";
async function apiListaTiposServicios() {
    const token = localStorage.getItem("token");
    const result = await fetch(
        urlBackend+"tipo/servicio",
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;
  }

  export {apiListaTiposServicios}