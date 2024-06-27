

import React from 'react';
import { Card, CardTitle, CardText, Row, Col, Button } from 'reactstrap';

const CardTarea = ({ tarea }) => (
  <Card body className="mb-3 border border-dark">
    <CardTitle tag="h1" className="text-primary">
      <Row className="align-items-center">
        <Col className="col-8">
          <h3 className="mb-0 mt-3 text-dark fw-bold">TAREA</h3>
        </Col>
        <Col className="col-4 text-right">
          <Button title="Actualizar" className="fw-bold h1 text-primary mr-2" type="submit">
            <i className="fa-regular fa-pen-to-square" />
          </Button>
          <Button title="Eliminar" className="fw-bold h1 text-danger">
            <i className="fa fa-trash" />
          </Button>
        </Col>
      </Row>
    </CardTitle>
    <Row>
      <Col lg="6">
        <CardTitle tag="h3" className="text-primary mb-0">Operador</CardTitle>
        <CardText className="text-dark fw-bold">{tarea.operador}</CardText>
      </Col>
      <Col lg="6">
        <CardTitle tag="h3" className="text-primary mb-0">Duración</CardTitle>
        <CardText className="text-dark fw-bold">{tarea.duracion}</CardText>
      </Col>
      <Col lg="12">
        <CardTitle tag="h3" className="text-primary mb-0">Descripción de la tarea</CardTitle>
        <CardText className="text-dark fw-bold">{tarea.descripcion}</CardText>
      </Col>
    </Row>
  </Card>
);


export default CardTarea;
