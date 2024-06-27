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
import CardTarea from "./Components/CardTarea";

const Tareas = () => {
  const [loading, setLoading] = useState(false);
  const { entrenadores, setEntrenadores } = useUserContext();
  const [filtro, setFiltro] = useState("");
  //Activar spinner
  const [downloading, setDownloading] = useState(false);

  const [entrenador, setEntrenador] = useState([]);
  //Modal registrar entrenador
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setEntrenador([]);
    setModal(!modal);
  };
  //Modal editar entrenador
  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleUpdate = () => {
    setModalUpdate(!modalUpdate);
  };
  //Listado de entrenadores
  const listado = async () => {
    try {
      const response = await listaUsuarioRol(3);
      const data = await response.json();
      setLoading(false);
      setEntrenadores(data);
    } catch (error) {
      console.log(error);
    }
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
  const actualizarEntrenador = (e) => {
    e.preventDefault();
    setDownloading(true);
  };

  //filtrar entrenadores por cedula
  const filtroProblemas = entrenadores?.filter((entrenador) =>
    entrenador.usuario.cedula.toLowerCase().includes(filtro.toLowerCase())
  );
  const tareas = [
    {
      id: 1,
      operador: "Mauricio",
      duracion: "15 min",
      descripcion: "Limpiar el local y ordenar el frente",
    },
    {
      id: 2,
      operador: "Ana",
      duracion: "30 min",
      descripcion: "Actualizar inventario y reponer productos",
    },
    {
      id: 3,
      operador: "Carlos",
      duracion: "45 min",
      descripcion: "Revisar y ajustar la caja registradora",
    },
  ];

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
                    <h3 className="mb-0">TAREAS </h3>
                  </div>
                  <div className="col text-right">
                    <Link title="Registrar">
                      <Button color="primary" type="submit" onClick={toggle}>
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
                      {tareas.map((tarea) => (
                        <CardTarea key={tarea.id} tarea={tarea} />
                      ))}
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Modal registrar tarea */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
        isOpen={modal}
        toggle={toggle}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2 className="text-uppercase">Registrar Tarea</h2>
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggle}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <Form onSubmit={registrarEntrenador}>
              <CardBody className="px-lg-3 py-lg-2">
                {entrenador && (
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Operador
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="nombre"
                          name="nombre"
                          placeholder="Nombre"
                          value={entrenador.nombre}
                          onChange={handleChange}
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>

                   
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="telefono"
                        >
                          Tiempo
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="telefono"
                          name="telefono"
                          placeholder="ingrese el tiempo"
                          type="text"
                          value={entrenador.telefono}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Prioridad
                        </label>
                        <Input
                          id="tipoPago"
                          className="form-control"
                          name="tipoPago"
                          type="select"
                          // value={metodoPagoNew.tipoPago}
                          // onChange={handleChange}
                          required
                        >
                          <option value={""}>Selecione la Prioridad</option>
                          <option value={"ALTA"}>ALTA</option>
                          <option value={"MEDIA"}>MEDIA</option>
                          <option value={"BAJA"}>BAJA</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="descripcion"
                        >
                          Descripción
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="descripcion"
                          name="descripcion"
                          placeholder="Ingrese la descripción de la tarea"
                          type="textarea"
                          value={entrenador.descripcion}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button className="btn-white" color="default" onClick={toggle}>
                  Cerrar
                </Button>
                <Button className="text-white" color="default" type="submit">
                  Guardar
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </div>
      </Modal>
      {/* Modal actulizar entrenador */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
        isOpen={modalUpdate}
        toggle={toggleUpdate}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2 className="text-uppercase">Actualizar Entrenador</h2>
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggleUpdate}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <Form onSubmit={actualizarEntrenador}>
              <CardBody className="px-lg-3 py-lg-2">
                {entrenador && (
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Nombre's
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="nombre"
                          name="nombre"
                          placeholder="Marlon"
                          value={entrenador.nombre}
                          onChange={handleChange}
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="email">
                          Correo Electronico
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="email"
                          name="email"
                          placeholder="jesse@example.com"
                          type="email"
                          value={entrenador.email}
                          onChange={handleChange}
                          disabled
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="cedula">
                          Cedula
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="cedula"
                          name="cedula"
                          placeholder="302541787"
                          type="text"
                          value={entrenador.cedula}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="telefono"
                        >
                          Telefono
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="telefono"
                          name="telefono"
                          placeholder="302541787"
                          type="text"
                          value={entrenador.telefono}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="fechaNacimiento"
                        >
                          Fecha de Nacimiento
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="fechaNacimiento"
                          name="fechaNacimiento"
                          type="date"
                          value={entrenador?.fechaNacimiento?.split("T")[0]}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button
                  className="btn-white"
                  color="default"
                  onClick={toggleUpdate}
                >
                  Cerrar
                </Button>
                <Button className="text-white" color="default" type="submit">
                  Guardar
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default Tareas;
