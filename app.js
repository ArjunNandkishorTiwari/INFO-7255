const express = require("express");
const app = express();
const port = 3000;
const db = require("./api/services/plans");
const bodyParser = require("body-parser");
const routerPlan = require("./api/routes/plans");

db.connectionDB();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(bodyParser.json());
app.use("/plans",routerPlan);




app.listen(port, ()=> {
    console.log(`Server started at port ${port}`)
});