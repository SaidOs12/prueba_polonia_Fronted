import React from "react";
import {
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
  Button,
  CardBody,
} from "reactstrap";
import moment from "moment"; // Importa Moment.js
import { Link } from "react-router-dom";
import { FaCalendarDay, FaUserClock } from "react-icons/fa";

const CardCitas = ({ cita }) => {


  return (
    <Card className="card-stats mb-4 mb-lg-0 bg-gris shadow-sm border-0 mt-3">
      <CardBody>
      <Row className="align-items-center">
      {/* ICONO DE LA CARD */}
      <Col xs="auto" className="mb-3 mb-md-0 d-none d-md-block">
        <div className="icon icon-shape bg-dark text-white rounded-circle shadow">
          <FaUserClock  size={24} />
        </div>
      </Col>
      {/* INFORMACION DE LA CARD */}
      <Col>
        <Row className="align-items-center text-dark h3 ">
          <Col xs="12" md="6">
             {cita?.tipoServicio?.nombre}
          </Col>
          <Col xs="12" md="6" className="text-right">
            {moment(cita?.fechaCita).format("DD-MMM hh:mm A")}
          </Col>
        </Row>
        
        <Row className="mb-3">
          <Col xs="12" md="4">
            <CardText className="text-dark mb-0">
              <strong>Cliente:</strong> {cita?.nombre}
            </CardText>
          </Col>
          <Col xs="12" md="4">
            <CardText className="text-dark mb-0">
              <strong>Teléfono:</strong> {cita?.telefono}
            </CardText>
          </Col>
          <Col xs="12" md="4">
            <CardText className="text-dark mb-0">
              <strong>Vehículo:</strong> {cita?.vehiculo}
            </CardText>
          </Col>
        </Row>
  
        <CardText className="text-dark mb-0">
          <strong>Mecánico:</strong> {cita?.mecanico?.nombre}
        </CardText>
      </Col>
    </Row>
        <Row className="mt-3">
          <Col className="text-right">
            <Button size="sm" color="dark" className="mr-4">
              Editar Cita
            </Button>
            <Button size="sm" color="danger" type="button">
              Cancelar
            </Button>
          </Col>
          
        </Row>
      </CardBody>
    </Card>
  )
};

export default CardCitas;


