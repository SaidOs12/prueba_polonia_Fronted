import { Button, Card, CardText, CardTitle, Col, Row, Table } from "reactstrap";
import { useUserContext } from "../../../../components/Context/UserContext";
import { useEffect, useState } from "react";

const MecanicoIndex = ({ filtro ,setPagoTotal}) => {
  const { mecanicos, servicios } = useUserContext();

  const [listadoFiltro, setListadoFiltro] = useState([]);

  const buscarMecanico = (id) => {
    const mecanico = mecanicos?.find(
      (mecanico) => mecanico.usuario.id === Number(id)
    );

    return mecanico?.usuario?.nombre;
  };
  const calcularTotalServicios = (servicios) => {
    let total = 0;
    servicios.forEach((servicio) => {
      total += calcularTotal(servicio);
    });
    return total;
  };

  const calcularTotal = (servicio) => {
    //let precio = servicio?.precio || 0;
    //let precioEspecial = servicio?.precioEspecial || 0;
    let totalManoObra = servicio?.manoObra || 0;

    // Sub Servicios del cliente
    let totalSubServicios = 0;
    servicio?.subServicios?.forEach((sub) => {
      totalSubServicios += sub.precio;
    });

    // let totalServicio = precioEspecial > 0 ? precioEspecial : precio;
    return (totalManoObra + totalSubServicios) / 1000;
  };

  useEffect(() => {
    // Filtra los servicios según el criterio proporcionado
    const serviciosFiltrados = servicios?.filter(
      (servicio) =>
        servicio?.pago &&
        servicio?.fechaPago?.split("T")[0] === filtro &&
        servicio?.manoObra > 0
    );

    // Agrupa y ordena los servicios por mecánico
    const listado = serviciosFiltrados.reduce((acc, servicio) => {
      const mecanico = servicio?.mecanico;
      if (mecanico) {
        if (!acc[mecanico]) {
          acc[mecanico] = { mecanico, servicios: [] };
        }
        acc[mecanico].servicios.push(servicio);
      }
      return acc;
    }, {});

    // Convierte el objeto en un array y ordena por la cantidad de servicios (de mayor a menor)
    const listadoOrdenado = Object.values(listado).sort(
      (a, b) => b.servicios.length - a.servicios.length
    );
      // Calcular el total de pagos
      let totalPago = 0;
      listadoOrdenado.forEach((mecanico) => {
        totalPago += calcularTotalServicios(mecanico.servicios);
      });
      setPagoTotal(totalPago);

    setListadoFiltro(listadoOrdenado);
  }, [servicios, filtro]);



  return (
    <Row className="mt-3">
      {listadoFiltro?.map((mecanico) => (
        <Col sm="6">
          <Card body>
            <Button>
              {buscarMecanico(mecanico?.mecanico)} -{" "}
              {/* Necesito sumar cada total y guardarla setPagoTotal */}
              {calcularTotalServicios(mecanico.servicios)}
            </Button>
            <Row className="mt-3">
              <Table className="align-items-center" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Servicio</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mecanico?.servicios?.map((servicio) => (
                    <tr>
                      <td>
                        <>
                          {servicio?.tipoServicio?.id === 1 ? (
                            <>
                              {servicio?.manoObra === null ? (
                                <p title="LIMPIEZA DE INYECTORES">
                                  <img
                                    alt="..."
                                    src={
                                      "/icon/" +
                                      servicio.tipoServicio.id +
                                      ".png"
                                    }
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      objectFit: "cover",
                                      borderRadius: "50%",
                                    }}
                                  />{" "}
                                </p>
                              ) : (
                                <p title="LIMPIEZA DE INYECTORES CON DESMONTADA">
                                  <img
                                    alt="..."
                                    src={"/icon/1-4.png"}
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      objectFit: "cover",
                                      borderRadius: "50%",
                                    }}
                                  />{" "}
                                </p>
                              )}
                            </>
                          ) : servicio?.tipoServicio?.id === 2 ? (
                            <p>
                              <img
                                title="SINCRONIZACIÓN"
                                alt="..."
                                src={
                                  "/icon/" + servicio.tipoServicio.id + ".png"
                                }
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                }}
                              />{" "}
                            </p>
                          ) : (
                            <p>
                              <img
                                title="MANO DE OBRA"
                                alt="..."
                                src={
                                  "/icon/" + servicio.tipoServicio.id + ".png"
                                }
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                }}
                              />{" "}
                            </p>
                          )}
                        </>
                      </td>
                      <td>{calcularTotal(servicio)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MecanicoIndex;
