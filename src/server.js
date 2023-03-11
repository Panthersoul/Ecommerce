import express from "express";
import router from "../routes/index.js"

const app = express();

console.log("estoy arriba");

app.use("/", router);
app.listen(process.env.PORT || 3000, () =>  {
    console.log(`Server listening port ${PORT}`);
})


app.on("error", (error) => {
    console.log(error);
})

