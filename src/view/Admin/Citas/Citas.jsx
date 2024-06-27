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
  CardText,
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
import "../../../assets/css/spinner.css";
import Swal from "sweetalert2";
import SpinnerGrupo from "../../../components/Sppiner";
import { MagicMotion } from "react-magic-motion";
import { useUserContext } from "../../../components/Context/UserContext";
import CardTarea from "./Components/CardCitas";
import { apiSaveCita } from "../../../api/Cita/Cita";
import ModalRegistrarCita from "./Components/ModalRegistrarCita";

const Citas = () => {
  const [loading, setLoading] = useState(false);
  const { citas } = useUserContext();
  const [filtro, setFiltro] = useState("");
  //Activar spinner
  const [downloading, setDownloading] = useState(false);

 
  //Modal registrar entrenador
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  //Modal editar entrenador
  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleUpdate = () => {
    setModalUpdate(!modalUpdate);
  };

  //Abrir modal y cargar entrenador
  const handleOpciones = (cita) => {
    toggleUpdate();
    setCita(cita);
  };

 



  //filtrar entrenadores por cedula
  // const filtroProblemas = entrenadores?.filter((entrenador) =>
  //   entrenador.usuario.cedula.toLowerCase().includes(filtro.toLowerCase())
  // );
  const cancelarCita=()=>{
    Swal.fire({
      title: "Cancelar Cita",
      text: "estas seguro de cancelar la Cita?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancelar",
      cancelButtonText: "Salir"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Completado!",
          text: "La cita se cancelo",
          icon: "success"
        });
      }
    });
  }

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
                    <h3 className="mb-0">CITAS </h3>
                  </div>
                  <div className="col text-right">
                    <Link title="Registrar Cita">
                      <Button color="dark" type="submit" onClick={toggle}>
                        <i className="fa fa-plus" />
                      </Button>
                    </Link>
                  </div>
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
                {loading ? (
                  <SpinnerGrupo />
                ) : (
                  <>
                    <div>
                      {citas.map((cita) => (
                        <CardTarea key={cita.id} cita={cita} cancelarCita={cancelarCita} />
                      ))}
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <ModalRegistrarCita modal={modal} toggle={toggle} setDownloading={setDownloading}/> 
     
    </>
  );
};

export default Citas;
