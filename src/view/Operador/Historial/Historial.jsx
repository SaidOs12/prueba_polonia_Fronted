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


const Historial = () => {
  const [loading,setLoading]=useState(false)
  const {servicios} = useUserContext();
  const [filtro, setFiltro] = useState(null);
  useEffect(() => {
    if (filtro == null) {
      let fecha = moment(new Date()).format("YYYY-MM-DD");
      setFiltro(fecha);
    }
  }, [filtro]);

  const filtroProblemas = servicios?.filter(
    (servicio) =>
      servicio?.entregado && servicio?.fechaPago?.split("T")[0] === filtro
  );
  //Activar spinner
  const [downloading, setDownloading] = useState(false);
  
  const [entrenador,setEntrenador]=useState([]);
  //Modal registrar entrenador
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setEntrenador([])
    setModal(!modal);
  };
  //Modal editar entrenador
  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleUpdate = () => {
    setModalUpdate(!modalUpdate);
  };

  
  //Abrir modal y cargar entrenador
  const handleOpciones = (entrenador) => {
    toggleUpdate();
    setEntrenador(entrenador.usuario);
  };

  //Actualizar campos del modal
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEntrenador((prevEntrenador) => ({ ...prevEntrenador, [name]: value }));
  };

  // useEffect(() => {
  //   listado();
  // }, []);
//Registrar entrenador
  const registrarEntrenador = (e) => {
    e.preventDefault();
    setDownloading(true);
    
  };

  //Actualizar Entrenador
  const actualizarEntrenador= (e)=>{
    e.preventDefault();
    setDownloading(true)
    
  }

  const columns = [
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
      name: "Turno ",
      cell: (row) => row?.turno,
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
      name: "Cliente ",
      cell: (row) => row?.cliente?.nombre ? row?.cliente?.nombre : "NN" ,
      selector: (row) => row?.turno,
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

   
  ];
  // //filtrar entrenadores por cedula
  // const filtroProblemas = servicios?.filter((servicio) =>
  //   servicio?.pago
  // );

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
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">SERVICIOS ENTREGADOS: 
                    {moment(filtro).format("DD [de] MMM [de] YYYY ")}</h3>
                  </div>
                  {/* <div className="col text-right">
                    <Link
                    title="Registrar">
                    <Button color="primary" type="submit" onClick={toggle}>
                      <i className="fa fa-plus" /> 
                    </Button>
                    </Link>
                  </div> */}
                </Row>
                {/* <FormGroup row className="justify-content-center mr-2 mt-3">
                  <Label for="filtro" sm={3} className="text-center">
                    Buscar :
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      className=""
                      placeholder="Buscar por Cedula..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    />
                  </Col>
                </FormGroup> */}
              </CardHeader>
              <CardBody>
                {loading ?(
                  <SpinnerGrupo/>
                ):(
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
      {/* Modal registrar entrenador */}
    
    </>
  );
};

export default Historial;
