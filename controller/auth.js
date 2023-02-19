const mysql = require("mysql");
const bcryptjs = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  db.query(
    "SELECT `email` FROM `users` WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) throw err;
      if (name < 0) {
        return res.render("register", {
          message: "please enter a valid name",
        });
      } else if (result.length > 0) {
        return res.render("register", {
          message: "that email is already tokened",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "passwords do not match",
        });
      }
      let hashPassword = await bcryptjs.hash(password, 8);
      db.query(
        "insert into users set ?",
        { name: name, password: hashPassword, email: email },
        (err, result) => {
          if (err) throw err;
          else if (result) console.log(result);
          return res.render("register", {
            message: "register successful",
          });
        }
      );
    }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      if (!email) {
        return res.status(400).res.render("login", {
          message: "please enter email",
        });
      } else if (!password) {
        return res.status(400).res.render("login", {
          message: "please enter password",
        });
      }
    }
    db.query(
      "SELECT * FROM `users` WHERE email = ?",
      [email],
      async (err, result) => {
        console.log(result);
        if(!result || !(await bcryptjs.compare(password, result[0].password))){
          return res.status(401).res.render("login", {
            message: "invalid email or password",
          });
        }else {
          const id = result[0].id
          res.status(200).render("index")
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
