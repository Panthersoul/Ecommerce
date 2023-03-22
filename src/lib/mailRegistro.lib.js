import { config } from "dotenv";
import { createTransport } from "nodemailer";


config();

const sendMailRegister = async (req, res) => {
    const newUsr = req.body
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
        subject: "Nuevo registro",
        html: `<h1 style="color: blue">Nuevo Registro!</h1> </br> 
        <p>Usr: ${newUsr.username}</p>
        <p>Address: ${newUsr.address}</p>
        <p>Nombre: ${newUsr.firstname}</p>
        <p>Tel: ${newUsr.telephone}</p>
        <img src="${newUsr.picture}" />
        <p></p>`,
      };
      
try {
    const info = await transporter.sendMail(mailOptions);
  
    console.log(info);
  } catch (err) {
    console.log(err);
  }
}


export default sendMailRegister;