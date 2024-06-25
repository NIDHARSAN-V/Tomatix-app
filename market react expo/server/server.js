const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const marketintelligenceroute = require("./Routes/getintelligenceroute")

const PORT = 5500;

const app = express()

app.use(express.json());
app.use(cors());


app.use('/api',marketintelligenceroute)

app.listen(PORT, function () {
    console.log(`Server running at ${PORT}`);
  });
  


