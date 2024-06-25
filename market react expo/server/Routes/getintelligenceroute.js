const express = require("express")
const { getmarketintelligence } = require("../contoller/marketintelligence")

const router = express.Router()


router.post("/getmarketintelligence",getmarketintelligence)

module.exports = router