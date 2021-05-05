import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes/index.js"

const app = express();

dotenv.config()

const port = process.env.PORT || 5050;


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, UPDATE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(express.json());
app.use(bodyParser.json());
app.use(router);

app.listen(port, () => {
    console.log(`Our app is available on port ${port}`)
})