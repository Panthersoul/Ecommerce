import { Console } from "console";
import fs from "fs";


const creandoArchivo = async (fileName) => {
    try {
      await fs.promises.writeFile(fileName, "[]");
    } catch (error) {
      throw error;
    }
  };

const existeArchivo = async (fileName) => {
    const stats = fs.existsSync(fileName);
  
    if (stats == false) {
      console.log(`Creacion del archivo: ${fileName}`);
      await creandoArchivo(fileName);
    }
  };

class Carro{

    constructor(filename){
      this.fileName = filename;
    }


   async save(carro){
    try{
        await existeArchivo(this.fileName);
        const contenido = JSON.parse(await fs.promises.readFile(this.fileName))
        
        let longitud = contenido.length;
        let index = 0
        
            if (longitud == 0) {
                index = 1;
              } else {
                index = contenido[longitud - 1].id + 1;
              }
            
            carro.id = index;
            contenido.push(carro);
            
            await fs.promises.writeFile(this.fileName, JSON.stringify(contenido));
            return carro.id
  
    }catch(error){
        throw error
    }  
   }

   async addProductsToCart(id, product){
    try {
        

        console.log("producto :"+ JSON.stringify(product));
        const contenido = JSON.parse(await fs.promises.readFile(this.fileName))

        contenido.forEach(element => {
          let idCarro = Number(id.id);
          
          if (Number(element.id) == idCarro) { 
              element.productos.push(JSON.stringify(product));
              
            }
     });

     await fs.promises.writeFile(this.fileName, JSON.stringify(contenido));

    }catch(error){
      throw error
    }
  }


    async getById(id){
       try{

        const contenido = await fs.promises.readFile(this.fileName)
        const objeto = JSON.parse(contenido)
        let productoReturn = "undefined";

        objeto.forEach(element => {
          if (element.id == id) { productoReturn = element; }
        });

        return productoReturn;
        
       }catch(error){
            throw error
       }
   }

async getAll(){
    try{
        await existeArchivo(this.fileName)
        const contenidoCrudo = await fs.promises.readFile(this.fileName)
        const contenido = JSON.parse(contenidoCrudo)
        return contenido;
    }catch(error){
        console.log("Error en getAll: ", error)
        return [];
    }
   }

   async modifyById(id, producto){
     await existeArchivo(this.fileName);
     const contenido = await fs.promises.readFile(this.fileName)
     const objeto = JSON.parse(contenido)
     objeto.forEach(element => {
       if (element.id == JSON.stringify(id)) { 
              element.timestamp = Date.now();
              element.nombre = producto.nombre;
              element.descripcion = producto.descripcion;
              element.código = producto.codigo;
              element.foto = producto.foto;
              element.precio = producto.stock;
              element.stock = producto.stock;
        }
        else{
          throw new Error("No existe el producto con ese ID")
        }
     });

     let obj = await fs.promises.writeFile(this.fileName, JSON.stringify(objeto));
     
     return objeto;

   }
   
   async deleteById(id){
       try{
          const contenido = await fs.promises.readFile(this.fileName)
          const contenidoParseado = JSON.parse(contenido)
          let arrayFiltrado = contenidoParseado.filter((x) => x.id !== Number(id))
          console.log("Delete cart by ID" + arrayFiltrado);
          await fs.promises.writeFile(this.fileName, JSON.stringify(arrayFiltrado));
          return "Borrado"
       }catch(error){
        throw error
       }
   }

   async deleteProductsFromCart(id, idProduct){
    try {
      const contenido = await fs.promises.readFile(this.fileName);
      const contenidoParseado = JSON.parse(contenido);
      let quitar = "undefined";
        
        
      let arrais = "undefinded";
      let resultado = "undefined";
        contenidoParseado.forEach((element) => {
            if (element.id == Number(id)){
              arrais = element.productos.filter((x) => x.id !== id)
              resultado = arrais.filter((y) =>  JSON.parse(y).id !== idProduct );
              element.productos = resultado;
            }
          })
      await fs.promises.writeFile(this.fileName, JSON.stringify(contenidoParseado));
      return "borrado"
    }catch(error){
      throw error
    }
  }
   async deleteAll(){
       await creandoArchivo(this.fileName)

   }
}



export default Carro;

