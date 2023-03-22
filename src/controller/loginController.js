import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import logger from "../lib/logger.lib.js"
import sendMailRegister from "../lib/mailRegistro.lib.js"
import upload from "../lib/multer.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    res.sendFile(join(__dirname, "../public/home.html"), {name:user.firstname});
  }else{
    res.sendFile(join(__dirname, "../public/login.html"));
  }
};

const getRegister = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    logger.info.info("User Registered: "+user.username)
    sendMailRegister( {body: user});
    res.sendFile(join(__dirname, "../public/home.html"));
    
  }else{
    res.sendFile(join(__dirname, "../public/register.html"));
  }
};

const getLoginFailiure = (req, res) => {
  logger.error.error("Falla en el registro.")
  res.render("login-error");
};

const getRegisterFailiure = (req, res) => {
  res.render("signup-error");
};

const getHome = (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(join(__dirname, "../public/home.html"));
  }else{
    return res.redirect("/login");
  }
};

const getAddProducto = (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(join(__dirname, "../public/pages/addProduct.html"));
  }else{
    return res.redirect("/login");
  }
};

const logOut = (req, res) => {
  logger.info.info("Logged out");
  req.logout(() => {
    return res.redirect("/login");
  });
};

const getUsrData = (req, res) => {
  if (req.isAuthenticated()){
    const user = {
      username: req.user.username,
      firstname: req.user.firstname,
      address: req.user.address,
      age: req.user.age,
      telephone: req.user.telephone,
      picture: req.user.picture
    }
    logger.info.info("getUsrData: "+user.username)
    res.send({ user })
  }
}

export const authController = {
  getLogin,
  getRegister,
  getLoginFailiure,
  getRegisterFailiure,
  getAddProducto,
  logOut,
  getUsrData,
  getHome
};
