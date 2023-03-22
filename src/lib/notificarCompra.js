import { config } from "dotenv";
import { createTransport } from "nodemailer";
import twilio from "twilio";
import logger from "./logger.lib.js"

config();

const sendBuyRegister = async (req, res) => {

  // El req tiene 3 objetos. Username, Nombre y El carrito, los accedo por indice.
  let nombreUsuario = req[0];
  let nombrePersonal = req[1];
  let total = 0;

  let cuerpoMsj = "";
    req[2].body.forEach(element => {
      cuerpoMsj +=`
      <div>
        <h2>${element.nombreProducto}</h2>
        <p>Descripcion: ${element.descripcionProducto}<p>
        <p>Precio: $ ${element.precioProducto}<p>
        <p><img style="max-width: 200px;" src=${element.urlFotoProducto} /></p>
      </div>
      `
      total += element.precioProducto;

    });

    const cart = req.body
    const transporter = createTransport({
        service: "gmail",
        port: 587,
        auth: {
            user: "giacosa.andres@gmail.com",
            pass: process.env.GMAIL_TPWD
        },
        tls: {
            rejectUnauthorized: false
        },
    })
    
    const mailOptions = {
        from: "Servidor Node",
        to: process.env.MAIL_ADMIN,
        subject: `Nuevo pedido de ${nombrePersonal.name} mail: ${nombreUsuario.user}`,
        html: `<h1 style="color: blue">Nueva compra!</h1> </br> 
        <h1 style="color: blue">Se ha concretado la compra por un total de $ ${total}  <br> Su compra incluye los siguientes articulos: </h1>`+cuerpoMsj,
      };
    
      // Configuro WZP
      const client = twilio(process.env.ACCOUNTSID, process.env.AUTH_TOKEN);
      const options = {
        body: `Su pedido ha sido realizado y se encuentra en proceso.`,
        from: "whatsapp:"+process.env.TWILIO_PHONE_NUMBER,
        to: "whatsapp:+59899873574",
      };

try {

    // ENVIO WZP
    const message = await client.messages.create(options);
    logger.info.info("Se envio WZP de confirmacion de compra al usuario.")  
    // Envio MAIL
    const info = await transporter.sendMail(mailOptions);
    logger.info.info("Se envio mail de confirmacion de compra a ADMIN")
    //console.log(info);

  } catch (err) {
    console.log(err);
  }
}


export default sendBuyRegister;