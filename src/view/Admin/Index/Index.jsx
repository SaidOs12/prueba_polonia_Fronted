import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  CardHeader,
  CardTitle,
  Container,
  Modal,
  CardFooter,
  Table,
  Input,
  FormGroup,
  Label,
  Form,
  Spinner,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardText,
} from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import classnames from "classnames";
import Header from "../../../components/Headers/Header";
import { useUserContext } from "../../../components/Context/UserContext";
import { CiBank } from "react-icons/ci";
import "../../../assets/css/spinner.css";
import { FaMoneyBill } from "react-icons/fa";
import { MdOutlineAddCard } from "react-icons/md";
import CajaIndex from "./Components/CajaIndex";
import MecanicoIndex from "./Components/MecanicoIndex";
import VentasIndex from "./Components/VentasIndex";
const Index = () => {
  const { servicios } = useUserContext();
  const [sleep, setSleep] = useState(false);
  const [filtro, setFiltro] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (filtro == null) {
      let fecha = moment(new Date()).format("YYYY-MM-DD");
      setFiltro(fecha);
    }
  }, [filtro]);

  const [serviciosState, setServiciosState] = useState({
    limpieza: 0,
    totalLimpieza: 0,
    limpiezaDesmontada: 0,
    totalLimpiezaDesmontada: 0,
    manoObra: 0,
    totalManoObra: 0,
  });

  useEffect(() => {
    const serviciosPagos = servicios?.filter(
      (servicio) =>
        servicio?.pago && servicio?.fechaPago?.split("T")[0] === filtro
    );

    if (serviciosPagos?.length > 0) {
      const {
        limpieza,
        totalLimpieza,
        limpiezaDesmontada,
        totalLimpiezaDesmontada,
        manoObra,
        totalManoObra,
        saldoTotal,
      } = serviciosPagos.reduce(
        (totals, servicio) => {
          if (servicio?.tipoServicio?.id === 1) {
            if (servicio.manoObra === null) {
              totals.limpieza += 1;
              totals.totalLimpieza += calcularTotal(servicio);
            } else {
              let total = calcularTotal(servicio);
              totals.limpiezaDesmontada += 1;
              totals.totalLimpiezaDesmontada +=
                servicio?.precioEspecial > 0
                  ? servicio?.precioEspecial / 1000
                  : servicio.precio / 1000;
              totals.totalManoObra += total - servicio.precio / 1000;
              totals.manoObra += 1;
            }
          } else if (servicio?.tipoServicio?.id === 2) {
            let total = calcularTotal(servicio);
            totals.limpiezaDesmontada += 1;
            totals.totalLimpiezaDesmontada +=
              servicio?.precioEspecial > 0
                ? servicio?.precioEspecial / 1000
                : servicio.precio / 1000;
            totals.totalManoObra += total - servicio.precio / 1000;
            totals.manoObra += 1;
          } else {
            totals.manoObra += 1;
            totals.totalManoObra += calcularTotal(servicio);
          }
          return totals;
        },
        {
          limpieza: 0,
          totalLimpieza: 0,
          limpiezaDesmontada: 0,
          totalLimpiezaDesmontada: 0,
          manoObra: 0,
          totalManoObra: 0,
        }
      );
      const total = totalLimpieza + totalLimpiezaDesmontada + totalManoObra;

      setServiciosState((prevState) => ({
        ...prevState,
        limpieza,
        totalLimpieza,
        limpiezaDesmontada,
        totalLimpiezaDesmontada,
        manoObra,
        totalManoObra,
        saldoTotal: total,
      }));

      console.log(limpieza);
    } else {
      setServiciosState({
        limpieza: 0,
        totalLimpieza: 0,
        limpiezaDesmontada: 0,
        totalLimpiezaDesmontada: 0,
        manoObra: 0,
        totalManoObra: 0,
      });
    }
  }, [servicios, filtro]); // Ejecutar solo una vez cuando `servicios` cambia

  const calcularTotal = (servicio) => {
    let precio = servicio?.precio || 0;
    let precioEspecial = servicio?.precioEspecial || 0;
    let totalManoObra = servicio?.manoObra || 0;

    // Sub Servicios del cliente
    let totalSubServicios = 0;
    servicio?.subServicios?.forEach((sub) => {
      totalSubServicios += sub.precio || 0; // Asegurarse de que el precio de subServicio sea un número
    });

    let totalServicio = precioEspecial > 0 ? precioEspecial : precio;
    return (totalServicio + totalManoObra + totalSubServicios) / 1000;
  };

  const [activeTab, setActiveTab] = useState("1");

  const toggleNav = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const [pagoTotal,setPagoTotal]=useState(0)

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}

        <Card className="my-2 text-justify ">
          <CardBody>
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggleNav("1");
                    }}
                    type="button"
                  >
                    Caja
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggleNav("2");
                    }}
                    type="button"
                  >
                    Ventas
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => {
                      toggleNav("3");
                    }}
                    type="button"
                  >
                    Mecanicos
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row className="align-items-center mt-3 ">
                    <div className="col">
                      <h3 className="mb-0">
                        TOTAL: {serviciosState?.saldoTotal}
                      </h3>
                    </div>

                    <Col sm={4} title="Filtro Fecha de Registro">
                      <Input
                        type="date"
                        placeholder="Fecha"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                      />
                    </Col>
                  </Row>

                  <CajaIndex serviciosState={serviciosState}/>
                </TabPane>
                <TabPane tabId="2">
                <Row className="align-items-center mt-3 ">
                    <div className="col">
                      <h3 className="mb-0">
                        TOTAL: NaN
                      </h3>
                    </div>

                    <Col sm={4} title="Filtro Fecha de Registro">
                      <Input
                        type="date"
                        placeholder="Fecha"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                      />
                    </Col>
                  </Row>

                  <VentasIndex/>
                </TabPane>
                <TabPane tabId="3">
                <Row className="align-items-center mt-3 ">
                    <div className="col">
                      <h3 className="mb-0">
                        TOTAL: {pagoTotal}
                      </h3>
                    </div>

                    <Col sm={4} title="Filtro Fecha de Registro">
                      <Input
                        type="date"
                        placeholder="Fecha"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <MecanicoIndex setPagoTotal={setPagoTotal} filtro={filtro}/>
                </TabPane>
              </TabContent>
            </div>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Index;
