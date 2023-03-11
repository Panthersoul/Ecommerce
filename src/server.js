import express from "express";
import router from "../routes/index.js"

const app = express();

app.use(express.static(__dirname + "/public"))

app.use("/", router);
app.listen(process.env.PORT || 3000, () =>  {
    console.log(`Server listening port ${process.env.PORT}`);
})


app.on("error", (error) => {
    console.log(error);
})

