import express, { Router } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import moment from 'moment';
import Productos from "../class/product.js";
import { Console } from "console";
import { dbConnections } from "../daos/daos.js"
import logger from "../lib/logger.lib.js"

// dbConnections[0] es el carrito
// dbConnections[1] productos


const prods = new Productos("./productos.txt");

const __dirname = dirname(fileURLToPath(import.meta.url));
const routerProd = Router();

routerProd.use(express.json());
routerProd.use(express.urlencoded({ extended: true }))

const admin = true;

const validarAdmin = (req, res, next) => {
   
    /*
    req.user = {
      fullName: "Andres",
      isAdmin: true
    };
    */

   if (admin){
    next()
   }else{
    logger.error.error(`Ruta ${req.path} método ${req.method} no autorizada`)
    res.json({
        error: -1,
        description: `Ruta ${req.path} método ${req.method} no autorizada`
    })
   }
    
  };



routerProd.get('/', validarAdmin, (req,res) => {   
    if (req.isAuthenticated()){
        const mostrarProductos = async () => {
        try{
            const data = await dbConnections[1].getAll();
            logger.info.info("Send /api/products/*")
            res.json(JSON.stringify(data))
        }catch(error){
            logger.error.error(error)
            throw new Error(error)
        }
    }
    mostrarProductos();
    }else{
        logger.info.info("Usuario no autenticado");
        return res.redirect("/login");
    }
})

routerProd.get('/:id', validarAdmin, (req, res) => {
    if (req.isAuthenticated()){
    const traerProductos = async () => {
        try{            
                const data = await dbConnections[1].getById(req.params.id)  
                return res.json(data);
        }catch(error){
            logger.error.error(error)
            throw new Error(error)
        }
    };
    traerProductos()
            }else{
        logger.info.info("Usuario no autenticado")
    }
})


routerProd.post('/', validarAdmin, (req,res) => {  
    if (req.isAuthenticated()){  
    const agregarProducto = async() => {
        try{
            const data = await dbConnections[1].save(req.body)
            logger.info.info(`Se agrego el producto: `+ JSON.stringify(req.body))
            return res.redirect('/productos')
        }catch(error){
            logger.error.error(error)
            throw new Error(error)
        }
    }
    agregarProducto()
    }else{
        logger.info.info("Usuario no autenticado")
        return res.redirect("/login");
    }
})

routerProd.put('/:id', validarAdmin, (req,res) => {    
    if (req.isAuthenticated()){
    const modificarProducto = async() => {
        try{
            const data = await dbConnections[1].updateById(req.body._id, JSON.stringify(req.body))
            logger.info.info(`Producto actualizado: ${req.body._id}`)
            return res.json("Se ha modificado.")
        }catch(error){
            logger.error.error(error)
            throw new Error(error)
        }
    }
    modificarProducto()
        }else{
        logger.info.info("Usuario no autenticado");
        return res.redirect("/login");
        }
    })


routerProd.delete('/:id', validarAdmin, (req, res) => {
    if (req.isAuthenticated()){
    const borrarProductos = async () => {
        try{
            const data = await dbConnections[1].deleteById(req.params.id)
            logger.info.info(`Producto eliminado`)
            return res.json(data)      
        }catch(error){
            logger.error.error(error)
            throw new Error(error)
        }
    };
    borrarProductos()
    }else{
        logger.info.info("Usuario no autenticado")
        return res.redirect("/login")
    }
})


export default routerProd;