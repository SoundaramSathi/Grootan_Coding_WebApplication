//Public Dependencies
const express = require("express");
app = express()
const cors = require('cors');

//Private Dependencies
const definedRoutes = require("./routes/index")

app.use(express.json({limit:'50mb'}))

app.use(cors());

app.use('/', definedRoutes);

app.listen(3000,()=>{console.log("app running")})
