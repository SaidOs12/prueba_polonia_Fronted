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
import { useUserContext } from "../../../components/Context/UserContext";
import { useEffect, useState } from "react";
import { apiSaveMetodoPagoServicios } from "../../../api/Servicios/MetodoPago";
import Swal from "sweetalert2";
const ModalRegistrarPago = ({
  modalRegistrarPago,
  toggleRegistrarPago,
  servicio,
  setDownloading,
}) => {
  const [metodoPagoNew, setMetodoPagoNew] = useState([]);

  useEffect(()=>{
    if(!modalRegistrarPago){
      
    setMetodoPagoNew([])
    }{
      setMetodoPagoNew((prevServicioNuevo) => ({
        ...prevServicioNuevo,
        ["precio"]: totalPagar/1000,
      }));

    }
  },[modalRegistrarPago])
  0; //Actualizar campos del form servicioNuevo
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setMetodoPagoNew((prevServicioNuevo) => ({
      ...prevServicioNuevo,
      [name]: newValue,
    }));
  };
  const { tipoPagos, setServicios ,sendMessage} = useUserContext();
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
    apiSaveMetodoPagoServicios(metodoPago)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          //actualizo el servicio en la lista servicios
          const nuevoMensaje = {
            text: "se registro un pago",
            servicios: data.data,
            metodo: "PUT",
          };
          sendMessage(nuevoMensaje);
      
          toggleRegistrarPago();
       
          
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se puedo registrar el pago",
          });
        }
        // Actualiza el servicio en la lista de servicios
      })
      .catch((e) => {
        console.log(e); // Manejo de errores
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se puedo registrar el pago",
        });
      })
      .finally((f) => {
        setDownloading(false);
      });
  };

  const [totalPagar, setTotalPagar] = useState(0);
  useEffect(() => {
    let precio = servicio?.precio;
    let precioEspecial = servicio?.precioEspecial;
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
    if (precioEspecial > 0) {
      totalServicio = precioEspecial;

    }
    let totalPago = totalServicio + totalManoObra + totalSubServicios;

    setTotalPagar(totalPago - totalMetodosPagos);
  }, [servicio]);

  const [detalles, setDetalles] = useState(false);
  const [detallesPagos, setDetallesPagos] = useState(false);
  return (
    <>
      {/* Modal registrar Membresia */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
        isOpen={modalRegistrarPago}
        toggle={toggleRegistrarPago}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2 className="text-uppercase">Registrar Pago</h2>
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggleRegistrarPago}
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
                        Total a Pagar:
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="precio"
                        name="precio"
                        placeholder="Vehiculo"
                        type="text"
                        value={totalPagar/1000}
                        onChange={handleChange}
                        min={0}
                        max={10000}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <Label for="tipoPago">Seleccionar metodo de pago:</Label>
                      <Input
                        id="tipoPago"
                        className="form-control"
                        name="tipoPago"
                        type="select"
                        value={metodoPagoNew.tipoPago}
                        onChange={handleChange}
                        required
                      >
                        <option value={""}>Selecione un tipo de pago</option>
                        {tipoPagos.map((tipoPago) => (
                          <option
                            className="text-lg text-dark"
                            key={tipoPago.id}
                            value={tipoPago.id}
                          >
                            {tipoPago?.nombre}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="precio">
                        Pago Cliente
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="precio"
                        name="precio"
                        type="number"
                        value={metodoPagoNew?.precio}
                        onChange={handleChange}
                        min={1}
                        required
                      />
                    </FormGroup>
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
                  </Col>

                  {detallesPagos && (
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="precio">
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
                                  <td>{sub.precio/1000}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </FormGroup>
                    </Col>
                  )}
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
                  </Col>
                  {detalles && (
                    <>
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
                            value={servicio?.precio/1000}
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
                            value={servicio?.precioEspecial/1000}
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
                                : servicio?.manoObra/1000
                            }
                            disabled
                            //onChange={handleChange}
                            min={1}
                            //required
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="precio"
                          >
                            Sub Servicos
                          </label>
                          <div>
                            <Table className="align-items-center" responsive>
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
                                    <td>{sub.precio/1000}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </FormGroup>
                      </Col>
                    </>
                  )}
                </Row>
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button
                  className="btn-white"
                  color="default"
                  onClick={toggleRegistrarPago}
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

export default ModalRegistrarPago;
