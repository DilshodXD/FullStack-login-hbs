const express = require("express");
const app = express();
const dotenv = require('dotenv')
const mysql = require('mysql')

app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: false}))
app.use(express.json())

dotenv.config({path: "./.env"})

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST ,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
})

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
})

app.use('/', require('./routes/routes'))
app.use("/auth", require('./routes/auth'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("server listen on port" + PORT));