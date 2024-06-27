import React, { createContext, useContext, useEffect, useState } from "react";
import {
  apiListaServicios,
  apiListadoServicios,
  apiListadoServiciosMecanico,
} from "../../api/Servicios/Servicios";
import { apiListaTiposServicios } from "../../api/Servicios/TipoServicios";
import { apiListaMecanicos } from "../../api/Servicios/apiRol";
import { apiListaTiposPagos } from "../../api/Servicios/TipoPago";
import WebSocketComponent from "../Websocket/WebSocketComponent";
import Swal from "sweetalert2";
import { apiListaCitas, apiListaCitasMecanico } from "../../api/Cita/Cita";
const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [img, SetImg] = useState([]);
  const modulo = localStorage.getItem("modulo");
  const usuario = JSON.parse(localStorage.getItem("data"));
  const [servicios, setServicios] = useState([]);
  const [tipoServicios, setTipoServicios] = useState([]);
  const [tipoPagos, setTipoPagos] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [citas, setCitas] = useState([]);
  const [citasMecanico, setCitasMecanico] = useState([]);
  //Listado de servicios
  useEffect(() => {
    if (modulo === "operador" || modulo === "admin") buscarListaDeServicios();
  }, [modulo]);
  //Listado de tipo servicios
  useEffect(() => {
    //Losta de tipos de servicios
    buscarListaDeTiposServicios();
    //Lista de tipos de pagos
    buscarListaDeTiposPagosServicios();
  }, [modulo]);
  //Buscar listado de mecanicos
  useEffect(() => {
    if (modulo === "operador" || modulo === "admin") buscarListaDeMecanicos();
    buscarListaDeCitas();
  }, [modulo]);

  const buscarListaDeServicios = () => {
    apiListadoServicios()
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setServicios(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //apiListaTiposPagos
  const buscarListaDeTiposPagosServicios = () => {
    apiListaTiposPagos()
      .then((response) => response.json())
      .then((data) => {
        setTipoPagos(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const buscarListaDeTiposServicios = () => {
    apiListaTiposServicios()
      .then((response) => response.json())
      .then((data) => {
        setTipoServicios(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const buscarListaDeMecanicos = () => {
    apiListaMecanicos()
      .then((response) => response.json())
      .then((data) => {
        setMecanicos(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const buscarListaDeCitas = () => {
    apiListaCitas()
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setCitas(data.data.reverse());
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Buscar listado de servicios del  mecanico
  useEffect(() => {
    if (modulo === "mecanico")
    buscarListaDeServiciosMecanicos();
    buscarListaDeCitasMecanicos();
  }, [modulo]);
  const buscarListaDeServiciosMecanicos = () => {
    apiListadoServiciosMecanico()
      .then((response) => response.json())
      .then((data) => {
        setServicios(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const buscarListaDeCitasMecanicos = () => {
    apiListaCitasMecanico()
      .then((response) => response.json())
      .then((data) => {
        setCitasMecanico(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //WebSocket
  const [mensaje, setMensaje] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [connected, setConnected] = useState(false);
  const [stomClient, setStomClient] = useState(null);
  const sendMessage = (message) => {
    console.log(modulo);
    if (stomClient) {
      stomClient.send("/app/chat", {}, JSON.stringify(message));
      setMensaje("");
    }
  };

  useEffect(() => {
    // Obtener el último mensaje de la lista de mensajes
    if (mensajes?.length > 0) {
      const ultimo = mensajes[mensajes?.length - 1];

      // Ejecutar la función actualizarListaServicio con el último mensaje

      switch (ultimo.metodo) {
        case "POST":
          guardarServicioLista(ultimo);
          break;
        case "PUT":
          actualizarServicioLista(ultimo);
          break;

        case "CITA":
          actualizarListaCita(ultimo);
          break;
        default:
          break;
      }
    }
  }, [mensajes]);

  const actualizarServicioLista = (mensaje) => {
    //Si el metodo es POST se guarda el servicio en la lista de servicios

    if (modulo == "mecanico" && mensaje.servicios.id == usuario.id) {
      setServicios((prevServicios) => {
        return prevServicios.map((servicio) => {
          // Si el servicio actual coincide con el ID del servicio a actualizar, devolvemos el servicio actualizado
          if (servicio?.id === mensaje?.servicios?.id) {
            return mensaje.servicios;
          }
          return servicio;
        });
      });
    } else {
      setServicios((prevServicios) => {
        return prevServicios.map((servicio) => {
          // Si el servicio actual coincide con el ID del servicio a actualizar, devolvemos el servicio actualizado
          if (servicio?.id === mensaje?.servicios?.id) {
            return mensaje.servicios;
          }
          return servicio;
        });
      });
    }
  };

  const guardarServicioLista = (mensaje) => {
    const servicioExistente = servicios.find(
      (servicio) => servicio.id === mensaje.servicios.id
    );
    if (!servicioExistente) {
      if (modulo === "mecanico" && mensaje.servicios.id === usuario.id) {
        setMecanicos((prevMecanicos) => [...prevMecanicos, mensaje.servicios]);
      } else {
        setServicios((prevServicios) => [...prevServicios, mensaje.servicios]);
      }
    }
  };

  const actualizarListaCita = (mensaje) => {
    if (modulo == "mecanico") {
    } else {
      buscarListaDeCitas();
    }
  };

  return (
    <UserContext.Provider
      value={{
        usuario,
        img,
        SetImg,
        citas,
        setCitas,
        citasMecanico,setCitasMecanico,
        buscarListaDeCitas,
        servicios,
        setServicios,
        tipoServicios,
        setTipoServicios,
        mecanicos,
        setMecanicos,
        setTipoPagos,
        tipoPagos,
        sendMessage,
        connected,
        setConnected,
      }}
    >
      {children}
      <WebSocketComponent
        setStomClient={setStomClient}
        setMensajes={setMensajes}
        sendMessage={sendMessage}
        setConnected={setConnected}
      />
    </UserContext.Provider>
  );
};
