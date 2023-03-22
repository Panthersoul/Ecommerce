import express, { Router } from "express";
import moment from 'moment';
import Carrito from "../class/carrito.js";
import { dbConnections } from "../daos/daos.js"
import logger from "../lib/logger.lib.js"
import sendBuyRegister  from "../lib/notificarCompra.js"

const routerCart = Router();

/*Importante para recibir por BODY lo del POST*/
routerCart.use(express.json());
routerCart.use(express.urlencoded({ extended: true }))


const carrito = new Carrito("./carrito.txt");



routerCart.post('/', (req,res) => {    
   if (req.isAuthenticated()){
    const crearCarrito = async() => {
        try{
            
            let carritoNuevo = {
                timestamp: moment.now(),
                productos: []
            }
            let a = await dbConnections[0].save(carritoNuevo)
            logger.info.info(`Nuevo CART creado: {"_id":"${a}"}`)
            return res.json(`{"_id":"${a}"}`);
        }catch(error){
            logger.error.error("Error creating cart on get /: "+error)
            throw new Error(error)
        }
    }
    crearCarrito()
    }
    else{
        logger.info.info("Usuario no autenticado en create cart")
        return res.redirect("/login");
    }
})

routerCart.get('/:id/productos',(req,res) => {    
    if (req.isAuthenticated()) {
        const enviarProds = async() => {
            try{
                let cart = await dbConnections[0].getById(req.params.id);
                return res.json(cart);
            }catch(error){
                logger.error.error("Errir en get prod: "+error)
                throw new Error(error)
            }
        }
        enviarProds()
    }else{
        logger.info.info("Usuario no autenticado en get cart products")
        return res.redirect("/login");
      }
    })


   


routerCart.post('/:id/productos',(req, res) => {    
    if (req.isAuthenticated()){
    const agregarProds = async() => {
        try{
            let respuesta = await dbConnections[0].addProdToCart(req.params, req.body)         
            logger.info.info(`Item agregados al carrito: ${JSON.stringify(req.body)}`) 
            return res.json(respuesta);
        }catch(error){
            logger.error.error("Errir en post  prod: "+error)
            throw new Error(error)
        }
    }
    agregarProds()
    }else{
        logger.info.info("Usuario no autenticado en post products")
        return res.redirect("/login");
    }
})



routerCart.delete('/:id', (req, res) => {
    if (req.isAuthenticated()){
    const eliminarCarrito = async() => {
        try{
            let respuesta = await dbConnections[0].deleteById(req.params.id)
            logger.info.info(`Carrito eliminado: ${req.params.id}`) 
            return res.json(respuesta);
        }catch(error){
            logger.error.error("Error deleting cart: "+error)

            throw new Error(error)
        }
    }
    eliminarCarrito();
        } else{
            logger.info.info("Usuario no autenticado deleting cart")
            return res.redirect("/login");
        }
})

routerCart.delete('/:id/productos/:id_prod', (req, res) => {
    if (req.isAuthenticated()){
    const eliminarCarrito = async() => {
        try{
            let respuesta = await dbConnections[0].delProdInCart(req.params.id, req.params.id_prod)
            logger.info.info(`Producto eliminado del carrito: ${req.params.id_prod}`) 
            return res.json(respuesta);
        }catch(error){
            logger.error.error("Error deleting prods from cart: "+error)
            throw new Error(error)
        }
    }
    eliminarCarrito();
    }else{
        logger.info.info("Usuario no autenticado deleting prod from cart")
        return res.redirect("/login");
    }
})



routerCart.post('/buy/:id', (req, res) => {
    if (req.isAuthenticated()){
        const user = req.user;
        let respuesta ="";
        try {
            const fetchCart = async() =>{
                let cart = await dbConnections[0].getById(req.params.id);

                sendBuyRegister( [
                    {user: user.username},
                    {name: user.firstname},
                    {body: cart[0].products}
                    ]
                )
                logger.info.info(`Compra realizada, cart: ${req.params.id}`) 
                respuesta = "Compra realizada con exito";
                let deleteCart = await dbConnections[0].emptyCart(req.params.id);
            }
            fetchCart();
        } catch (error) {
            logger.info.info("Error on buy: "+error)
        }       
        
        return res.json(respuesta);       
    }else{
        logger.info.info("Usuario no autenticado para realizar la compra")
        return res.redirect("/login");
    }
})


export default routerCart;