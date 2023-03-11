import express from "express";
import router from "../routes/index.js"
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();

app.use(express.static(__dirname + "/public"))

app.use("/", router);
app.listen(process.env.PORT || 3000, () =>  {
    console.log(`Server listening port ${process.env.PORT}`);
})


app.on("error", (error) => {
    console.log(error);
})

