import { Badge, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const CajaIndex=({serviciosState})=>{


    return (
        <>
        <Row className="mt-3">
           <Col lg={4}>
             <Card
               className="card-stats mb-4 mb-xl-0 border "
               color="dark"
               outline
             >
               <CardBody>
                 <div className="text-dark curso-link">
                   <Row>
                     <Col className="col-auto">
                       <div className="icon icon-shape border text-white rounded-circle shadow">
                         <p
                           title="LIMPIEZA DE INYECTORES"
                           className="mt-3"
                         >
                           <img
                             alt="..."
                             src={"/icon/1.png"}
                             style={{
                               width: "40px",
                               height: "40px",
                               objectFit: "cover",
                               borderRadius: "50%",
                             }}
                           />{" "}
                         </p>
                       </div>
                     </Col>

                     <div className="col">
                       <CardTitle
                         tag="h5"
                         className="text-uppercase text-dark mb-0"
                       >
                         LIM INY -{" "}
                         <Badge className="bg-dark text-white text-xs">
                           {serviciosState.limpieza}
                         </Badge>
                       </CardTitle>
                       <p className="h2 font-weight-bold mb-0 text-center">
                         {serviciosState.totalLimpieza}
                       </p>
                     </div>
                   </Row>
                   {/* <p className="mt-3 mb-0 text-muted text-sm">
                 <span className="text-success mr-2">
                   <i className="fa fa-arrow-up" /> Información
                 </span>
               </p> */}
                 </div>
               </CardBody>
             </Card>
           </Col>
           <Col lg={4}>
             <Card
               className="card-stats mb-4 mb-xl-0 border "
               color="dark"
               outline
             >
               <CardBody>
                 <div className="text-dark curso-link">
                   <Row>
                     <Col className="col-auto">
                       <div className="icon icon-shape border text-white rounded-circle shadow">
                         <p
                           title="LIMPIEZA DE INYECTORES"
                           className="mt-3"
                         >
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
                       </div>
                     </Col>

                     <div className="col">
                       <CardTitle
                         tag="h5"
                         className="text-uppercase text-dark mb-0"
                       >
                         LIM INY-SERV -{" "}
                         <Badge className="bg-dark text-white text-xs">
                           {serviciosState.limpiezaDesmontada}
                         </Badge>
                       </CardTitle>
                       <p className="h2 font-weight-bold mb-0 text-center">
                         {serviciosState.totalLimpiezaDesmontada}
                       </p>
                     </div>
                   </Row>
                   {/* <p className="mt-3 mb-0 text-muted text-sm">
                 <span className="text-success mr-2">
                   <i className="fa fa-arrow-up" /> Información
                 </span>
               </p> */}
                 </div>
               </CardBody>
             </Card>
           </Col>
           <Col lg={4}>
             <Card
               className="card-stats mb-4 mb-xl-0 border "
               color="dark"
               outline
             >
               <CardBody>
                 <div className="text-dark curso-link">
                   <Row>
                     <Col className="col-auto">
                       <div className="icon icon-shape border  text-white rounded-circle shadow">
                         <p
                           title="LIMPIEZA DE INYECTORES"
                           className="mt-3"
                         >
                           <img
                             alt="..."
                             src={"/icon/4.png"}
                             style={{
                               width: "40px",
                               height: "40px",
                               objectFit: "cover",
                               borderRadius: "50%",
                             }}
                           />{" "}
                         </p>
                       </div>
                     </Col>

                     <div className="col">
                       <CardTitle
                         tag="h5"
                         className="text-uppercase text-dark mb-0"
                       >
                         MANO OBRA -{" "}
                         <Badge className="bg-dark text-white text-xs">
                           {serviciosState.manoObra}
                         </Badge>
                       </CardTitle>
                       <p className="h2 font-weight-bold mb-0 text-center">
                         {serviciosState.totalManoObra}
                       </p>
                     </div>
                   </Row>
                   {/* <p className="mt-3 mb-0 text-muted text-sm">
                 <span className="text-success mr-2">
                   <i className="fa fa-arrow-up" /> Información
                 </span>
               </p> */}
                 </div>
               </CardBody>
             </Card>
           </Col>
         </Row>
        
        </>
    )

}

export default CajaIndex;