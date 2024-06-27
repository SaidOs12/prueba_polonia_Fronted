import { useState } from "react";
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
import { apiSaveSubServicios } from "../../../../api/SubServicios/apiSubServicios";
import Swal from "sweetalert2";
import { useUserContext } from "../../../../components/Context/UserContext";
const ModalRegistrarManoObra = ({
  modalRegistrarManoObra,
  toggleRegistrarManoObra,
  servicio,
  setDownloading,
}) => {

  const {sendMessage}=useUserContext()
  const [subServicio, setSubServicio] = useState({
    nombre: "",
    precio: "",
  });
  //Actualizar campos del form servicioNuevo
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubServicio((prevServicioNuevo) => ({
      ...prevServicioNuevo,
      [name]: value,
    }));
  };
  const handleSaveSubServicio = (e) => {
    e.preventDefault();

    const newSubServicio = {
      servicioId: servicio?.id,
      nombre: subServicio.nombre,
      precio: subServicio.precio,
    };
    console.log(newSubServicio);
    setDownloading(true);
    apiSaveSubServicios(newSubServicio)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          toggleRegistrarManoObra();
          const nuevoMensaje = {
            text: "se registro un subservicio",
            servicios: data.data,
            metodo: "PUT",
          };
          sendMessage(nuevoMensaje);
          Swal.fire({
            icon: "success",
            title: "Sub Servicio Registrado",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally((f) => {
        setDownloading(false);
      });
  };

  return (
    <>
      {/* Modal registrar SubServicio */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
        isOpen={modalRegistrarManoObra}
        toggle={toggleRegistrarManoObra}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2 className="text-uppercase">Registrar Sub Servicio</h2>
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggleRegistrarManoObra}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <Form onSubmit={handleSaveSubServicio}>
              <CardBody className="px-lg-3 py-lg-2">
                {/* {membresia && (
                  
                )} */}
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Vehiculo
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="precio"
                        name="precio"
                        placeholder="Ingrese el nombre de la mano de obra"
                        type="text"
                        value={servicio?.vehiculo}
                        //onChange={handleChange}
                        disabled
                      />
                    </FormGroup>
                  </Col>

                  <Col lg="12">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="nombre">
                        Nombre Mano Obra
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="nombre"
                        name="nombre"
                        placeholder="Ingrese el nombre de la mano de obra"
                        type="text"
                        value={subServicio?.nombre}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>

                  <Col lg="12">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="precio">
                        Precio Sub Servicio
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="precio"
                        name="precio"
                        type="number"
                        value={subServicio?.precio}
                        onChange={handleChange}
                        min={1}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button
                  className="btn-white"
                  color="default"
                  onClick={toggleRegistrarManoObra}
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

export default ModalRegistrarManoObra;
