const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//MySQl
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  //password: "password",
  database: "nodejs_beers",
});

//Get all beers
app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    //query(sqlString, callback)
    connection.query("SELECT * from beers", (err, rows) => {
      connection.release(); //return the connection to the pool

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    });
  });
});

//get a beer by ID
app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    //query(sqlString, callback)
    connection.query(
      "SELECT * from beers WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); //return the connection to the pool

        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
      }
    );
  });
});

//Delete a records / beer
app.delete("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    //query(sqlString, callback)
    connection.query(
      "DELETE from beers WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); //return the connection to the pool

        if (!err) {
          res.send(
            `Beer with the Record ID: ${[req.params.id]} has been removed.`
          );
        } else {
          console.log(err);
        }
      }
    );
  });
});

//Add a record / beer
app.post("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    const params = req.body;

    connection.query("INSERT INTO beers SET ?", params, (err, rows) => {
      connection.release(); //return the connection to the pool

      if (!err) {
        res.send(`Beer with the Record ID: ${params.name} has been added.`);
      } else {
        console.log(err);
      }
    });
    console.log(req.body);
  });
});

//update a record / beer
app.put("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    const { id, name, tagline, description, image } = req.body;

    connection.query(
      "UPDATE beers SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?",
      [name, tagline, description, image, id],
      (err, rows) => {
        connection.release(); //return the connection to the pool

        if (!err) {
          res.send(`Beer with the Record ID: ${name} has been updated.`);
        } else {
          console.log(err);
        }
      }
    );
    console.log(req.body);
  });
});

//listen on environment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`));
