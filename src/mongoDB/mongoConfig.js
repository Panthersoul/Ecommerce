import mongoose from "mongoose";
import dotenv from "dotenv";
import yargs from "yargs";
dotenv.config();

//const URL = process.env.MONGO_DB_URL;
let URL = "";

const args = yargs(process.argv.slice(2))
    .alias({
        a: "ambiente",
        m: "mode"
    })
    .default({
        ambiente: "CLOUD",
        mode: "fork",        
    }).argv;


    
    if (args.ambiente.toUpperCase() === "LOCAL")
      {
        URL = process.env.MONGO_DB_LOCAL
        console.log("DB-LOCAL");
      }else{
        URL = process.env.MONGO_DB_URL
        console.log("DB-CLOUD");
      }


let connection =  mongoose.connect(URL, {useNewUrlParser: true,useUnifiedTopology: true});

// Exporto la conexion
export const db = mongoose.connection;

// Declaro modelos de datos
// Productos
const productsSchema = new mongoose.Schema({
     nombreProducto: {type: String, require: true, max: 100},
     descripcionProducto: {type: String, requiere: true, max:200},     
     codigoProducto: {type: String, require: true, max:100},
     urlFotoProducto: {type: String, require: true, max: 100},
     precioProducto: {type: Number, require: true},
     stockProducto: {type: Number, require: true}
});

// Carrito
const cartsSchema = new mongoose.Schema({
    products: {type: Array, require: true}
});


//Exporto los modelos de datos
export const productos = mongoose.model("productos", productsSchema);
export const carrito = mongoose.model("carrito", cartsSchema);