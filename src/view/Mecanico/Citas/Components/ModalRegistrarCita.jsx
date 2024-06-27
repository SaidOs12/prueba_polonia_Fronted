import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
} from "reactstrap";
import { apiSaveCita } from "../../../../api/Cita/Cita";
import { useEffect, useState } from "react";
import { useUserContext } from "../../../../components/Context/UserContext";
import moment from "moment"; // Importa Moment.js
import Swal from "sweetalert2";
const ModalRegistrarCita = ({ modal, toggle, setDownloading }) => {
  useEffect(() => {
    if (!modal) setCita([]);
  }, [modal]);
  const { usuario, tipoServicios, mecanicos, sendMessage,buscarListaDeCitas } =
    useUserContext();
  const [cita, setCita] = useState([]);
  //Actualizar campos del modal
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCita((prevCita) => ({ ...prevCita, [name]: value }));
  };

  const buscarTipoServicio = (id) => {
    // Utilizamos el operador de comparación estricta (===) para comparar los IDs
    // Esto asegura que la comparación sea precisa y no se realice la conversión de tipos
    const tipo = tipoServicios.find((tipo) => tipo.id == id);
    return tipo; // Devolvemos el objeto encontrado, o undefined si no se encontró ninguna coincidencia
  };
  const registrarCita = (e) => {
    e.preventDefault();
    console.log(cita);
    const tipo=buscarTipoServicio(cita?.tipoServicio)
    const newCita = {
      mecanico: {
        id: cita?.mecanico,
      },
      operador: {
        id: usuario?.id,
      },
      tipoServicio: {
        id: tipo.id,
        nombre:tipo.nombre
      },
      nombre: cita?.nombre,
      telefono: cita?.telefono,
      cantidad: cita.cantidad,
      vehiculo: cita?.vehiculo,
      manoObra: cita?.manoObra,
      descripcion: cita.descripcion,
      fechaCita: cita?.fechaCita,
    };
    console.log(newCita);
    setDownloading(true);
    apiSaveCita(newCita)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          //setCitas((prevCitas) => [...prevCitas, data.data]);
          //buscarListaDeCitas()
          const nuevoMensaje = {
            text: "Cita nueva",
            servicios: null,
            metodo: "CITA",
          };
          sendMessage(nuevoMensaje);
          toggle();
          Swal.fire({
            icon: "success",
            title: "COMPLETADO",
            text: "La cita se registro",
          });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setDownloading(false);
      });
  };

  return (
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
              <h2 className="text-uppercase">Registrar Cita</h2>
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
          <Form onSubmit={registrarCita}>
            <CardBody className="px-lg-3 py-lg-2">
              <Row>
                <Col lg="4">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="nombre">
                      Nombre
                    </label>
                    <Input
                      className="form-control-alternative text-dark fw-bold"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre"
                      value={cita.nombre}
                      onChange={handleChange}
                      type="text"
                      
                    />
                  </FormGroup>
                </Col>

                <Col lg="4">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="telefono">
                      Telefono
                    </label>
                    <Input
                      className="form-control-alternative text-dark fw-bold"
                      id="telefono"
                      name="telefono"
                      placeholder="ingrese el telefono"
                      type="number"
                      value={cita.telefono}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col lg="4">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="vehiculo">
                      Vehiculo
                    </label>
                    <Input
                      className="form-control-alternative text-dark fw-bold"
                      id="vehiculo"
                      name="vehiculo"
                      placeholder="ingrese el telefono"
                      type="text"
                      value={cita.vehiculo}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup className="text-dark">
                    <Label for="tipoServicio" className="form-control-label">
                      Seleccionar tipo servicio
                    </Label>
                    <Input
                      id="tipoServicio"
                      className="form-control"
                      name="tipoServicio"
                      type="select"
                      value={cita?.tipoServicio}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un tipo de servicio</option>
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

                {cita?.tipoServicio < 3 && (
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cantidad">
                        Cantidad
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="cantidad"
                        name="cantidad"
                        placeholder="ingrese la cantidad"
                        type="number"
                        value={cita.cantidad}
                        onChange={handleChange}
                        
                      />
                    </FormGroup>
                  </Col>
                )}

                <Col lg="6">
                  <FormGroup className="text-dark">
                    <Label for="mecanico" className="form-control-label">
                      Mecanico
                    </Label>
                    <Input
                      id="mecanico"
                      className="form-control  "
                      name="mecanico"
                      type="select"
                      value={cita?.mecanico}
                      onChange={handleChange}
                      required
                      
                    >
                      <option value="">Selecione un mecanico</option>
                      {mecanicos?.map((mecanico) => (
                        <option
                          className="text-lg text-dark "
                          key={mecanico.usuario.id}
                          value={mecanico.usuario.id}
                        >
                          {mecanico.usuario.nombre}-{mecanico.usuario.id}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="manoObra">
                      Valor de la Mano de obra
                    </label>
                    <Input
                      className="form-control-alternative text-dark fw-bold"
                      id="manoObra"
                      name="manoObra"
                      placeholder="ingrese el precio"
                      type="number"
                      value={cita.manoObra}
                      onChange={handleChange}
                      
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="fechaCita">
                      Fecha Y Hora
                    </label>
                    <Input
                      className="form-control-alternative text-dark fw-bold"
                      id="fechaCita"
                      name="fechaCita"
                      placeholder="ingrese el precio"
                      type="datetime-local"
                      value={cita.fechaCita}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </Col>
           
                <Col lg="12">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="descripcion">
                      Descripción
                    </label>
                    <Input
                      className="form-control-alternative text-dark fw-bold"
                      id="descripcion"
                      name="descripcion"
                      placeholder="Ingrese la descripción de la tarea"
                      type="textarea"
                      value={cita.descripcion}
                      onChange={handleChange}
                      
                    />
                  </FormGroup>
                </Col>
              </Row>
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
  );
};

export default ModalRegistrarCita;
