import { useEffect, useState } from "react";
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
import { apiSaveDiagnostico } from "../../../api/Servicios/Diagnostico";
import Swal from "sweetalert2";
import { useUserContext } from "../../../components/Context/UserContext";
const ModalDiagnostico = ({
  modalRegistrarDiagnostico,
  toggleRegistrarDiagnostico,
  servicio,
  setDownloading,
  estadoDiagnostico,
  autoFinalizarCronometro
}) => {
  const { setServicios, sendMessage } = useUserContext();
  const [diagnostico, setDiagnostico] = useState([]);
  useEffect(() => {
    if (!modalRegistrarDiagnostico) setDiagnostico([]);
  }, [modalRegistrarDiagnostico]);

  useEffect(() => {
    if (servicio !== null)
      setDiagnostico((prevFormData) => ({
        ...prevFormData,
        ["servicioId"]: servicio.id,
      }));
  }, [servicio]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiagnostico((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSaveDiagnostico = (e) => {
    console.log(servicio);
    console.log(diagnostico);
    e.preventDefault();
    setDownloading(true);
    apiSaveDiagnostico(diagnostico)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if(data.success){
          const nuevoMensaje = {
            text: "se registro un diagnostico",
            servicios: data.data,
            metodo: "PUT",
          };
          sendMessage(nuevoMensaje);
  
          toggleRegistrarDiagnostico();
          autoFinalizarCronometro(data.data)
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
      {/* Modal registrar Membresia */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
        isOpen={modalRegistrarDiagnostico}
        toggle={toggleRegistrarDiagnostico}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                {servicio?.diagnostico?.id == null ? (
                  <h2 className="text-uppercase">Registrar Diagnostico</h2>
                ) : (
                  <h2 className="text-uppercase">Informacion Diagnostico</h2>
                )}
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggleRegistrarDiagnostico}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <Form onSubmit={handleSaveDiagnostico}>
              <CardBody className="px-lg-3 py-lg-2">
                {/* {membresia && (
                  
                )} */}
                <Row>
                  <Col lg="4">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Sin Pulso
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="pulso"
                        name="pulso"
                        placeholder="Ingresa el pulso"
                        type="number"
                        value={diagnostico?.pulso}
                        onChange={handleChange}
                        min={1}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="4">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Goteo
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="goteo"
                        name="goteo"
                        placeholder="Ingresa el goteo"
                        type="number"
                        value={diagnostico?.goteo}
                        onChange={handleChange}
                        min={1}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="4">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Directo
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="directo"
                        name="directo"
                        placeholder="Ingresa directo"
                        type="number"
                        value={diagnostico?.directo}
                        onChange={handleChange}
                        min={1}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Llenado de mas
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="llenadoMas"
                        name="llenadoMas"
                        placeholder="Ingresa el llenado de mas"
                        type="number"
                        value={diagnostico?.llenadoMas}
                        onChange={handleChange}
                        min={1}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Llenado de menos
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="llenadoMenos"
                        name="llenadoMenos"
                        placeholder="Ingresa el llenado de menos"
                        type="number"
                        value={diagnostico?.llenadoMenos}
                        onChange={handleChange}
                        min={1}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Observacion
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="observacion"
                        name="observacion"
                        placeholder="Ingresa el llenado de menos"
                        type="textarea"
                        value={diagnostico?.observacion}
                        onChange={handleChange}
                        min={1}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button
                  className="btn-white"
                  color="default"
                  onClick={toggleRegistrarDiagnostico}
                >
                  Cerrar
                </Button>
                {servicio?.diagnostico?.id == null && (
                  <Button className="text-white" color="default" type="submit">
                    Guardar
                  </Button>
                )}
              </CardFooter>
            </Form>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default ModalDiagnostico;
