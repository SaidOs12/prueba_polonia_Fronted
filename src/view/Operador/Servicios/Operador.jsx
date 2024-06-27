// reactstrap components
import React from "react";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input,
  Modal,
  CardFooter,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
// core components
import classnames from "classnames";
import Header from "../../../components/Headers/Header";
import DataTable from "react-data-table-component";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  customTheme,
  customStyles,
} from "../../../components/Datatable/DatatableCustom";
import "../../../assets/css/spinner.css";
import Swal from "sweetalert2";

import SpinnerGrupo from "../../../components/Sppiner";
import { useUserContext } from "../../../components/Context/UserContext";

import moment from "moment"; // Importa Moment.js
import {
  FaCar,
  FaCheckCircle,
  FaCheckSquare,
  FaMoneyBill,
  FaPlay,
  FaPrint,
  FaStop,
} from "react-icons/fa";
import ModalRegistrarPago from "../Components/ModalRegistrarPago";
import {
  apiEntregarServicio,
  apiOperadorFinalizarTemporizador,
  apiOperadorIniciarTemporizador,
} from "../../../api/Servicios/Servicios";
import ModalDiagnostico from "../Components/ModalDiagnostico";
import PrintComponent from "../Components/PrintComponent";
import ModalRegistrarServicio from "../Components/ModalRegistrarServicio";
import { apiLlamadaMecanico } from "../../../api/Servicios/Twilio/Twilio";
const Operador = () => {
  //Trae la lista de servicios
  const { servicios, tipoServicios, sendMessage, mecanicos } = useUserContext();

  //Activar spinner
  const [downloading, setDownloading] = useState(false);

  // Función para manejar el cambio en el tipo de servicio
  useEffect(() => {}, [servicios]);

  //Modal registrar servicios
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setDetalles(false);
    setModal(!modal);
    //resetServicioNuevo();
  };

  //Modal registrar pago
  const [modalPago, setModalPago] = useState(false);
  const togglePago = () => {
    setModalPago(!modalPago);
  };
  //Modal registrar Diagnostico
  const [modalDiagnostico, setModalDiagnostico] = useState(false);
  const toggleDiagnostico = () => {
    setModalDiagnostico(!modalDiagnostico);
  };

  //Modal registrar servicios
  const [modalNotificacion, setModalNotificacion] = useState(false);
  const toggleNotificacion = () => {
    setModalNotificacion(!modalNotificacion);
    //resetServicioNuevo();
  };

  const buscarMecanico = (id) => {
    const mecanico = mecanicos?.find(
      (mecanico) => mecanico.usuario.id === Number(id)
    );
    
    return mecanico?.usuario?.nombre;
  };

  const columnsServiciosActivos = [
    {
      name: "Fecha ",
      cell: (row) => (
        <div className="mt-1">
          <small className="text-sm">
            {moment(row?.fechaRegistro).format("DD-MMM-YYYY ")}
          </small>
          <p className="text-sm">
            {moment(row?.fechaRegistro).format("hh:mm:ss a")}
          </p>
        </div>
      ),

      selector: (row) => row?.precio,
      sortable: true,
      wrap: true,
    },
    {
      name: "Turno",
      cell: (row) => (
        <p>
          {row?.turno}
          {row?.cliente?.nombre != undefined ? "- " + row.cliente.nombre : ""}
        </p>
      ),

      selector: (row) => row?.turno,
      sortable: true,
      wrap: true,
    },
    {
      name: "Servicio",
      cell: (row) => (
        <>
          {row?.tipoServicio?.id === 1 ? (
            <>
              {row?.manoObra === null ? (
                <p title="LIMPIEZA DE INYECTORES">
                  <img
                    alt="..."
                    src={"/icon/" + row.tipoServicio.id + ".png"}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />{" "}
          
                </p>
              ) : (
                <p title="LIMPIEZA DE INYECTORES CON DESMONTADA">
                  <img
                    alt="..."
                    src={"/icon/1-4.png"}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />{" "}
                  {buscarMecanico(row?.mecanico)}
                </p>
              )}
            </>
          ) : row?.tipoServicio?.id === 2 ? (
            <p>
              <img
                title="SINCRONIZACIÓN"
                alt="..."
                src={"/icon/" + row.tipoServicio.id + ".png"}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />{" "}
              {buscarMecanico(row?.mecanico)}
            </p>
          ) : (
            <p>
              <img
                title="MANO DE OBRA"
                alt="..."
                src={"/icon/" + row.tipoServicio.id + ".png"}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />{" "}
              {buscarMecanico(row?.mecanico)}
            </p>
          )}
        </>
      ),
      selector: (row) => row?.tipoServicio?.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Vehiculo",
      cell: (row) => (row?.vehiculo?.length > 0 ? row?.vehiculo : "NN"),
      selector: (row) => row?.vehiculo,
      sortable: true,
      wrap: true,
    },

    {
      name: "Tiempo ",
      cell: (row) => {
        if (row?.operadorFechaInicio === null) {
          return (
            <div className=" text-dark">
              <p className="text-xs">- : - : -</p>
            </div>
          );
        }

        if (
          row?.listo !== "listo" &&
          row?.operadorFechaInicio !== null &&
          row.operadorFechaFin === null
        ) {
          const [tiempoTranscurrido, setTiempoTranscurrido] = useState("");

          const calcularCronometro = (servicio) => {
            /***** */
            const fecha = new Date(servicio?.operadorFechaInicio);
            const tiempoInicio = new Date(fecha.getTime() - 5 * 3600000);
            const ahora = new Date();
            const tiempoTranscurrido = Math.floor(
              (ahora.getTime() - tiempoInicio) / 1000
            );

            const horas = Math.floor(tiempoTranscurrido / 3600) - 5;
            const minutos = Math.floor((tiempoTranscurrido % 3600) / 60);
            const segundos = tiempoTranscurrido % 60;
            if (horas === 1 && segundos === 1) {
              mostrarNotificacion(row);
            }
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

          return (
            <div className=" ">
              {tiempoTranscurrido?.split(":")[1] < 3 ? (
                <p className="text-dark ">{tiempoTranscurrido}</p>
              ) : tiempoTranscurrido?.split(":")[1] > 5 &&
                tiempoTranscurrido?.split(":")[1] < 5 ? (
                <p className="text-yellow ">{tiempoTranscurrido}</p>
              ) : (
                <p className="text-danger ">{tiempoTranscurrido}</p>
              )}
            </div>
          );
        }

        return (
          <div className=" text-dark">
            <p className="text-sm mt-1">{calcularDiferenciaFechas(row)}</p>
          </div>
        );
      },
      selector: (row) => row?.precio,
      sortable: true,
      wrap: true,
    },

    {
      name: "Acciones",
      cell: (row) => (
        <div className=" d-flex justify-content-center">
          {/* {row?.operadorFechaInicio === null && row?.tipoServicio?.id == 1 ? (
            <Button
              block
              size="sm"
              onClick={() => iniciarCronometro(row)}
              className="mt-1"
              title="Iniciar temporizador"
            >
              {" "}
              <FaPlay className="text-success" />
            </Button>
          ) : (
            row?.operadorFechaFin === null &&
            row?.tipoServicio?.id == 1 && (
              <Button
                block
                size="sm"
                onClick={() => finalizarCronometro(row)}
                className="mt-1"
                title="Finalizar temporizador"
              >
                {" "}
                <FaStop className="text-danger" />
              </Button>
            )
          )} */}

          {row?.pago != true && (
            <Button
              block
              size="sm"
              className="mt-1"
              title="Pagar"
              onClick={() => abrirModal(row)}
            >
              {" "}
              <FaMoneyBill className="text-success text-lg" />
            </Button>
          )}
          {row?.diagnostico?.id == null && (
            <Button
              block
              size="sm"
              onClick={() => abrirModalDiagnositco(row)}
              className="mt-1"
              title="Diagnostico"
            >
              {" "}
              <FaCheckSquare className="text-warning text-lg" />
            </Button>
          )}
          {row?.diagnostico?.id != null && (
            <Button
              block
              size="sm"
              onClick={() => abrirModalDiagnositco(row)}
              className="mt-1"
              title="Diagnostico"
            >
              {" "}
              <FaCheckSquare className="text-warning text-lg" />
            </Button>
          )}

          {!row?.entregado &&
            row?.pago == true &&
            row?.diagnostico?.id != null && (
              <Button
                block
                size="sm"
                onClick={() => entregarServicioCliente(row)}
                className="mt-1"
                title="Entregado"
              >
                {" "}
                <FaCar className="text-red text-lg" />
              </Button>
            )}
          {row?.entregado && (
            <p className="d-flex">
              Servicio Entregado <FaCheckCircle className="text-success mb-0" />
            </p>
          )}
          {row?.diagnostico?.id != null && (
            <Button
              block
              size="sm"
              className="mt-1"
              title="Imprimir"
              onClick={() => toggleFactura(row)}
            >
              {" "}
              <FaPrint className="text-yellow" />
            </Button>
          )}
        </div>
      ),
      sortable: true,
      wrap: true,
    },
  ];
  const columnsServiciosPorEntregar = [
    {
      name: "Fecha ",
      cell: (row) => (
        <div className="mt-1">
          <small className="text-sm">
            {moment(row?.fechaRegistro).format("DD-MMM-YYYY ")}
          </small>
          <p className="text-sm">
            {moment(row?.fechaRegistro).format("hh:mm:ss a")}
          </p>
        </div>
      ),

      selector: (row) => row?.precio,
      sortable: true,
      wrap: true,
    },
    {
      name: "Turno",
      cell: (row) => (
        <p>
          {row?.turno}
          {row?.cliente?.nombre != undefined ? "- " + row.cliente.nombre : ""}
        </p>
      ),

      selector: (row) => row?.turno,
      sortable: true,
      wrap: true,
    },
    {
      name: "Servicio",
      cell: (row) => (
        <>
          {row?.tipoServicio?.id === 1 ? (
            <>
              {row?.manoObra == null ? (
                <p title="LIMPIEZA DE INYECTORES">
                  <img
                    alt="..."
                    src={"/icon/" + row.tipoServicio.id + ".png"}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />{" "}
                  {row?.mecanico?.nombre}
                </p>
              ) : (
                <p title="LIMPIEZA DE INYECTORES CON DESMONTADA">
                  <img
                    alt="..."
                    src={"/icon/1-4.png"}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />{" "}
                  {row?.mecanico?.nombre}
                </p>
              )}
            </>
          ) : row?.tipoServicio?.id === 2 ? (
            <p>
              <img
                title="SINCRONIZACIÓN"
                alt="..."
                src={"/icon/" + row.tipoServicio.id + ".png"}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />{" "}
              {row?.mecanico?.nombre}
            </p>
          ) : (
            <p>
              <img
                title="MANO DE OBRA"
                alt="..."
                src={"/icon/" + row.tipoServicio.id + ".png"}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />{" "}
              {row?.mecanico?.nombre}
            </p>
          )}
        </>
      ),
      selector: (row) => row?.tipoServicio?.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Vehiculo",
      cell: (row) => (row?.vehiculo?.length > 0 ? row?.vehiculo : "NN"),
      selector: (row) => row?.vehiculo,
      sortable: true,
      wrap: true,
    },

    {
      name: "Tiempo ",
      cell: (row) => {
        if (row?.operadorFechaInicio === null) {
          return (
            <div className=" text-dark">
              <p className="text-xs">- : - : -</p>
            </div>
          );
        }

        if (
          row?.listo !== "listo" &&
          row?.operadorFechaInicio !== null &&
          row.operadorFechaFin === null
        ) {
          const [tiempoTranscurrido, setTiempoTranscurrido] = useState("");

          const calcularCronometro = (servicio) => {
            /***** */
            const fecha = new Date(servicio?.operadorFechaInicio);
            const tiempoInicio = new Date(fecha.getTime() - 5 * 3600000);
            const ahora = new Date();
            const tiempoTranscurrido = Math.floor(
              (ahora.getTime() - tiempoInicio) / 1000
            );

            const horas = Math.floor(tiempoTranscurrido / 3600) - 5;
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

          return (
            <div className=" ">
              {tiempoTranscurrido?.split(":")[1] < 3 ? (
                <p className="text-dark ">{tiempoTranscurrido}</p>
              ) : tiempoTranscurrido?.split(":")[1] > 5 &&
                tiempoTranscurrido?.split(":")[1] < 5 ? (
                <p className="text-yellow ">{tiempoTranscurrido}</p>
              ) : (
                <p className="text-danger ">{tiempoTranscurrido}</p>
              )}
            </div>
          );
        }

        return (
          <div className=" text-dark">
            <p className="text-sm mt-1">{calcularDiferenciaFechas(row)}</p>
          </div>
        );
      },
      selector: (row) => row?.precio,
      sortable: true,
      wrap: true,
    },

    {
      name: "Acciones",
      cell: (row) => (
        <div className=" d-flex justify-content-center">
          {/* {row?.operadorFechaInicio === null && row?.tipoServicio?.id == 1 ? (
            <Button
              block
              size="sm"
              onClick={() => iniciarCronometro(row)}
              className="mt-1"
              title="Iniciar temporizador"
            >
              {" "}
              <FaPlay className="text-success" />
            </Button>
          ) : (
            row?.operadorFechaFin === null &&
            row?.tipoServicio?.id == 1 && (
              <Button
                block
                size="sm"
                onClick={() => finalizarCronometro(row)}
                className="mt-1"
                title="Finalizar temporizador"
              >
                {" "}
                <FaStop className="text-danger" />
              </Button>
            )
          )} */}
          {row?.pago != true && (
            <Button
              block
              size="sm"
              className="mt-1"
              title="Pagar"
              onClick={() => abrirModal(row)}
            >
              {" "}
              <FaMoneyBill className="text-success text-lg" />
            </Button>
          )}
          {row?.diagnostico?.id == null && (
            <Button
              block
              size="sm"
              onClick={() => abrirModalDiagnositco(row)}
              className="mt-1"
              title="Diagnostico"
            >
              {" "}
              <FaCheckSquare className="text-warning text-lg" />
            </Button>
          )}
          {row?.diagnostico?.id != null && (
            <Button
              block
              size="sm"
              onClick={() => abrirModalDiagnositco(row)}
              className="mt-1"
              title="Diagnostico"
            >
              {" "}
              <FaCheckSquare className="text-warning text-lg" />
            </Button>
          )}

          {!row?.entregado &&
            row?.pago == true &&
            row?.diagnostico?.id != null && (
              <Button
                block
                size="sm"
                onClick={() => entregarServicioCliente(row)}
                className="mt-1"
                title="Entregado"
              >
                {" "}
                <FaCar className="text-red text-lg" />
              </Button>
            )}

          {row?.diagnostico?.id != null && (
            <Button
              block
              size="sm"
              className="mt-1"
              title="Imprimir"
              onClick={() => toggleFactura(row)}
            >
              {" "}
              <FaPrint className="text-yellow" />
            </Button>
          )}
        </div>
      ),
      sortable: true,
      wrap: true,
    },
  ];

  const mostrarNotificacion = (row) => {
    speakText("TURNO "+row?.turno+"")
    speakText("TURNO "+row?.turno+"")
    Swal.fire({
      title: "SERVICIO RETRASADO",
      icon: "warning",
      text: "Vehiculo" + row?.vehiculo,
      confirmButtonText: "OK",
      cancelButtonText: "Salir",
      showCancelButton: true,
      showCloseButton: true,
    });
    if (row?.operador !== null)
      apiLlamadaMecanico(row?.operador)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
        });
  };
  const speakText = (text) => {
    console.log("--->")
    if ('speechSynthesis' in window) {
      console.log("---lllll")
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('Sorry, your browser does not support text to speech!');
    }
  };

  const autoInciarCronometro = (row) => {
    setDownloading(true);
    apiOperadorIniciarTemporizador(row.id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          //actualizo el servicio en la lista servicios
          const nuevoMensaje = {
            text: "Servicio inicio cronometro",
            servicios: data.data,
            metodo: "PUT",
          };
          sendMessage(nuevoMensaje);
        } else {
          Swal.fire({
            title: "Informacion",
            text: data.msg,
            icon: "warning",
          });
        }
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          title: "Error",
          text: e,
          icon: "error",
        });
      })
      .finally((f) => {
        setDownloading(false);
      });
  };

  const autoFinalizarCronometro = (row) => {
    apiOperadorFinalizarTemporizador(row.id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //actualizo el servicio en la lista servicios
        const nuevoMensaje = {
          text: "Servicio finalizo cronometro",
          servicios: data.data,
          metodo: "PUT",
        };
        sendMessage(nuevoMensaje);
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          title: "Error",
          text: e,
          icon: "success",
        });
      })
      .finally((f) => {
        setDownloading(false);
      });
  };
  const calcularDiferenciaFechas = (servicio) => {
    const fecha = new Date(servicio?.operadorFechaInicio);
    const tiempoInicio = new Date(fecha.getTime() - 5 * 3600000);
    const ahora = new Date(servicio?.operadorFechaFin);
    const tiempoTranscurrido = Math.floor(
      (ahora.getTime() - tiempoInicio) / 1000
    );

    const horas = Math.floor(tiempoTranscurrido / 3600) - 5;
    const minutos = Math.floor((tiempoTranscurrido % 3600) / 60);
    const segundos = tiempoTranscurrido % 60;

    /***** */

    // Actualizamos el estado con el tiempo transcurrido formateado
    return `${horas}h : ${minutos}m : ${segundos}s`;
  };

  const [modalFactura, setModalFactura] = useState(false);
  const toggleFactura = (servicio) => {
    console.log(servicio);
    setServicioModal(servicio);
    setModalFactura(!modalFactura);
  };

  const entregarServicioCliente = (row) => {
    Swal.fire({
      title: "Entregar servicio?",
      text: "Vehiculo: " + row.vehiculo,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Entregar Servicio",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setDownloading(true);
        apiEntregarServicio(row.id)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.success) {
              const nuevoMensaje = {
                text: "se entrego el servicio",
                servicios: data.data,
                metodo: "PUT",
              };
              sendMessage(nuevoMensaje);
              Swal.fire({
                title: "Completado!",
                text: "Servicio Entregado",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: data.msg,
                icon: "error",
              });
            }
          })
          .catch((e) => {
            console.log(e);
            Swal.fire({
              title: "Error!",
              text: "Error en el servidor",
              icon: "error",
            });
          })
          .finally((f) => {
            setDownloading(false);
          });
      }
    });
  };

  //filtrar Servicios por fecha
  const filtroServicioActivos = servicios
    ?.filter((servicio) => servicio?.servicioListo === false)
    .reverse();

  //filtrar Servicios por fecha
  const filtroServiciosTerminados = servicios
    ?.filter((servicio) => servicio?.servicioListo && !servicio?.entregado)
    .reverse();

  const toggleNavs = (index) => {
    setTabs(index);
  };
  const [tabs, setTabs] = useState(1);

  const [servicioModal, setServicioModal] = useState([]);
  const abrirModal = (servicio) => {
    setServicioModal(servicio);
    togglePago();
  };
  const abrirModalDiagnositco = (servicio) => {
    console.log(servicio);
    setServicioModal(servicio);
    toggleDiagnostico();
  };
  const [detalles, setDetalles] = useState(false);
  const [detallesManoObra, setDetallesManoObra] = useState(false);
  const [state, setState] = useState(false);
  const handleCheckboxChange = (event) => {
    setState(event.target.checked);
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Contenido */}
        {/* {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )} */}
        {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}

        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardBody>
                <div className="nav-wrapper">
                  <Nav
                    className="nav-fill flex-column flex-md-row"
                    id="tabs-icons-text"
                    pills
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        aria-selected={tabs === 1}
                        className={classnames("mb-sm-3   mb-md-0 font-", {
                          "bg-dark h3 text-white": tabs === 1,
                        })}
                        onClick={() => toggleNavs(1)}
                        role="tab"
                      >
                        <i className="ni ni-cloud-upload-96 mr-2" />
                        Activos: # {filtroServicioActivos?.length}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        aria-selected={tabs === 2}
                        className={classnames("mb-sm-3 mb-md-0", {
                          "bg-dark h3 text-white": tabs === 2,
                        })}
                        onClick={() => toggleNavs(2)}
                        role="tab"
                      >
                        <i className="ni ni-bell-55 mr-2" />
                        Por Entregar: # {filtroServiciosTerminados?.length}
                      </NavLink>
                    </NavItem>
                    {/* <NavItem>
                      <NavLink
                        aria-selected={tabs === 3}
                        className={classnames("mb-sm-3 mb-md-0", {
                          active: tabs === 3,
                        })}
                        onClick={() => toggleNavs(3)}
                        href="#Otro"
                        role="tab"
                      >
                        <i className="ni ni-calendar-grid-58 mr-2" />
                        Messages
                      </NavLink>
                    </NavItem> */}
                  </Nav>
                </div>
                <Card className="shadow">
                  <CardBody>
                    <TabContent activeTab={"tabs" + tabs}>
                      <TabPane tabId="tabs1">
                        <Row className="align-items-center p-1 mb-2">
                          <div className="col">
                            {/* <h3 className="mb-0">SERVICIOS ACTIVOS</h3> */}
                          </div>
                          <div className="col text-right">
                            <Link title="Registrar">
                              <Button
                                color="dark"
                                type="submit"
                                onClick={toggle}
                              >
                                <i className="fa fa-plus" />
                              </Button>
                            </Link>
                          </div>
                        </Row>
                        {/* <FormGroup
                          row
                          className="justify-content-center mr-2 mt-3"
                        >
                          <Label for="filtro" sm={3} className="text-center">
                            Buscar por Fecha:
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="date"
                              placeholder="Fecha"
                              value={filtro}
                              onChange={(e) => setFiltro(e.target.value)}
                            />
                          </Col>
                        </FormGroup> */}
                        {/* <hr /> */}
                        <DataTable
                          theme={customTheme}
                          customStyles={customStyles}
                          columns={columnsServiciosActivos}
                          data={filtroServicioActivos}
                          striped
                          pointerOnHover
                          responsive
                          sortDirection
                          highlightOnHover
                          search // Activa la búsqueda
                          noDataComponent="No se encontraron registros para mostrar."
                          pagination // Activa la paginación
                          paginationPerPage={20}
                          paginationComponentOptions={{
                            rowsPerPageText: "Filas por página:",
                            rangeSeparatorText: "de",
                            selectAllRowsItem: true,
                            selectAllRowsItemText: "Todos",
                            selectAllRowsItemShow: true,
                          }}
                        />
                      </TabPane>
                      <TabPane tabId="tabs2">
                      
                        <hr />
                        <DataTable
                          theme={customTheme}
                          customStyles={customStyles}
                          columns={columnsServiciosPorEntregar}
                          data={filtroServiciosTerminados}
                          striped
                          pointerOnHover
                          responsive
                          sortDirection
                          highlightOnHover
                          search // Activa la búsqueda
                          noDataComponent="No se encontraron registros para mostrar."
                          pagination // Activa la paginación
                          paginationPerPage={20}
                          paginationComponentOptions={{
                            rowsPerPageText: "Filas por página:",
                            rangeSeparatorText: "de",
                            selectAllRowsItem: true,
                            selectAllRowsItemText: "Todos",
                            selectAllRowsItemShow: true,
                          }}
                        />
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Modal registrar Servicios */}
      <ModalRegistrarServicio
        toggle={toggle}
        modal={modal}
        setDownloading={setDownloading}
        detalles={detalles}
        setDetalles={setDetalles}
        detallesManoObra={detallesManoObra}
        setDetallesManoObra={setDetallesManoObra}
        tipoServicios={tipoServicios}
        sendMessage={sendMessage}
        mecanicos={mecanicos}
        toggleFactura={toggleFactura}
        iniciarCronometro={autoInciarCronometro}
      />

      {/* Modal Imprimir factura Servicios */}
      <Modal
        className="modal-dialog-centered"
        isOpen={modalFactura}
        toggle={toggleFactura}
      >
        <div className="modal-body p-0">
          <Card className="bg-white shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              ></div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggleFactura}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <CardBody>
              <PrintComponent servicio={servicioModal} />
            </CardBody>
          </Card>
        </div>
      </Modal>

      {/**Modal registrar pago*/}
      <ModalRegistrarPago
        toggleRegistrarPago={togglePago}
        modalRegistrarPago={modalPago}
        servicio={servicioModal}
        setDownloading={setDownloading}
      />

      {/* Modal Registrar Diagnositco */}
      <ModalDiagnostico
        modalRegistrarDiagnostico={modalDiagnostico}
        toggleRegistrarDiagnostico={toggleDiagnostico}
        servicio={servicioModal}
        setDownloading={setDownloading}
        autoFinalizarCronometro={autoFinalizarCronometro}
      />
    </>
  );
};

export default Operador;
