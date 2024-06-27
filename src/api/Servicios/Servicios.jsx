import { url2, urlBackend } from "../urlBackend";
async function apiListaServicios() {
    //const token = localStorage.getItem("token");
    const result = await fetch(
      url2+"/servicios",
      {
        method: "GET",
        // headers:{
        //     "Authorization":"Bearer "+token
        // }
      }
    );
    return result;
  }
  async function apiListadoServicios() {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"servicios",
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;
  }

  async function apiListadoServiciosMecanico() {
    const token = localStorage.getItem("token");
    const id=JSON.parse(localStorage.getItem("data")).id
    const result = await fetch(
      urlBackend+"servicios/"+id+"/mecanico",
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;
  }

  async function apiSaveServicios(servicio) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"servicios/save",
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

  async function apiIniciarTemporizador(id){
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"servicios/iniciar/"+id,
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;

  }
  async function apiFinalizarTemporizador(id){
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"servicios/finalizar/"+id,
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;

  }
  async function apiEntregarServicio(id){
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"servicios/entregar/"+id,
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;

  }
  
  async function apiOperadorIniciarTemporizador(id){
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"servicios/iniciar/"+id+"/operador",
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;

  }
  async function apiOperadorFinalizarTemporizador(id){
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"servicios/finalizar/"+id+"/operador",
      {
        method: "GET",
        headers:{
            "Authorization":"Bearer "+token
        }
      }
    );
    return result;

  }

  export {apiListaServicios ,apiListadoServicios,apiSaveServicios,apiIniciarTemporizador
    ,apiFinalizarTemporizador,apiListadoServiciosMecanico,apiEntregarServicio,
    apiOperadorIniciarTemporizador,apiOperadorFinalizarTemporizador}