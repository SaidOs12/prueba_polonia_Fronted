import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
  Form,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
// core components
import classnames from "classnames";
import { apiSaveServicios } from "../../../../api/Servicios/Servicios";
import { apiLlamadaMecanico } from "../../../../api/Servicios/Twilio/Twilio";
import { IoMdCloseCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { useUserContext } from "../../../../components/Context/UserContext";
import { IoSend } from "react-icons/io5";
import Swal from "sweetalert2";
const ModalRegistrarServicio = ({
  modal,
  toggle,
  setDownloading,
  detalles,
  detallesManoObra,
  setDetalles,
  setDetallesManoObra,
  tipoServicios,
  sendMessage,
  mecanicos,
  toggleFactura,
}) => {
  const toggleNavs = (index) => {
    setTabs(index);
  };
  useEffect(() => {
    if (!modal) {
      setServicioNuevo([]);
      setServicioNuevoLimpieza([]);
      setClienteNuevo([]);
    }
  }, [modal]);
  const [tabs, setTabs] = useState(1);
  const usuario = JSON.parse(localStorage.getItem("data"));
  //Informacion del servicio Nuevo
  const [servicioNuevo, setServicioNuevo] = useState({
    manoObra: null,
    operador: usuario.id,
  });
  const [servicioNuevoLimpieza, setServicioNuevoLimpieza] = useState({
    manoObra: null,
    operador: usuario.id,
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
  //Actualizar campos del form servicioNuevo
  const handleChangeLimpieza = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setServicioNuevoLimpieza((prevServicioNuevo) => ({
      ...prevServicioNuevo,
      [name]: newValue,
    }));
  };
  //Actualizar campos del form ManoObra
  const handleChangeCliente = (e) => {
    const { name, value } = e.target;

    setClienteNuevo((prevManoObra) => ({
      ...prevManoObra,
      [name]: value,
    }));
  };
  const [clienteNuevo, setClienteNuevo] = useState([]);

  const handleSaveServicio = (e) => {
    e.preventDefault();
    const servicioNew = {
      mecanico: servicioNuevo?.mecanico,
      tipoServicio: {
        id: servicioNuevo.tipoServicio,
      },
      vehiculo: servicioNuevo.vehiculo,
      cantidad: servicioNuevo.cantidad,
      manoObra: servicioNuevo?.manoObra,
      operador: usuario.id,
      flauta: servicioNuevo?.flauta,
      chaveta: servicioNuevo?.chaveta,
      precioespecial: servicioNuevo?.precioespecial,
    };
    // console.log(tabs);
    // console.log(servicioNew);
    // console.log(clienteNuevo);

    setDownloading(true);
    apiSaveServicios(servicioNew)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          //setServicios((prevServicios) => [...prevServicios, data?.data]);

          toggle();

          toggleFactura(data.data);
          const nuevoMensaje = {
            text: "Servicio nuevo",
            servicios: data.data,
            metodo: "POST",
          };
          sendMessage(nuevoMensaje);

          llamadaMecanico(data.data);
        }
      })
      .catch((e) => {
        console.log(e);
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

  const handleSaveServicioLimpiezaInyectores = (e) => {
    e.preventDefault();
    const servicioNew = {
      mecanico: servicioNuevoLimpieza?.mecanico,
      tipoServicio: {
        id: servicioNuevoLimpieza.tipoServicio,
      },
      vehiculo: servicioNuevoLimpieza.vehiculo,
      cantidad: servicioNuevoLimpieza.cantidad,
      manoObra: servicioNuevoLimpieza?.manoObra,
      operador: usuario.id,
      flauta: servicioNuevoLimpieza?.flauta,
      chaveta: servicioNuevoLimpieza?.chaveta,
      precioespecial: servicioNuevoLimpieza?.precioespecial,
    };
    // console.log(tabs);
    // console.log(servicioNew);
    // console.log(clienteNuevo);

    setDownloading(true);
    apiSaveServicios(servicioNew)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          //setServicios((prevServicios) => [...prevServicios, data?.data]);

          toggle();

          toggleFactura(data.data);
          const nuevoMensaje = {
            text: "Servicio nuevo",
            servicios: data.data,
            metodo: "POST",
          };
          sendMessage(nuevoMensaje);

          llamadaMecanico(data.data);
        }
      })
      .catch((e) => {
        console.log(e);
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

  const llamadaMecanico = (servicio) => {
    if (servicio?.mecanico !== null)
      apiLlamadaMecanico(servicio.mecanico)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
        });
  };

  return (
    <>
      <Modal
        className="modal-dialog-centered"
        size="xl"
        isOpen={modal}
        toggle={toggle}
      >
        <div className="modal-body p-0">
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow">
                <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
                  <div
                    className="text-muted text-center mt-2 mb-3"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <h2 className="text-uppercase">Registrar Servicios</h2>
                  </div>
                  <button
                    className="btn btn-close h1  text-dark"
                    style={{
                      backgroundColor: "transparent", // Color de fondo del botón transparente
                      border: "none",
                    }}
                    onClick={toggle}
                  >
                    <IoMdCloseCircle className="h2 text-red" title="cerrar" />
                  </button>
                </CardHeader>
                <CardBody>
                  <div className="nav-wrapper">
                    <Nav
                      className="nav-fill flex-column flex-md-row"
                      id="tabs-icons-text"
                      pills
                      role="tablist"
                    >
                      <NavItem>
                        <NavLink
                          aria-selected={tabs === 1}
                          className={classnames("mb-sm-3   mb-md-0 font-", {
                            "bg-dark h3 text-white": tabs === 1,
                          })}
                          onClick={() => toggleNavs(1)}
                          role="tab"
                        >
                          <i className="ni ni-cloud-upload-96 mr-2" />
                          LIMPIEZA DE INYECTORES
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          aria-selected={tabs === 2}
                          className={classnames("mb-sm-3 mb-md-0", {
                            "bg-dark h3 text-white": tabs === 2,
                          })}
                          onClick={() => toggleNavs(2)}
                          role="tab"
                        >
                          <i className="ni ni-bell-55 mr-2" />
                          SERVICIOS MANO DE OBRA
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <TabContent activeTab={"tabs" + tabs}>
                    <TabPane tabId="tabs1">
                      <Form onSubmit={handleSaveServicioLimpiezaInyectores}>
                        <Row>
                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="nombre"
                              >
                                Nombre
                                <span className="text-primary text-xl mb-0">
                                  *
                                </span>
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
                                htmlFor="cantidad"
                              >
                                Cantidad
                                <span className="text-danger text-xl mb-0">
                                  *
                                </span>
                              </label>
                              <Input
                                className="form-control-alternative text-dark fw-bold"
                                id="cantidad"
                                name="cantidad"
                                placeholder="Ingrese la cantidad"
                                type="number"
                                value={servicioNuevoLimpieza?.cantidad}
                                onChange={handleChangeLimpieza}
                                required
                              />
                            </FormGroup>
                          </Col>

                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="vehiculo"
                              >
                                Vehículo
                                <span className="text-danger text-xl mb-0">
                                  *
                                </span>
                              </label>
                              <Input
                                className="form-control-alternative text-dark fw-bold"
                                id="vehiculo"
                                name="vehiculo"
                                placeholder="Ingrege el nombre del Vehículo"
                                value={servicioNuevoLimpieza?.vehiculo}
                                onChange={handleChangeLimpieza}
                                type="text"
                                required
                              />
                            </FormGroup>
                          </Col>
                        </Row>

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

                        {detalles && (
                          <Row>
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
                                  onChange={handleChangeLimpieza}
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
                                  value={servicioNuevoLimpieza.precioespecial}
                                  onChange={handleChangeLimpieza}
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
                                    onChange={handleChangeLimpieza}
                                    value={servicioNuevoLimpieza?.flauta}
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
                          </Row>
                        )}

                        <Col lg="12">
                          <FormGroup>
                            <div className="custom-control custom-checkbox mb-3">
                              <input
                                className="custom-control-input"
                                id="detallesManoObra"
                                type="checkbox"
                                name="detallesManoObra"
                                value={detallesManoObra}
                                onChange={(e) => {
                                  setDetallesManoObra(e.target.checked);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="detallesManoObra"
                              >
                                Mano de obra
                              </label>
                            </div>
                          </FormGroup>
                        </Col>
                        {detallesManoObra && (
                          <Row>
                            <Col lg="6">
                              <FormGroup className="text-dark">
                                <Label
                                  for="mecanico"
                                  className="form-control-label"
                                >
                                  Mecanico
                                  <span className="text-danger text-xl mb-0">
                                    *
                                  </span>
                                </Label>
                                <Input
                                  id="mecanico"
                                  className="form-control  "
                                  name="mecanico"
                                  type="select"
                                  value={servicioNuevoLimpieza?.mecanico}
                                  onChange={handleChangeLimpieza}
                                  // onChange={(e) => {
                                  //   setServicioNuevo((prevServicioNuevo) => ({
                                  //     ...prevServicioNuevo,
                                  //     [e.target.name]: e.target.value,
                                  //   }));
                                  // }}
                                  required={detallesManoObra}
                                >
                                  <option value="">
                                    Selecione un mecanico
                                  </option>
                                  {mecanicos?.map((mecanico) => (
                                    <option
                                      className="text-lg text-dark "
                                      key={mecanico.usuario.id}
                                      value={mecanico.usuario.id}
                                    >
                                      {mecanico.usuario.nombre}-
                                      {mecanico.usuario.id}
                                    </option>
                                  ))}
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="manoObra"
                                >
                                  Valor de la Mano de obra
                                  <span className="text-danger text-xl mb-0">
                                    *
                                  </span>
                                </label>
                                <Input
                                  className="form-control-alternative text-dark fw-bold"
                                  id="manoObra"
                                  name="manoObra"
                                  placeholder="Ingrese el Valor de la mano de obra"
                                  type="number"
                                  value={servicioNuevoLimpieza.manoObra}
                                  onChange={handleChangeLimpieza}
                                  required={detallesManoObra}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        )}
                        <CardFooter className="d-flex justify-content-end">
                          <Button
                            className="text-white"
                            color="dark"
                            type="submit"
                          >
                            Guardar <IoSend className="mb-0 h3 text-white" />
                          </Button>
                        </CardFooter>
                      </Form>
                    </TabPane>
                    <TabPane tabId="tabs2">
                      <Form onSubmit={handleSaveServicio}>
                        <Row>
                          <Col lg="4">
                            <FormGroup className="text-dark">
                              <Label
                                for="tipoServicio"
                                className="form-control-label"
                              >
                                Seleccionar tipo servicio
                                <span className="text-danger text-xl mb-0">
                                  *
                                </span>
                              </Label>
                              <Input
                                id="tipoServicio"
                                className="form-control"
                                name="tipoServicio"
                                type="select"
                                value={servicioNuevo?.tipoServicio}
                                onChange={handleChange}
                                required
                              >
                                <option value="">
                                  Seleccione un tipo de servicio
                                </option>
                                {tipoServicios?.map((tipoServicio) => {
                                  if (tipoServicio?.id !== Number(1)) {
                                    return (
                                      <option
                                        className="text-lg text-dark"
                                        key={tipoServicio.id}
                                        value={tipoServicio.id}
                                      >
                                        {tipoServicio.nombre}
                                      </option>
                                    );
                                  }
                                  return null;
                                })}
                              </Input>
                            </FormGroup>
                          </Col>
                          {servicioNuevo?.tipoServicio == 2 && (
                            <Col lg="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="cantidad"
                                >
                                  Cantidad
                                  <span className="text-danger text-xl mb-0">
                                    *
                                  </span>
                                </label>
                                <Input
                                  className="form-control-alternative text-dark fw-bold"
                                  id="cantidad"
                                  name="cantidad"
                                  placeholder="Ingrese la cantidad"
                                  type="number"
                                  value={servicioNuevo?.cantidad}
                                  onChange={handleChange}
                                />
                              </FormGroup>
                            </Col>
                          )}

                          <Col lg="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="vehiculo"
                              >
                                Vehículo
                                <span className="text-danger text-xl mb-0">
                                  *
                                </span>
                              </label>
                              <Input
                                className="form-control-alternative text-dark fw-bold"
                                id="vehiculo"
                                name="vehiculo"
                                placeholder="Ingrege el nombre del Vehículo"
                                value={servicioNuevo?.vehiculo}
                                onChange={handleChange}
                                type="text"
                                required
                              />
                            </FormGroup>
                          </Col>
                        </Row>

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

                        {detalles && (
                          <Row>
                            <Col lg="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="nombre"
                                >
                                  Nombre Cliente
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
                          </Row>
                        )}

                        {/* <Col lg="12">
                                  <FormGroup>
                                    <div className="custom-control custom-checkbox mb-3">
                                      <input
                                        className="custom-control-input"
                                        id="detallesManoObra"
                                        type="checkbox"
                                        name="detallesManoObra"
                                        value={detallesManoObra}
                                        onChange={(e) => {
                                          setDetallesManoObra(e.target.checked);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="detallesManoObra"
                                      >
                                        Mano de obra
                                      </label>
                                    </div>
                                  </FormGroup>
                                </Col>
                                {detallesManoObra && (
                              
                                )} */}
                        <Row>
                          <Col lg="6">
                            <FormGroup className="text-dark">
                              <Label
                                for="mecanico"
                                className="form-control-label"
                              >
                                Mecanico
                                <span className="text-danger text-xl mb-0">
                                  *
                                </span>
                              </Label>
                              <Input
                                id="mecanico"
                                className="form-control  "
                                name="mecanico"
                                type="select"
                                value={servicioNuevo?.mecanico}
                                onChange={handleChange}
                                // onChange={(e) => {
                                //   setServicioNuevo((prevServicioNuevo) => ({
                                //     ...prevServicioNuevo,
                                //     [e.target.name]: e.target.value,
                                //   }));
                                // }}
                                required
                              >
                                <option value="">Selecione un mecanico</option>
                                {mecanicos?.map((mecanico) => (
                                  <option
                                    className="text-lg text-dark "
                                    key={mecanico.usuario.id}
                                    value={mecanico.usuario.id}
                                  >
                                    {mecanico.usuario.nombre}-
                                    {mecanico.usuario.id}
                                  </option>
                                ))}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="manoObra"
                              >
                                Valor de la Mano de obra
                                <span className="text-danger text-xl mb-0">
                                  *
                                </span>
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
                        <CardFooter className="d-flex justify-content-end">
                          <Button
                            className="text-white"
                            color="dark"
                            type="submit"
                          >
                            Guardar <IoSend className="mb-0 h3 text-white" />
                          </Button>
                        </CardFooter>
                      </Form>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default ModalRegistrarServicio;
