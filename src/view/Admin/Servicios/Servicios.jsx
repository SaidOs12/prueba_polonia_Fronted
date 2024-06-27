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
import ModalRegistrar from "./Components/ModalRegistrarPago";
import {
  FaCar,
  FaCheckCircle,
  FaCheckSquare,
  FaMoneyBill,
  FaMoneyBillAlt,
  FaPrint,
  FaWhatsapp,
} from "react-icons/fa";
import ModalRegistrarPago from "./Components/ModalRegistrarPago";
import ModalRegistrarServicio from "./Components/ModalRegistrarServicio";
import PrintComponent from "../../Operador/Components/PrintComponent";
import ModalDiagnostico from "../../Operador/Components/ModalDiagnostico";
import { apiEntregarServicio } from "../../../api/Servicios/Servicios";
const Servicios = () => {
  const { servicios, tipoServicios,mecanicos,sendMessage } = useUserContext();
  //Spinner
  const [loading, setLoading] = useState(false);
  //Spinner
  const [loading2, setLoading2] = useState(false);
  //Filtro Usuariosmembresia
  const [filtroUsuarios, setFiltroUsuarios] = useState("");
  //Activar spinner
  const [downloading, setDownloading] = useState(false);
  const [detalles, setDetalles] = useState(false);
  const [detallesManoObra, setDetallesManoObra] = useState(false);
  const [state, setState] = useState(false);
  const handleCheckboxChange = (event) => {
    setState(event.target.checked);
  };
  const [modalFactura, setModalFactura] = useState(false);
  const toggleFactura = (servicio) => {
    
    setServicioModal(servicio);
    setModalFactura(!modalFactura);
  };
  //Modal registrar servicios
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setDetalles(false);
    setModal(!modal);
  };
  //Modal registrar pago
  const [modalPago, setModalPago] = useState(false);
  const togglePago = () => {
    setModalPago(!modalPago);
  };

  //Modal editar entrenador
  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleUpdate = () => {
    setModalUpdate(!modalUpdate);
  };
   //Modal registrar Diagnostico
   const [modalDiagnostico, setModalDiagnostico] = useState(false);
   const toggleDiagnostico = () => {
     setModalDiagnostico(!modalDiagnostico);
   };

  const columnsUsuarios = [
    {
      name: "Fecha Hora",
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
      name: "Tiempo M",
      cell: (row) => {
        if (row?.fechaInicio === null) {
          return (
            <div className=" text-dark">
              <p className="text-xs">- : - : -</p>
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
          {row?.entregado && (
            <Button block size="sm" className="mt-1" title="Entregado">
              <FaCheckCircle className="text-success mb-0" />
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


  //filtrar Membresia por nombre
  const filtroServiciosActivos = servicios
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

  const [servicioModal, setServicioModal] = useState({});
  const abrirModal = (servicio) => {
    console.log(servicio);
    setServicioModal(servicio);
    togglePago();
  };
  const abrirModalDiagnositco = (servicio) => {
    console.log(servicio);
    setServicioModal(servicio);
     toggleDiagnostico();
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Contenido */}
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
                        className={classnames("mb-sm-3 mb-md-0", {
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
                        Servicios Por Entregar
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
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">LISTA DE SERVICIOS</h3>
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
                            Filtro Tipo de Servicio:
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="date"
                              placeholder="Fecha"
                              value={filtro}
                              onChange={(e) => setFiltro(e.target.value)}
                            />
                            <FormGroup className="text-dark">
                              
                              <Input
                                id="tipoServicio"
                                className="form-control"
                                name="tipoServicio"
                                type="select"
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                required
                              >
                                <option value="">
                                  Seleccione un tipo de servicio
                                </option>
                                {tipoServicios?.map((tipoServicio) => (
                                  <option
                                    className="text-lg text-dark"
                                    key={tipoServicio.id}
                                    value={tipoServicio.id}
                                  >
                                    {tipoServicio.nombre}
                                  </option>
                                ))}
                              </Input>
                            </FormGroup>
                          </Col>
                        </FormGroup> */}
                        {loading ? (
                          <SpinnerGrupo />
                        ) : (
                          <Row className="mt-3">
                            <DataTable
                              theme={customTheme}
                              customStyles={customStyles}
                              columns={columnsUsuarios}
                              data={filtroServiciosActivos}
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
                          </Row>
                        )}
                      </TabPane>
                      <TabPane tabId="tabs2">
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">
                              LISTA DE SERVICIOS POR ENTREGAR
                            </h3>
                          </div>
                          <div className="col text-right">
                            {/* <Link title="Registrar">
                              <Button
                                color="primary"
                                type="submit"
                                onClick={toggleInforme}
                              >
                                <i className="fa fa-download fa-1x" /> INFORME
                              </Button>
                            </Link> */}
                          </div>
                        </Row>
                    
                        {loading2 ? (
                          <SpinnerGrupo />
                        ) : (
                          <Row className="mt-3">
                            <DataTable
                              theme={customTheme}
                              customStyles={customStyles}
                              columns={columnsUsuarios}
                              data={filtroServiciosTerminados}
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
                          </Row>
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
                        {/* Modal actulizar Servicios */}
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
      />

      {/**Modal registrar pago*/}
      <ModalRegistrarPago
        toggleRegistrarPago={togglePago}
        modalRegistrarPago={modalPago}
        servicio={servicioModal}
        setDownloading={setDownloading}
      />
      

      {/* Modal Imprimir factura Servicios */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
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

      {/* Modal Registrar Diagnositco */}
      <ModalDiagnostico
        modalRegistrarDiagnostico={modalDiagnostico}
        toggleRegistrarDiagnostico={toggleDiagnostico}
        servicio={servicioModal}
        setDownloading={setDownloading}
      />
    </>
  );
};

export default Servicios;
