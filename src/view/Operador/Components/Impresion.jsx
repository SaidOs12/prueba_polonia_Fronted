import escpos from 'escpos';
import path from 'path';
import moment from 'moment';
import escposUSB from 'escpos-usb';
import escposNetwork from 'escpos-network';
import escposSerial from 'escpos-serialport';

// Select the adapter based on your operating system
escpos.USB = escposUSB;
escpos.Network = escposNetwork;
escpos.Serial = escposSerial;

// Change this path to the path of your image
const device = new escpos.USB();
const options = { encoding: "GB18030" /* default */ }
const printer = new escpos.Printer(device, options);

const PrintTicket2 = async (servicio) => {
    const imagePath = path.join(__dirname, 'logo.png');
    const total = calcularTotal(servicio);
  
    device.open(async function () {
      escpos.Image.load(imagePath, function (image) {
        printer
          .align('ct')
          .image(image, 's8')
          .then(() => {
            printer
              .text('--------------------------------')
              .text(`Turno: ${servicio.turno}`)
              .text(`Vehiculo: ${servicio.vehiculo}`)
              .text(`Inyectores: ${servicio.cantidad}`)
              .text(`Servicio Inyectores: ${servicio.precio.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}`)
              .text(servicio.manoObra ? `Mano de obra: ${servicio.manoObra.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}` : '')
              .text(servicio.subServicios.length > 0 ? 'Sub Servicios:' : '')
              .text(servicio.subServicios.map(sub => `${sub.nombre}: ${sub.precio.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}`).join('\n'))
              .text('--------------------------------')
              .text(`Total: ${total.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}`)
              .text('--------------------------------')
              .text(`Fecha: ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`)
              .cut()
              .close();
          });
      });
    });
  }
  
  const calcularTotal = (servicio) => {
    let precio = servicio?.precio;
    let precioEspcial = servicio?.precioEspcial;
    let totalManoObra = servicio?.manoObra;
  
    let totalSubServicios = servicio?.subServicios?.reduce((acc, sub) => acc + sub.precio, 0) || 0;
    let totalMetodosPagos = servicio?.metodosPago?.reduce((acc, metodoPago) => acc + metodoPago.precio, 0) || 0;
  
    let totalServicio = precioEspcial > 0 ? precioEspcial : precio;
    let totalPago = Number(totalServicio) + Number(totalManoObra) + Number(totalSubServicios);
  
    return totalPago;
  }
  
  // Ejemplo de uso
  const servicio = {
    turno: '123',
    vehiculo: 'ABC123',
    cantidad: 4,
    precio: 50000,
    manoObra: 10000,
    subServicios: [{ nombre: 'Limpieza', precio: 5000 }],
    metodosPago: [{ nombre: 'Efectivo', precio: 50000 }]
  };
  
  export default PrintTicket2;