import { Badge, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const VentasIndex=({serviciosState})=>{


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
                           title="VENTAS DE INYECTORES"
                           className="mt-3"
                         >
                           {/* <img
                             alt="..."
                             src={"/icon/1.png"}
                             style={{
                               width: "40px",
                               height: "40px",
                               objectFit: "cover",
                               borderRadius: "50%",
                             }}
                           /> */}
                         </p>
                       </div>
                     </Col>

                     <div className="col">
                       <CardTitle
                         tag="h5"
                         className="text-uppercase text-dark mb-0"
                       >
                         VENTA INY -{" "}
                         <Badge className="bg-dark text-white text-xs">
                           0
                         </Badge>
                       </CardTitle>
                       <p className="h2 font-weight-bold mb-0 text-center">
                         NaN
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
                         <p title="VENTAS DE ALEGRA" className="mt-3">
                           {/* <img
                             alt="..."
                             src={"/icon/1-4.png"}
                             style={{
                               width: "40px",
                               height: "40px",
                               objectFit: "cover",
                               borderRadius: "50%",
                             }}
                           />{" "} */}
                         </p>
                       </div>
                     </Col>

                     <div className="col">
                       <CardTitle
                         tag="h5"
                         className="text-uppercase text-dark mb-0"
                       >
                         VENTA ALEGRA -{" "}
                         <Badge className="bg-dark text-white text-xs">
                           0
                         </Badge>
                       </CardTitle>
                       <p className="h2 font-weight-bold mb-0 text-center">
                         NaN
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
                       <div className="icon icon-shape  text-white rounded-circle shadow">
                         <p title="PAGOS" className="mt-3">
                           {/* <img
                             alt="..."
                             src={"/icon/4.png"}
                             style={{
                               width: "40px",
                               height: "40px",
                               objectFit: "cover",
                               borderRadius: "50%",
                             }}
                           />{" "} */}
                         </p>
                       </div>
                     </Col>

                     <div className="col">
                       <CardTitle
                         tag="h5"
                         className="text-uppercase text-dark mb-0"
                       >
                         PAGOS -{" "}
                         <Badge className="bg-dark text-white text-xs">
                           0
                         </Badge>
                       </CardTitle>
                       <p className="h2 font-weight-bold mb-0 text-center">
                         NaN
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

export default VentasIndex;