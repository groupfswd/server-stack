require("dotenv").config()
const express = require('express')
const app = express()
const port = process.env.port || 3000
const router = require("./routes")
const morgan = require("morgan")
const cors = require("cors")
const errorHandler = require("./middlewares/errorHandler")

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false} ))
app.use(router)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})