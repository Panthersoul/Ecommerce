import { fireProdsDb, fireCartsDb } from "../firestoreDB/firestoreContainer.js";
import { mongoProdsDb, mongoCartsDb } from "../MongoDB/mongoContainer.js";

import dotenv from "dotenv";
dotenv.config();

const dbSelector = process.env.DB_SELECT // Selector de BD


const prodsDbFire = new fireProdsDb();
const cartDbFire = new fireCartsDb();
const cartDbMongo = new mongoCartsDb();
const prodsDbMongo = new mongoProdsDb();

export const dbConnections = dbSelector === "1" ? [cartDbFire, prodsDbFire] :  [cartDbMongo, prodsDbMongo];