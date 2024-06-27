import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  CardBody,
  // Otros componentes de reactstrap
} from "reactstrap";
import DataTable from "react-data-table-component";
import moment from "moment"; // Importa Moment.js
import { useUserContext } from "../../../components/Context/UserContext";
import Header from "../../../components/Headers/Header";
import {
  customTheme,
  customStyles,
} from "../../../components/Datatable/DatatableCustom";
import "../../../assets/css/spinner.css";

const Historial = () => {
  const [loading, setLoading] = useState(false);
  const { servicios } = useUserContext();
  const [filtro, setFiltro] = useState([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Clonar la lista de servicios para evitar mutar el estado original
    const serviciosOrdenados = [...servicios];
    // serviciosOrdenados?.filter(
    //   (servicio) =>
    //     servicio?.fechaPago != null
    // );

    // Ordenar los servicios por la fecha de pago
    serviciosOrdenados.sort(
      (a, b) => new Date(a.fechaPago) - new Date(b.fechaPago) 
    );

    // Crear un array con la estructura [{fecha: "", servicios: [], pagoTotal: 0}]
    const filtrados = serviciosOrdenados.reduce((acc, servicio) => {
      // Formatear la fecha de pago para agrupar los servicios por fecha
      const fechaPago = new Date(servicio.fechaPago)
        .toISOString()
        .split("T")[0];

      // Buscar si ya existe una entrada para esta fecha
      let fechaExistente = acc.find((item) => item.fecha === fechaPago);

      if (fechaExistente) {
        // Si existe, agregar el servicio a la lista de servicios de esa fecha
        fechaExistente.servicios.push(servicio);
        fechaExistente.pagoTotal += calcularPagoTotal(servicio);
      }
       else {
        // Si no existe, crear una nueva entrada para esta fecha
        acc.push({
          fecha: fechaPago,
          servicios: [servicio],
          pagoTotal: calcularPagoTotal(servicio),
        });
      }

      return acc;
    }, []);

   
    
    const filteredData = filtrados.filter(item => new Date(item.fecha).getFullYear() >= 2000);
 // Invertir el array para mostrar en orden inverso
    filteredData.reverse();
    // Actualizar el estado con los servicios filtrados
    setFiltro(filteredData);

    console.log(filtrados);
  }, [servicios]);

  const calcularTotalCaja = (listaServicios) => {
    const totales = listaServicios?.reduce(
      (acc, servicio) => {
        servicio?.metodosPago?.forEach((metodoPago) => {
          switch (metodoPago.tipoPago.nombre) {
            case "EFECTIVO":
              acc.efectivo += metodoPago.precio;
              break;
            case "BANCOLOMBIA":
              acc.bancolombia += metodoPago.precio;
              break;
            case "DAVIVIENDA":
              acc.davivienda += metodoPago.precio;
              break;
            case "CREDITO":
              acc.credito += metodoPago.precio;
              break;
            default:
              break;
          }
        });
        return acc;
      },
      { efectivo: 0, bancolombia: 0, davivienda: 0, credito: 0 }
    );

    return {
      efectivo: totales.efectivo / 1000,
      bancolombia: totales.bancolombia / 1000,
      davivienda: totales.davivienda / 1000,
      credito: totales.credito / 1000,
    };
  };

  const calcularPagoTotal = (servicio) => {
    let total = servicio.metodosPago.reduce(
      (acc, metodoPago) => acc + metodoPago.precio,
      0
    );
    return total / 1000; // Para mantener la misma unidad de medida
  };

  const columns = [
    {
      name: "Fecha ",
      cell: (row) => (
        <div className="mt-1">
          <p className="text-sm">{moment(row?.fecha).format("DD-MMM-YYYY ")}</p>
        </div>
      ),
      selector: (row) => row?.fecha,
      sortable: true,
      wrap: true,
      width: "30%",
    },
    {
      name: "Metodos de Pago",
      cell: (row) => {
        const totalCaja = calcularTotalCaja(row.servicios);
        return (
          <Row>
            <Col xs={6} className="text-end">
              {" "}
              <p>
                <strong>Efectivo:</strong> {totalCaja.efectivo}
              </p>
            </Col>
            <Col xs={6} className="text-end">
              <p>
                <strong>Bancolombia:</strong> {totalCaja.bancolombia}
              </p>
            </Col>
            <Col xs={6} className="text-end">
              <p>
                <strong>Davivienda:</strong> {totalCaja.davivienda}
              </p>
            </Col>
            <Col xs={6} className="text-end">
              <p>
                <strong>Crédito:</strong> {totalCaja.credito}
              </p>
            </Col>
          </Row>
        );
      },
      selector: (row) => row?.servicios,
      sortable: false,
      wrap: true,
      width: "50%",
    },
    {
      name: "Total",
      cell: (row) => (
        <div className="mt-1">
          <h1 className="text-lg">{row.pagoTotal}</h1>
        </div>
      ),
      selector: (row) => row?.pagoTotal,
      sortable: true,
      wrap: true,
      width: "20%",
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
                    <h3 className="mb-0">HISTORIAL CAJA</h3>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <SpinnerGrupo />
                ) : (
                  <DataTable
                    theme={customTheme}
                    customStyles={customStyles}
                    columns={columns}
                    data={filtro}
                    striped
                    pointerOnHover
                    responsive
                    sortActive
                    sortDirection
                    highlightOnHover
                    search // Activa la búsqueda
                    noDataComponent="No se encontraron registros para mostrar."
                    pagination // Activa la paginación
                    paginationPerPage={20}
                    paginationComponentOptions={{
                      rowsPerPageText: "Filas por página:",
                      rangeSeparatorText: "de",
                      selectAllRowsItem: true,
                      selectAllRowsItemText: "Todos",
                      selectAllRowsItemShow: true,
                    }}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Historial;
