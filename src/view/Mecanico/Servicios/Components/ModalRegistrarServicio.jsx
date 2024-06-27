import { useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Modal, Row } from "reactstrap";
import { useUserContext } from "../../../../components/Context/UserContext";
import { apiSaveServicios } from "../../../../api/Servicios/Servicios";


const ModalRegistrarServicio=({modal,toggle ,filtroTiposServcios,setDownloading })=>{

    const {setServicios}=useUserContext()
    const [detalles, setDetalles] = useState(false);
   //Informacion del servicio Nuevo
  const [servicioNuevo, setServicioNuevo] = useState({
    manoObra: true,
  });
      //Actualizar campos del form servicioNuevo
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setServicioNuevo((prevServicioNuevo) => ({
      ...prevServicioNuevo,
      [name]: newValue,
    }));
  };
  const [clienteNuevo, setClienteNuevo] = useState([]);
  const [manoObraNueva, setManoObraNueva] = useState([]);
  //Actualizar campos del form ManoObra
  const handleChangeCliente = (e) => {
    const { name, value } = e.target;

    setClienteNuevo((prevManoObra) => ({
      ...prevManoObra,
      [name]: value,
    }));
  };

    const handleSaveServicio = (e) => {
        e.preventDefault();
        const usuario=JSON.parse(localStorage.getItem("data"))
    
        const servicioNew={
          mecanico:usuario.id,
          tipoServicio:{
            id:servicioNuevo.tipoServicio
          },
          vehiculo:servicioNuevo.vehiculo,
          cantidad:servicioNuevo.cantidad,
          manoObra:servicioNuevo.manoObra
         }
         console.log(servicioNew)
    
        setDownloading(true);
        apiSaveServicios(servicioNew)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.success) {
              setServicios((prevServicios) => [...prevServicios, data?.data]);
    
              toggle();
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
         {/* Modal registrar Servicios */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
        isOpen={modal}
        toggle={toggle}
      >
        <div className="modal-body p-0">
          <Card className="bg-white shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2 className="text-uppercase">Registrar Servicios</h2>
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
            <Form onSubmit={handleSaveServicio}>
              <CardBody className="px-lg-3 py-lg-2">
                {servicioNuevo && (
                  <Row>
                    <Col lg="12">
                      <FormGroup className="text-dark">
                        <Label
                          for="tipoServicio"
                          className="form-control-label"
                        >
                          Seleccionar tipo servicio
                          <span className="text-danger text-xl mb-0">*</span>
                        </Label>
                        <Input
                          id="tipoServicio"
                          className="form-control  "
                          name="tipoServicio"
                          type="select"
                          value={servicioNuevo?.tipoServicio}
                          onChange={handleChange}
                          required
                        >
                          <option
                              value={""}
                            >
                              Selecione un tipo servicio
                            </option>
                          {filtroTiposServcios?.map((tipoServicio) => (
                            <option
                              className="text-lg text-dark "
                              key={tipoServicio.id}
                              value={tipoServicio.id}
                            >
                              {tipoServicio.nombre}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    

                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="vehiculo"
                        >
                          Vehículo
                          <span className="text-danger text-xl mb-0">*</span>
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="vehiculo"
                          name="vehiculo"
                          placeholder="Ingrege el nombre del Vehículo"
                          value={servicioNuevo.vehiculo}
                          onChange={handleChange}
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="cantidad"
                        >
                          Cantidad
                          <span className="text-danger text-xl mb-0">*</span>
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="cantidad"
                          name="cantidad"
                          placeholder="Ingrese la cantidad"
                          type="number"
                          value={servicioNuevo.cantidad}
                          onChange={handleChange}
                          required
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
                            Detalles
                          </label>
                        </div>
                      </FormGroup>
                    </Col>
                    {/* <Col lg="12">
                      <FormGroup>
                        <div className="custom-control custom-checkbox mb-3">
                          <input
                            className="custom-control-input"
                            id="manoObra"
                            type="checkbox"
                            name="manoObra"
                            required
                            value={manoObra}
                            onChange={(e) => {
                             setManoObra(e.target.checked);
                           
                  
                            }}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="manoObra"
                          >
                            Mano de obra 
                          </label>
                        </div>
                      </FormGroup>
                    </Col> */}
                    {detalles && (
                      <>
                      <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Nombre Cliente
                          <span className="text-danger text-xl mb-0">*</span>
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="nombre"
                          name="nombre"
                          placeholder="Ingrege el nombre del Cliente"
                          value={clienteNuevo.nombre}
                          onChange={handleChangeCliente}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="telefono"
                            >
                              Telefono Cliente
                            </label>
                            <Input
                              className="form-control-alternative text-dark fw-bold"
                              id="telefono"
                              name="telefono"
                              placeholder="Ingrege el nombre del Cliente"
                              value={clienteNuevo.telefono}
                              onChange={handleChangeCliente}
                              type="text"
                              
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="nombre"
                            >
                              Cedula Cliente
                            </label>
                            <Input
                              className="form-control-alternative text-dark fw-bold"
                              id="cedula"
                              name="cedula"
                              placeholder="Ingrege la cedula  del Cliente"
                              value={clienteNuevo.cedula}
                              onChange={handleChangeCliente}
                              type="text"
                              
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="chaveta"
                            >
                              Chavetas
                            </label>
                            <Input
                              className="form-control-alternative text-dark fw-bold"
                              id="chaveta"
                              name="chaveta"
                              placeholder="Ingrege las Chavetas"
                              value={servicioNuevo.chaveta}
                              onChange={handleChange}
                              type="text"
                              
                            />
                          </FormGroup>
                        </Col>

                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="nombre"
                            >
                              Precio Especial
                            </label>
                            <Input
                              className="form-control-alternative text-dark fw-bold"
                              id="nombre"
                              name="precioespecial"
                              placeholder="Ingrege el precio Especial"
                              value={servicioNuevo.precioespecial}
                              onChange={handleChange}
                              type="integer"
                              
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup className="d-flex align-items-center">
                            <label className="custom-toggle mr-2 mt-3">
                              <input
                                type="checkbox"
                                name="flauta"
                                onChange={handleChange}
                                value={servicioNuevo?.flauta}
                              />
                              <span className="custom-toggle-slider rounded-circle" />
                            </label>
                            <span className="clearfix" />

                            <label
                              className="form-control-label mt-3"
                              htmlFor="nombre"
                            >
                              Flauta
                            </label>
                          </FormGroup>
                        </Col>
                      </>
                    )}

                   

                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="manoObra"
                        >
                          Valor de la Mano de obra
                          <span className="text-danger text-xl mb-0">*</span>
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="manoObra"
                          name="manoObra"
                          placeholder="Ingrese el Valor de la mano de obra"
                          type="number"
                          value={servicioNuevo.manoObra}
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
        </>
    )

}

export default ModalRegistrarServicio