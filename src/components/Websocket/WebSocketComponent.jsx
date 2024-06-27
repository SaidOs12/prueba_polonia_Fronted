import React, { useState, useEffect } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { urlBackend } from "../../api/urlBackend";
const WebSocketComponent = ({setMensajes,setStomClient,sendMessage,setConnected,connected}) => {
  //const [socket, setSocket] = useState(null);


  useEffect(() => {
    const socket = new SockJS(urlBackend+"ws");
    const client = Stomp.over(socket);
    // Deshabilitar el registro de mensajes
    client.debug = null; 
    client.connect({}, () => {
      
      client.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMensajes((prevMessages) => [...prevMessages, receivedMessage]);
        
      });
      // Guardar el cliente Stomp en el estado

      setStomClient(client);
      setConnected(true)

     

      
      // Definir el método sendMessage en el alcance del componente
      window.sendMessage = sendMessage;
    });

    return () => {
      if (client.connected) {
        client.disconnect();
        setConnected(false)
      }
    };
  }, []);

 


  return (
    null
  );
};

export default WebSocketComponent;