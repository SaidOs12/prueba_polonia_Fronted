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
  CardTitle,
} from "reactstrap";
// core components
import Header from "../../../components/Headers/Header";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  customTheme,
  customStyles,
} from "../../../components/Datatable/DatatableCustom";
import moment from "moment"; // Importa Moment.js
import "../../../assets/css/spinner.css";
import Swal from "sweetalert2";
import SpinnerGrupo from "../../../components/Sppiner";
import { MagicMotion } from "react-magic-motion";
import { useUserContext } from "../../../components/Context/UserContext";
import { CiBank } from "react-icons/ci";
import { FaInfoCircle, FaMoneyBill } from "react-icons/fa";
import { MdOutlineAddCard } from "react-icons/md";
import ModalInformacionServicio from "./Components/ModalInformacionServicio";

const CajaOperador = () => {
  const [loading, setLoading] = useState(false);
  const { servicios } = useUserContext();
  const [filtro, setFiltro] = useState(null);
  //Activar spinner
  const [downloading, setDownloading] = useState(false);
  const [servicioModal, setServicioModal] = useState({});
  //Modal registrar entrenador
  const [modal, setModal] = useState(false);
  const toggle = (servicio) => {
    setServicioModal(servicio);
    setModal(!modal);
  };

  const [efectivo, setEfectivo] = useState(0);
  const [bancolombia, setBancolombia] = useState(0);
  const [davivienda, setDavivienda] = useState(0);
  const [credito, setCredito] = useState(0);

  useEffect(() => {
    if (filtro == null) {
      let fecha = moment(new Date()).format("YYYY-MM-DD");
      setFiltro(fecha);
    }
  }, [filtro]);

  const filtroProblemas = servicios?.filter(
    (servicio) =>
      servicio?.pago && servicio?.fechaPago?.split("T")[0] === filtro
  );

  const columns = [
    {
      name: "Fecha Registro",
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
      cell: (row) => row?.turno,
      selector: (row) => row?.turno,
      sortable: true,
      wrap: true,
    },
    {
      name: "Tipo Servicio",
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
      name: "Pago",
      cell: (row) => {
        return (
          <div>
            <ul>
              {row?.metodosPago?.map((pago) => (
                <li key={pago.id}>
                  {pago?.tipoPago?.nombre?.substring(0, 3)}. . .{" "}
                  {pago.precio / 1000}
                </li>
              ))}
            </ul>
            <p className="text-end" style={{ textAlign: "right" }}>
              Total $ {calcularTotal(row)}
            </p>
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
          <Button
            block
            size="sm"
            className="mt-1 bg-primary"
            title="Entregado"
            onClick={() => toggle(row)}
          >
            <FaInfoCircle className="text-white  mb-0" />
          </Button>
        </div>
      ),
      sortable: true,
      wrap: true,
    },
  ];


  const calcularTotal = (servicio) => {
    let precio = servicio?.precio || 0;
    let precioEspcial = servicio?.precioEspcial || 0;
    let totalManoObra = servicio?.manoObra || 0;

    // Sub Servicios del cliente
    let totalSubServicios = 0;
    servicio?.subServicios?.forEach((sub) => {
      totalSubServicios += sub.precio;
    });

    let totalServicio = precioEspcial > 0 ? precioEspcial : precio;
    return (totalServicio + totalManoObra + totalSubServicios) / 1000;
  };

  useEffect(() => {
    const totales = filtroProblemas?.reduce(
      (acc, servicio) => {
        servicio?.metodosPago?.forEach((metodoPago) => {
          switch (metodoPago.tipoPago.nombre) {
            case "EFECTIVO":
              acc.efectivo += metodoPago.precio;
              break;
            case "BANCOLOMBIA":
              acc.bancolombia += metodoPago.precio;
              break;
            case "DAVIVIENDA":
              acc.davivienda += metodoPago.precio;
              break;
            case "CREDITO":
              acc.credito += metodoPago.precio;
              break;
            default:
              break;
          }
        });
        return acc;
      },
      { efectivo: 0, bancolombia: 0, davivienda: 0, credito: 0 }
    );

    setEfectivo(totales.efectivo / 1000);
    setBancolombia(totales.bancolombia / 1000);
    setDavivienda(totales.davivienda / 1000);
    setCredito(totales.credito / 1000);
  }, [filtroProblemas]);

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
          <Col lg="6" xl="3">
            <Card
              className="card-stats mb-4 mb-xl-0 border "
              color="dark"
              outline
            >
              <CardBody>
                <div className="text-dark curso-link">
                  <Row>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <FaMoneyBill />
                      </div>
                    </Col>

                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-dark mb-0"
                      >
                        EFECTIVO
                      </CardTitle>
                      <p className="h2 font-weight-bold mb-0 text-center">
                        {efectivo}
                      </p>
                    </div>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fa fa-arrow-up" /> Información
                    </span>
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg="6" xl="3">
            <Card className="card-stats mb-4 mb-xl-0" color="dark" outline>
              <CardBody>
                <div className="text-dark curso-link">
                  <Row>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                        <CiBank />
                      </div>
                    </Col>

                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-dark mb-0"
                      >
                        BANCOLOMBIA
                      </CardTitle>
                      <p className="h2 font-weight-bold mb-0 text-center">
                        {bancolombia}
                      </p>
                    </div>
                  </Row>

                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-yellow mr-2">
                      <i className="fas fa-arrow-up" /> Información
                    </span>
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" xl="3">
            <Card className="card-stats mb-4 mb-xl-0" color="dark" outline>
              <CardBody>
                <div className="text-dark curso-link">
                  <Row>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-red text-white rounded-circle shadow">
                        <CiBank />
                      </div>
                    </Col>

                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-dark mb-0"
                      >
                        DAVIVIENDA
                      </CardTitle>
                      <p className="h2 font-weight-bold mb-0 text-center">
                        {davivienda}
                      </p>
                    </div>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-red mr-2">
                      <i className="fa fa-arrow-up" /> Información
                    </span>
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" xl="3">
            <Card className="card-stats mb-4 mb-xl-0" color="dark" outline>
              <CardBody>
                <div>
                  <Row>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <MdOutlineAddCard />
                      </div>
                    </Col>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-dark mb-0"
                      >
                        CREDITO
                      </CardTitle>
                      <p className="h2 font-weight-bold mb-0 text-center">
                        {credito}
                      </p>
                    </div>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-info mr-2">
                      <i className="fas fa-arrow-up" /> Información
                    </span>
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="mb-5 mb-xl-0 mt-3" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      SERVICIOS PAGOS:{" "}
                      {moment(filtro).format("DD [de] MMM [de] YYYY ")}
                    </h3>
                  </div>

                  <Col sm={4} title="Filtro Fecha de Registro">
                    <Input
                      type="date"
                      placeholder="Fecha"
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    />
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <SpinnerGrupo />
                ) : (
                  <>
                    <DataTable
                      theme={customTheme}
                      customStyles={customStyles}
                      columns={columns}
                      data={filtroProblemas}
                      striped
                      pointerOnHover
                      responsive
                      sortActive
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal informacion servicio */}

      <ModalInformacionServicio
        toggle={toggle}
        modal={modal}
        servicio={servicioModal}
        setDownloading={setDownloading}
      />
    </>
  );
};

export default CajaOperador;
