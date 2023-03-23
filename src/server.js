import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";
import dotenv from "dotenv";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import router from "./routes/router.js";
import routerProd from "./routes/routerProd.js";
import routerCart from "./routes/routerCart.js";

import os from "os";
import cluster from "cluster";
import { passportStrategies } from "./lib/passport.lib.js";
import exphbs from "express-handlebars";
import { User } from "./models/user.model.js"
import logger from "./lib/logger.lib.js";


//cargo las variables de entorno
dotenv.config();

const cpus = os.cpus();

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const args = yargs(process.argv.slice(2))
    .alias({
        p: "puerto",
        a: "ambiente",
        m: "mode"
    })
    .default({
        puerto: "8080",
        ambiente: "local",
        mode: "fork", 
    }).argv;


if (cluster.isPrimary && args.mode.toUpperCase() === "CLUSTER")
{
  cpus.map(() => {
    cluster.fork();
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

}else{
        const app = express();

        app.use(
            session({
              secret: process.env.SESSION_SECRET,
              resave: false,
              rolling: true,
              saveUninitialized: false,
            })
          );


        //app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main.hbs" }));
        //app.set("view engine", ".hbs");



        // EL PASSPORT DEBE IR ANTES DEL ROUTER
        app.use(passport.initialize());
        app.use(passport.session());

        passport.use("login", passportStrategies.loginStrategy);
        passport.use("register", passportStrategies.registerStrategy);
        
        passport.serializeUser((user, done) => {
            return done(null, user._id);
          });

        passport.deserializeUser(async (id, done) => {  
            try {
              const user = await User.findById(id);
            } catch (error) {
              console.log(error);
            }
            const user = await User.findById(id)
            .then((data) => {
              done(null, data)
            })
          })
        //////////////////////////////////////////////


        app.use(express.json())
        app.use(express.urlencoded({extended: true}));        
        app.use(express.static(__dirname + "/public"));
        
        //Devuelvo la carpeta pública de imagenes, solo si esta autenticado
        app.use("/uploads", (req, res) => {
          if (req.isAuthenticated()){
            express.static(__dirname + "/public/upload")
          }
        })

        app.use('/', router);        
        app.use('/api/productos', routerProd);
        app.use('/api/carrito', routerCart);
        app.use((req,res) => {


          logger.error.error(`Ruta ${req.path} metodo ${req.method} no implementada`)
          logger.info.info(`Ruta ${req.path} metodo ${req.method} no implementada`)
            res.json({
                error: -2,
                description: `Ruta ${req.path} metodo ${req.method} no implementada`
            })

        })

        const PORT = process.env.PORT || 8080
        app.listen(PORT, () => {
            logger.info.info(`Server listening in port ${PORT}`)

        })

        app.on("error", error => logger.error.error(`Error en servidor ${error}`))

    }