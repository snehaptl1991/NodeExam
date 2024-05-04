const express = require('express')

const authroute=require("./api/index") 

const app = express()
const port = 5006
// app.use(express.json())
app.use("/api/",authroute) //Route to the api folder

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})