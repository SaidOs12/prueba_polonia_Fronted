import {  urlBackend } from "../urlBackend";
async function apiListaMecanicos() {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"rol/2",
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;
  }

  export {apiListaMecanicos}