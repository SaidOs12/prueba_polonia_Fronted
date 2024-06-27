import React, { useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import logoDefault from "../../../assets/img/logo.png";
import { Button } from "reactstrap";
import moment from "moment"; // Importa Moment.js

class InvoiceTemplate extends React.Component {
  render() {
    const { servicio } = this.props; // Recibir el servicio como propiedad

    return (
      <div className="ticket text-center" >
        {/* <div className="ticket-header ">
          <img src={"/logo.png"} alt="Encabezado del ticket" />
        </div> */}
        <div className="text-center">
          <h3>POLANIA MULTIREPUESTOS</h3>
        </div>
        <div >
          <span>------------------------------------------------</span>
        </div>
        
        <div className="product ">
          <span className="text-dark h3">Turno: {servicio?.turno} </span>
        </div>
        <div className="product ">
          <span className="text-dark h3">Vehiculo:  {servicio?.vehiculo}</span>
         
        </div>
        <div className="product">
          <span className="text-dark h3">Inyectores: {servicio?.cantidad} </span>
          <span id="inyectores"></span>
        </div>
        <div className="product">
          <span className="text-dark h3">Servicio Inyectores: </span>
          <span id="precio">
            {servicio?.precioEspecial>0 ? (
              <>
              {servicio?.precioEspecial?.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
              </>
            ):(
              <>
              {servicio?.precio?.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
              </>
            )}
          </span>
        </div>
        {servicio?.manoObra != null && (
          <div className="product">
            <span className="text-dark h3">Mano de obra: </span>
            <span id="precio">
              {servicio?.manoObra?.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </span>
          </div>
        )}

        {servicio?.subServicios?.length > 0 && (
          <>
            <div className="product">
              <span className="text-dark h3">Sub Servicios: </span>
            </div>
            {servicio.subServicios.map((sub, index) => (
              <div className="product" key={index}>
                <span className="text-dark h3">{sub.nombre}</span>
                <span id="inyectores">
                  {sub.precio?.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </span>
              </div>
            ))}
          </>
        )}

        <div className="product">
          <span>------------------------------------------------</span>
        </div>
        <div className="product text-center">
          <span className="text-dark h3"> Total:  {calcularTotal(servicio)?.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })} </span>
          
        </div>
        <span>------------------------------------------------</span>
        {/* <div style={{ textAlign: "center" }}>
          <span style={{ textAlign: "center" }} id="fecha">
            {moment(new Date()).format("DD-MM-YYYY hh:mm a")}
          </span>
        </div> */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* Estilos personalizados */
          @media print {
            /* Ajustar el tamaño del papel */
            @page {
              size: 72.1mm 210mm; /* Ancho x Altura */
              margin: 0mm; /* Eliminar el margen */
              border: none; /* Eliminar el borde */
            }

            /* Estilos para el contenido del ticket */
            .ticket {
              width: 72.1mm;
              height: 210mm;
              background-color: white;
              padding: 2mm;
              text-align: left;
            }

            .ticket h3 {
              margin: 0; /* Eliminar el margen */
            }

            .ticket .product {
              display: flex;
              justify-content: space-between;
              margin: 0; /* Eliminar el margen */
              padding: 0; /* Eliminar el padding */
            }

            .ticket .product span {
              margin: 0; /* Eliminar el margen */
              padding: 0; /* Eliminar el padding */
            }

            .ticket-header {
              text-align: center;
            }

            .ticket-header img {
              width: 290px;
              height: 100px;
              display: block;
              margin: 0px;
            }
          }
        `,
          }}
        />
      </div>
    );
  }
}

function calcularTotal(servicio) {
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

  return totalPago;
}

const PrintComponent = ({ servicio }) => {
  const componentRef = useRef();
  const reactToPrintContent = useRef(null);

  useEffect(() => {
    if (reactToPrintContent.current) {
      reactToPrintContent.current.handlePrint();
    }
  }, []);

  return (
    <div>
      <InvoiceTemplate servicio={servicio} ref={componentRef} />
      <div className="d-flex justify-content-center mt-3">
        <ReactToPrint
          trigger={() => (
            <Button color="primary" className="text-center">
              Imprimir factura
            </Button>
          )}
          content={() => componentRef.current}
          ref={reactToPrintContent}
        />
      </div>
    </div>
  );
};

export default PrintComponent;
