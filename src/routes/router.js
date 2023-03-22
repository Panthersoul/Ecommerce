import express, {Router} from "express";
import passport from "passport";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import Productos from "../class/product.js";
import { authController } from "../controller/loginController.js";
import upload from "../lib/multer.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router();



router.get("/", authController.getLogin)
router.get("/login", authController.getLogin);
router.post("/login",  passport.authenticate("login", { failureRedirect: path.join(__dirname,'./error') }), authController.getLogin); //paso la estrategia  de autenticacion como middleware y luego el controller
router.get("/register", authController.getRegister);
router.post("/register",upload.single('picture'), passport.authenticate("register", { failureRedirect: path.join(__dirname,'./error') }), authController.getRegister);

router.get("/logout" , authController.logOut);

router.get("/home", authController.getHome, (req, res) => {
    res.sendFile(path.join(__dirname,'../public/pages/index.html'));    
})

router.get('/productos', authController.getAddProducto, (req, res) => {
    res.sendFile(path.join(__dirname,'../public/pages/addProduct.html'));    
})

router.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname,'../public/pages/listProducts.html'));
})

router.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname,'../public/pages/cart.html'));
})

router.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname,'../public/pages/userDetails.html'));
})

router.get('/getUsrData', authController.getUsrData);

router.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname,'../public/error.html'));
})



export default router;