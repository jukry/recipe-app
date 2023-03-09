import express from "express"
import bp from "body-parser"
import morgan from "morgan"
import recipesRouter from "./routes/recipes.js"
import connectDB from "./config/conn.js"
import mongoose from "mongoose"
const app = express()

app.use(bp.urlencoded({ extended: true }))

//middleware
app.use(bp.json())

app.use(morgan("dev"))

/* const db = connectDB()
console.log(db) */

const port = process.env.port || 5000

app.get("/", (req, res) => {
    res.send("Main page")
})

// /recipes prefix ettei tarvitse recipes.js puolella määritellä
app.use("/recipes", recipesRouter)

const db = connectDB()
db.then(() => {
    app.listen(port, () =>
        console.log(`Connected to db. Server running on port ${port}`)
    )
}).catch((error) => {
    console.log(error)
})

/* 
export default db
 */
