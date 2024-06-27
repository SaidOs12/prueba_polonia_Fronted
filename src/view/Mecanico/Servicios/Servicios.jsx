// reactstrap components
import React from "react";
import {
  Card,
  Container,
  Row,
  Col,
  CardBody,
  Button,
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
import { useState, useEffect } from "react";
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
import { FaCheckCircle, FaPlay, FaStop } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import ModalRegistrarManoObra from "./Components/ModalRegistrarManoObra";
import {
  apiFinalizarTemporizador,
  apiIniciarTemporizador,
  apiSaveServicios,
} from "../../../api/Servicios/Servicios";
import ModalRegistrarServicio from "./Components/ModalRegistrarServicio";
import WebSocketComponent from "../../../components/Websocket/WebSocketComponent";
import { apiLlamadaMecanico } from "../../../api/Servicios/Twilio/Twilio";
const Servicios = () => {
  const { servicios, tipoServicios, setServicios, sendMessage } =
    useUserContext();
  const filtroTiposServcios = tipoServicios?.filter(
    (tipo) => tipo?.mecanico === true
  );
  //Spinner
  const [loading, setLoading] = useState(false);
  //Filtro
  const [filtro, setFiltro] = useState("");
  //Activar spinner
  const [downloading, setDownloading] = useState(false);

  //Modal registrar servicios
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  //Modal registrar pago
  const [modalPago, setModalPago] = useState(false);
  const togglePago = () => {
    setModalPago(!modalPago);
  };

  const iniciarCronometro = (row) => {
    Swal.fire({
      title: "Iniciar Temporizador",
      text: "Vehiculo: " + row.vehiculo,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Iniciar Servicio",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setDownloading(true);
        apiIniciarTemporizador(row.id)
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
              Swal.fire({
                title: "Completado",
                text: "El servicio inicio",
                icon: "success",
              });
            }

            // setServicios((prevServicios) => {
            //   return prevServicios.map((servicio) => {
            //     // Si el servicio actual coincide con el ID del servicio a actualizar, devolvemos el servicio actualizado
            //     if (servicio.id === data.data.id) {
            //       return data.data;
            //     }
            //     // De lo contrario, devolvemos el servicio sin cambios
            //     return servicio;
            //   });
            // });
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
      }
    });
  };

  const finalizarCronometro = (row) => {
    Swal.fire({
      title: "Finalizar Temporizador",
      text: "Vehiculo: " + row.vehiculo,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Finalizar Servicio",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setDownloading(true);
        apiFinalizarTemporizador(row.id)
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
            // setServicios((prevServicios) => {
            //   return prevServicios.map((servicio) => {
            //     // Si el servicio actual coincide con el ID del servicio a actualizar, devolvemos el servicio actualizado
            //     if (servicio.id === data.data.id) {
            //       return data.data;
            //     }
            //     // De lo contrario, devolvemos el servicio sin cambios
            //     return servicio;
            //   });
            // });
            Swal.fire({
              title: "Completado",
              text: "El servicio se finalizo",
              icon: "success",
            });
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
      }
    });
  };

  const columnsUsuarios = [
    // {
    //   name: "Fecha Hora",
    //   cell: (row) => (
    //     <div className="mt-1">
    //       <small className="text-sm">
    //         {moment(row?.fechaRegistro).format("DD-MMM-YYYY ")}
    //       </small>
    //       <p className="text-sm">
    //         {moment(row?.fechaRegistro).format("hh:mm:ss a")}
    //       </p>
    //     </div>
    //   ),

    //   selector: (row) => row?.precio,
    //   sortable: true,
    //   wrap: true,
    // },
    {
      name: "Turno ",
      cell: (row) => row?.turno+" - "+row?.cliente?.nombre,
      selector: (row) => row?.turno,
      sortable: true,
      wrap: true,
    },
    {
      name: "Servicio",
      cell: (row) => row?.tipoServicio?.nombre,
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
      name: "Tiempo",
      cell: (row) => {
        if (row?.fechaInicio === null) {
          //llamadaMecanicoAceptarServicio(row);
          return (
            <div className=" text-dark">
              <p className="text-xs">-</p>
            </div>
          );
        }

        if (
          row?.listo !== "listo" &&
          row?.fechaInicio !== null &&
          row.fechaFin === null
        ) {
          const [tiempoTranscurrido, setTiempoTranscurrido] = useState("");

          const calcularCronometro = (servicio) => {
            /***** */
            const fecha = new Date(servicio?.fechaInicio);
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
            setTiempoTranscurrido(`${horas}h : ${minutos}m : ${segundos}s`);
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
            <div className=" text-dark">
              {tiempoTranscurrido?.split(":")[0] > 2 ? (
                <p className="text-danger ">{tiempoTranscurrido}</p>
              ) : (
                <p className="text-dark ">{tiempoTranscurrido}</p>
              )}
            </div>
          );
        }
        return (
          <div className=" text-dark">
            <p className="text-sm">{calcularDiferenciaFechas(row)}</p>
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
          {row?.fechaInicio === null ? (
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
            row?.fechaFin === null && (
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
          )}

          {row?.entregado && (
            <p className="d-flex">
              <FaCheckCircle className="text-success mb-0" />
            </p>
          )}

          {row?.fechaFin === null && (
            <Button
              block
              size="sm"
              className="mt-1"
              title="Sub Servicio"
              onClick={() => abrirModal(row)}
            >
              {" "}
              <GrConfigure className="text-primary" />
            </Button>
          )}
        </div>
      ),
      sortable: true,
      wrap: true,
    },
  ];



  const calcularDiferenciaFechas = (servicio) => {
    const fecha = new Date(servicio?.fechaInicio);
    const tiempoInicio = new Date(fecha.getTime() - 5 * 3600000);
    const ahora = new Date(servicio?.fechaFin);
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



  //filtrar servicios no entregados
  const filtroServicioNoEntregados = servicios
    ?.filter((servicio) => !servicio?.entregado && servicio?.fechaFin === null)
    .reverse();
  //filtrar servicios  entregados
  const filtroServicioEntregados = servicios
    ?.filter((servicio) => servicio?.fechaFin !== null)
    .reverse();

  const toggleNavs = (index) => {
    setTabs(index);
  };

  const [servicioModal, setServicioModal] = useState({});
  const abrirModal = (servicio) => {
    setServicioModal(servicio);
    togglePago();
  };

  const [state, setState] = useState(false);
  const handleCheckboxChange = (event) => {
    setState(event.target.checked);
  };

  const [tabs, setTabs] = useState(1);

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
                        className={classnames("mb-sm-3 mb-md-0 font-", {
                          "bg-dark h3 text-white": tabs === 1,
                        })}
                        onClick={() => toggleNavs(1)}
                        role="tab"
                      >
                        <i className="ni ni-cloud-upload-96 mr-2" />
                        Servicios Activos
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
                        Servicios Por Listos
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
                        {loading ? (
                          <SpinnerGrupo />
                        ) : (
                          <>
                            <DataTable
                              theme={customTheme}
                              customStyles={customStyles}
                              columns={columnsUsuarios}
                              data={filtroServicioNoEntregados}
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
                          </>
                        )}
                      </TabPane>
                      <TabPane tabId="tabs2">
                        {loading ? (
                          <SpinnerGrupo />
                        ) : (
                          <>
                            <DataTable
                              theme={customTheme}
                              customStyles={customStyles}
                              columns={columnsUsuarios}
                              data={filtroServicioEntregados}
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
                          </>
                        )}
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
        filtroTiposServcios={filtroTiposServcios}
        setDownloading={setDownloading}
      />
      {/**Modal registrar pago*/}
      <ModalRegistrarManoObra
        toggleRegistrarManoObra={togglePago}
        modalRegistrarManoObra={modalPago}
        servicio={servicioModal}
        setDownloading={setDownloading}
      />
    </>
  );
};

export default Servicios;
