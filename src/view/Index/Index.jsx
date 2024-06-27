import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  CardHeader,
  CardTitle,
  Container,
  Modal,
  CardFooter,
  CardImg,
  Placeholder,
  PlaceholderButton,
  Media,
} from "reactstrap";

import { Link } from "react-router-dom";
import moment from "moment"; // Importa Moment.js
import "../../assets/css/mensaje.css";
import {
  customTheme,
  customStyles,
} from "../../components/Datatable/DatatableCustom";
import { FaCheckSquare, FaMoneyBillAlt, FaPrint, FaWhatsapp } from "react-icons/fa";

import { useUserContext } from "../../components/Context/UserContext";
import DataTable from "react-data-table-component";


const Index = () => {
  const [downloading, setDownloading] = useState(false);


  const { publicidades, horario, corporativo } = useUserContext();


  const columnsUsuarios = [
    {
      name: "Fecha Hora",
      cell: (row) => (
        <div>
          <p className="text-xs">
            {moment(row?.fechaHora).format("DD-MMM-YYYY ")}
          </p>
          <p className="text-xs">
            {moment(row?.fechaHora).format("HH:mm:ss a")}
          </p>
        </div>
      ),

      selector: (row) => row?.precio1,
      sortable: true,
      wrap: true,
    },
    {
      name: "Turno",
      cell: (row) => row?.turno,
      selector: (row) => row?.turno,
      sortable: true,
      wrap: true,
    },
    // {
    //   name: "Cliente",
    //   cell: (row) => (row?.cliente?.length > 0 ? row?.cliente : "NN"),
    //   selector: (row) => row?.cliente,
    //   sortable: true,
    //   wrap: true,
    // },
    {
      name: "Pago 1",
      cell: (row) => row?.pago1,
      selector: (row) => row?.pago1,
      sortable: true,
      wrap: true,
    },
    {
      name: "Pago 2",
      cell: (row) => row?.pago2,
      selector: (row) => row?.pago2,
      sortable: true,
      wrap: true,
    },
    {
      name: "Precio1",
      cell: (row) =>
        row?.precio1?.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        }),
      selector: (row) => row?.precio1,
      sortable: true,
      wrap: true,
    },
    {
      name: "Precio2",
      cell: (row) =>
        row?.precio2?.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        }),
      selector: (row) => row?.precio2,
      sortable: true,
      wrap: true,
    },
    {
      name: "Mano de Obra",
      cell: (row) => row?.manoObra,
      selector: (row) => row?.manoObra,
      sortable: true,
      wrap: true,
    },

    {
      name: "Temporizador",
      cell: (row) => {
        const [tiempoTranscurrido, setTiempoTranscurrido] = useState("");

        const calcularCronometro = (servicio) => {
          /***** */
          const fecha = new Date(servicio?.fechaHora);
          const tiempoInicio = new Date(fecha.getTime() - 5 * 3600000);
          const ahora = new Date();
          const tiempoTranscurrido = Math.floor(
            (ahora.getTime() - tiempoInicio) / 1000
          );

          const horas = Math.floor(tiempoTranscurrido / 3600);
          const minutos = Math.floor((tiempoTranscurrido % 3600) / 60);
          const segundos = tiempoTranscurrido % 60;

          /***** */

          // Actualizamos el estado con el tiempo transcurrido formateado
          setTiempoTranscurrido(`${horas} : ${minutos} : ${segundos}`);
        };

        useEffect(() => {
          // Llamamos a calcularCronometro inicialmente
          calcularCronometro(row);

          // Establecemos un intervalo que llame a calcularCronometro cada segundo
          const intervalo = setInterval(() => {
            calcularCronometro(row);
          }, 1000);

          // Limpiamos el intervalo en el desmontaje del componente
          return () => clearInterval(intervalo);
        }, [row]); // La dependencia 'row' asegura que se inicie un nuevo intervalo cada vez que cambie 'row'

        return row?.listo !== "listo" ? (
          tiempoTranscurrido
        ) : (
          <div className=" text-dark">
            <p className="text-xs">
              {moment(row?.fechaHora).format("DD-MMM-YYYY ")}
            </p>
            <p className="text-xs">
              {moment(row?.fechaHora).format("hh:mm:ss a")}
            </p>
          </div>
        );
      },
      selector: (row) => row?.precio1,
      sortable: true,
      wrap: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className=" d-flex justify-content-center">
          <Button block size="sm" className="mt-1" title="Pagar" onClick={()=>abrirModal(row)}> <FaMoneyBillAlt className="text-success" /></Button>
          <Button block size="sm"className="mt-1" title="Diagnosticar"> <FaCheckSquare className="text-warning" /></Button>
          <Button block size="sm" className="mt-1" title="Imprimir" onClick={()=>imprimirServicio(row)}> <FaPrint className="text-danger" /></Button>
       

        
        </div>
      ),
      sortable: true,
      wrap: true,
    },
  ];

  //filtrar Membresia por nombre
  // const filtroUsuariosMembresias = servicios?.filter((servicio) =>
  //   servicio?.vehiculo
  //     .toLowerCase()
  //     .includes(filtroUsuarios?.toLowerCase())
  // );

   //Modal registrar entrenador
   const [modal, setModal] = useState(false);
   const toggle = () => {
     setModal(!modal);
   };
   const [servicioModal,setServicioModal]=useState({})
   const abrirModal=(servicio)=>{
    setServicioModal(servicio)
    toggle()
   }
   const imprimirServicio = async (fila) => {
    try {
        // Obtener el elemento iframe usando useRef
        const iframeRef = useRef(null);

        useEffect(() => {
            const imprimir = async () => {
                try {
                    const iframe = iframeRef.current;

                    // Convertir los valores de fila a números
                    const precio1 = parseFloat(fila.precio1);
                    const precio2 = parseFloat(fila.precio2);
                    const manobra = parseFloat(fila.manoObra);

                    // Calcular el precio total
                    let precio = precio1 + precio2 - manobra;
                    if (fila.pago1 === "Sin Pagar") {
                        precio = precio1 + precio2;
                    }

                    // Obtener la fecha y hora
                    const fechaCompleta = new Date(fila.fechaHora);
                    fechaCompleta.setDate(fechaCompleta.getDate() - 1);

                    // Configurar opciones de formato de fecha y hora
                    const opcionesFechaHora = {
                        timeZone: 'Europe/Madrid',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    };

                    // Formatear la fecha y hora
                    const fechaHoraFormateada = fechaCompleta.toLocaleString('es-ES', opcionesFechaHora);

                    // Construir la URL con los datos de fila
                    const url = new URL('/src/view/Index/pages/plantilla.html', window.location.href);
                    url.searchParams.append('fecha', fechaHoraFormateada);
                    url.searchParams.append('turno', fila.turno);
                    url.searchParams.append('vehiculo', fila.vehiculo);
                    url.searchParams.append('cantidad', fila.cantidad);
                    url.searchParams.append('precio', precio);
                    url.searchParams.append('chavetas', fila.chavetas);
                    url.searchParams.append('flauta', fila.flauta);
                    url.searchParams.append('manoObra', fila.manoObra);

                    // Cargar el contenido de la página "plantilla.html" en el iframe
                    iframe.src = url;

                    // Esperar a que el contenido se cargue completamente en el iframe
                    await new Promise(resolve => {
                        iframe.onload = resolve;
                    });

                    // Imprimir el contenido del iframe
                    iframe.contentWindow.print();
                } catch (error) {
                    console.error("Error al imprimir el ticket:", error);
                    alert("Hubo un error al imprimir el ticket. Por favor, revisa la consola para más detalles.");
                }
            };

            imprimir();
        }, [fila]);

        return (
            <iframe
                title="iframeTicket"
                id="iframeTicket"
                ref={iframeRef}
                style={{ display: 'none' }} // Ocultar el iframe
            />
        );
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};



  return (
    <>
      <Container>
        {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}
        <Row className="bg-white">
          <Col xl={12}>
            <DataTable
              theme={customTheme}
              customStyles={customStyles}
              columns={columnsUsuarios}
              data={servicios}
              striped
              pointerOnHover
              responsive
              sortDirection
              highlightOnHover
              search // Activa la búsqueda
              noDataComponent="No se encontraron registros para mostrar."
              pagination // Activa la paginación
              paginationComponentOptions={{
                rowsPerPageText: "Filas por página:",
                rangeSeparatorText: "de",
                selectAllRowsItem: true,
                selectAllRowsItemText: "Todos",
                selectAllRowsItemShow: true,
              }}
            />
          </Col>
        </Row>
        <ModalRegistrar toggle={toggle} modal={modal} servicio={servicioModal}/>
      </Container>
    </>
  );
};

export default Index;
