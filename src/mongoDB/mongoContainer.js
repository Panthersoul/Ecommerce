//import mongoose from "mongoose";
import mongoose from "mongoose";
import { db, productos, carrito } from "./mongoConfig.js";
import logger from "../lib/logger.lib.js"


class mongoContainer {

    constructor(){
        this.usedModel = productos
    }

    //CRUD metodos para productos y carrito

    async save (object){
        try {
            const model = new this.usedModel(object)
            let save = await model.save();
            return save.id;
        }
        catch (err) {console.log(err)}
    };


    async getAll () {
        try {
            let data = await this.usedModel.find({})
            return data
        }
        catch (err) {console.log(err)}
    };

    async getById (id) {
        try {
            let data = await this.usedModel.find({_id: id});
            return data
        }
        catch (err) {console.log(err)}
    };

    async deleteAll () {
        try {
            let del = await this.usedModel.deleteMany({});
            return "Todos los items han sido eliminados"
        }
        catch (err) {console.log(err)}
    };

    async deleteById (id) {
        try {
            let del = await this.usedModel.deleteOne({_id: id});
            return "Item Eliminado"
        }
        catch (err) {console.log(err)}
    };

    async updateById (id, obj) {
        try {
            let upd = await this.usedModel.findOneAndUpdate({_id: id}, JSON.parse(obj));
            return "Item Modificado"
        }
        catch (err) {console.log(err)}
    }
};

export class mongoProdsDb extends mongoContainer {

    constructor(usedModel){
        super(usedModel);
        this.usedModel = productos
    }
};

export class mongoCartsDb extends mongoContainer {

    constructor(usedModel){
        super(usedModel);
        this.usedModel = carrito
    };



    async addProdToCart (cartId, product){
        try {
            let add = await this.usedModel.updateOne({_id: cartId.id}, {$push: { products: product }});
            return `Producto agregado al carrito: ${cartId}`
        }
        catch (err) {console.log(err)}
    };

    async delProdInCart (cartId, prodId){
        try{
            let del = await this.usedModel.updateOne({_id: cartId}, {$pull: {products: {_id: prodId}}} )
        }
        catch (err) {console.log(err);}  
    };

    async emptyCart (cartId){
        try{
            console.log("estoy en el empty cart");
            let del = await this.usedModel.updateOne({_id: cartId}, {"$set": {"products": [] }})
            logger.info.info("Se ha eliminado el contenido del cart: "+cartId);
        }
        catch (err) {console.log(err);}  
    }

}
