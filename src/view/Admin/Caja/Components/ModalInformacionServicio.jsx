import {
  Badge,
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
  Table,
} from "reactstrap";
import { useUserContext } from "../../../../components/Context/UserContext";
import { useEffect, useState } from "react";
import { apiSaveMetodoPagoServicios } from "../../../../api/Servicios/MetodoPago";
import Swal from "sweetalert2";
const ModalInformacionServicio = ({
  modal,
  toggle,
  servicio,
  setDownloading,
}) => {
  const [metodoPagoNew, setMetodoPagoNew] = useState([]);

  //Actualizar campos del form servicioNuevo
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setMetodoPagoNew((prevServicioNuevo) => ({
      ...prevServicioNuevo,
      [name]: newValue,
    }));
  };
  const { tipoPagos, setServicios, sendMessage } = useUserContext();
  const handleSavePago = (e) => {
    e.preventDefault();
    console.log(metodoPagoNew);
    setDownloading(true);
    const usuario = JSON.parse(localStorage.getItem("data"));
    const metodoPago = {
      usuarioId: usuario.id,
      servicioId: servicio.id,
      precio: metodoPagoNew.precio * 1000,
      tipoPago: {
        id: metodoPagoNew.tipoPago,
      },
    };
    console.log(metodoPago);
  };

  const [totalPagar, setTotalPagar] = useState(0);
  useEffect(() => {
    let precio = servicio?.precio;
    let precioEspcial = servicio?.precioEspcial;
    let totalManoObra = servicio?.manoObra;

    //Sub Servicios del cliente
    let totalSubServicios = 0;
    servicio?.subServicios?.map((sub) => {
      totalSubServicios += sub.precio;
    });

    //Pagos que el cliente lleva
    let totalMetodosPagos = 0;
    servicio?.metodosPago?.map((metodoPago) => {
      totalMetodosPagos += metodoPago.precio;
    });

    let totalServicio = precio;
    if (precioEspcial > 0) {
      totalServicio = precioEspcial;
    }
    let totalPago = totalServicio + totalManoObra + totalSubServicios;

    setTotalPagar(totalPago);
  }, [servicio]);

  const [detalles, setDetalles] = useState(false);
  const [detallesPagos, setDetallesPagos] = useState(false);
  return (
    <>
      {/* Modal registrar Membresia */}
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
                <h2 className="text-uppercase">Información del Servicio</h2>
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
            <Form onSubmit={handleSavePago}>
              <CardBody className="px-lg-3 py-lg-2">
                {/* {membresia && (
                  
                )} */}
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Vehiculo Servicio
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="vehiculo"
                        name="vehiculo"
                        placeholder="Vehiculo"
                        type="text"
                        value={servicio?.vehiculo}
                        //onChange={handleChange}
                        min={1}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Total Pago:
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="precio"
                        name="precio"
                        placeholder="Vehiculo"
                        type="text"
                        value={totalPagar / 1000}
                        onChange={handleChange}
                        min={0}
                        max={10000}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Turno
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="vehiculo"
                        name="vehiculo"
                        placeholder="Vehiculo"
                        type="text"
                        value={servicio?.turno}
                        //onChange={handleChange}
                        min={1}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="cedula">
                        Tipo Servicio
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="vehiculo"
                        name="vehiculo"
                        placeholder="Vehiculo"
                        type="text"
                        value={servicio?.tipoServicio?.nombre}
                        //onChange={handleChange}
                        min={1}
                        disabled
                      />
                    </FormGroup>
                  </Col>

                  <Col lg="12">
                    <FormGroup>
                      <div className="custom-control custom-checkbox mb-3">
                        <input
                          className="custom-control-input"
                          id="customCheckDetalles"
                          type="checkbox"
                          name="detalles"
                          value={detalles}
                          onChange={(e) => {
                            setDetalles(e.target.checked);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customCheckDetalles"
                        >
                          Detalles Precio
                        </label>
                      </div>
                    </FormGroup>
                    {detalles && (
                      <>
                        <Row>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="precio"
                              >
                                Precio
                              </label>
                              <Input
                                className="form-control-alternative text-dark fw-bold"
                                id="precio"
                                name="precio"
                                type="number"
                                value={servicio?.precio / 1000}
                                disabled
                                //onChange={handleChange}
                                min={1}
                                //required
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="precio"
                              >
                                Precio Especial
                              </label>
                              <Input
                                className="form-control-alternative text-dark fw-bold"
                                id="precio"
                                name="precio"
                                type="number"
                                value={servicio?.precioEspecial}
                                disabled
                                //onChange={handleChange}
                                min={1}
                                //required
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="precio"
                              >
                                Mano de obra
                              </label>
                              <Input
                                className="form-control-alternative text-dark fw-bold"
                                id="precio"
                                name="precio"
                                type="number"
                                value={
                                  servicio?.manoObra == null
                                    ? 0
                                    : servicio?.manoObra / 1000
                                }
                                disabled
                                //onChange={handleChange}
                                min={1}
                                //required
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="precio"
                            >
                              Sub Servicos
                            </label>
                            <div>
                              {servicio?.subServicios?.length > 0 && (
                                <Table
                                  className="align-items-center"
                                  responsive
                                >
                                  <thead className="thead text-white bg-primary">
                                    <tr>
                                      <th scope="col ">Nombre</th>
                                      <th scope="col">Precio</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {servicio?.subServicios?.map((sub) => (
                                      <tr key={sub.id}>
                                        <th scope="row">
                                          <td>{sub.nombre}</td>
                                        </th>
                                        <td>{sub.precio / 1000}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              )}
                            </div>
                          </FormGroup>
                        </Col>
                      </>
                    )}
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <div className="custom-control custom-checkbox mb-3">
                        <input
                          className="custom-control-input"
                          id="metodosPagos"
                          type="checkbox"
                          name="metodosPagos"
                          value={detalles}
                          onChange={(e) => {
                            setDetallesPagos(e.target.checked);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="metodosPagos"
                        >
                          Detalles Metodos de Pago
                        </label>
                      </div>
                    </FormGroup>
                    {detallesPagos && (
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="precio"
                          >
                            Metodos de Pago
                          </label>
                          <div>
                            <Table className="align-items-center" responsive>
                              <thead className="thead text-white bg-primary">
                                <tr>
                                  <th scope="col">Tipo Pago</th>
                                  <th scope="col">Precio</th>
                                </tr>
                              </thead>
                              <tbody>
                                {servicio?.metodosPago?.map((sub) => (
                                  <tr key={sub.id}>
                                    <th scope="row">
                                      <td>{sub.tipoPago.nombre}</td>
                                    </th>
                                    <td>{sub.precio / 1000}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </FormGroup>
                      </Col>
                    )}
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button className="btn-white" color="default" onClick={toggle}>
                  Cerrar
                </Button>
                {/* <Button className="text-white" color="default" type="submit">
                  Guardar
                </Button> */}
              </CardFooter>
            </Form>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default ModalInformacionServicio;
