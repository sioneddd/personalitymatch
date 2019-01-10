const express = require('express');
const app = express();
app.use(express.static('static_files'));

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database('./dating.sqlite');


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));




app.post("/uCheck", (req, res) => {
  db.all(
    'SELECT * FROM users WHERE username=$username AND password=$password',
  {
    $username: req.body.username,
    $password: req.body.password
  },
(err, rows) => {
  if(err){
    console.log("error");
  } else {
    console.log("success");
    console.log(rows);
    
    

    if(rows.length > 0){
      const userData = {
        username: rows[0].username,
        age: rows[0].age,
        image: rows[0].image,
        desc: rows[0].desc,
        logical: rows[0].logical,
        introvert: rows[0].introvert,
        sensitive: rows[0].sensitive,
        organised: rows[0].organized
      }
      res.send(userData);
    } else {
      res.send("0");
    }
    
  }
})
})

app.post("/signup", (req, res) => {
  db.all(
    
    'INSERT INTO users(username, password, age, image, desc) VALUES($username, $password, $age, $image, $desc)',
    {
      $username: req.body.username,
      $password: req.body.password,
      $age: req.body.dob,
      $image: req.body.image,
      $desc: req.body.desc,
     
    },
    (err) => {
      if(err){
        console.log("insert error: " + err);
        
      } else {
        console.log("insert success");
        res.send("1");

      }


      
    }
  )
})

app.post("/quizSubmit", (req, res) => {
  db.run(
    'UPDATE users SET logical = $log, introvert = $int, sensitive = $sen, organized = $org WHERE username = $username',
    {
      $log: req.body.log,
      $int: req.body.int,
      $sen: req.body.sen,
      $org: req.body.org,
      $username: req.body.user
    },
    (err) => {
      if(err){
        console.log("quiz error: " + err)
      } else {
        console.log("quiz success");
        res.send("1");
      }
    }
  )
})
/*
--View entire db for debugging reasons
app.get("/db", (req, res)=>{
  db.all(
    'SELECT * FROM users',
    (err, rows) => {
      res.send(rows);
    }
  )
})*/

app.get("/getMatches", (req, res)=>{
  db.all(
    "SELECT id, username, age, desc, image FROM users WHERE username != $username",
    {
      $username: req.query.username
    },
    (err, rows) => {
      if(err){
        console.log(err)
      } else{
        res.send(rows);
      }
     
    }
  )
})

app.get("/getAttrs", (req, res) => {
  
  db.all(
    'SELECT introvert, logical, sensitive, organized FROM users WHERE username = $username',
{
  $username: req.query.username
},
(err, rows) => {
  if(err){
    console.log("attrs error: " + err)
  } else {
    console.log(rows);
    
    res.send(rows);
  }
  
})
})

app.get("/user", (req, res)=> {
  db.all(
    'SELECT username, age, image, desc, introvert, logical, sensitive, organized FROM users WHERE id = $userID',
    {
      $userID: req.query.userID
    },
    (err, rows)=>{
      if(err){
        console.log("user error: " + err);
      } else {
        console.log(rows);
        res.send(rows[0]);
      }
    }
  )
})

app.get("/orderTraits", (req,res)=>{
  const trait = req.query.trait;
  const username = req.query.username;
  console.log(username);
  var query;
  switch(trait){
    case "logical":
      query = 'SELECT id, username, age, desc, image FROM users WHERE username != "'+username+'" ORDER BY logical DESC';
      break;
    case "creative":
      query = "SELECT id, username, age, desc, image FROM users WHERE username != '"+username+"' ORDER BY logical ASC";
      break;
    case "introvert":
      query = 'SELECT id, username, age, desc, image FROM users WHERE username != "'+username+'" ORDER BY introvert DESC';
      break;
    case "extrovert":
    query = 'SELECT id, username, age, desc, image FROM users WHERE username != "'+username+'" ORDER BY introvert ASC';
    break;
    case "spontanious":
      query = 'SELECT id, username, age, desc, image FROM users WHERE username != "'+username+'" ORDER BY organized ASC';
      break;
    case "organized":
      query = 'SELECT id, username, age, desc, image FROM users WHERE username != "'+username+'" ORDER BY organized DESC';
      break;
    case "confident":
      query = 'SELECT id, username, age, desc, image FROM users WHERE username != "'+username+'" ORDER BY sensitive ASC';
      break;
    case "sensitive":
      query: 'SELECT id, username, age, desc, image FROM users WHERE username != "'+username+'" ORDER BY sensitive DESC';
      break;
  }
  db.all(
    query,
    (err, rows) => {
      if(err){
        console.log("order by traits error " + err);
        console.log(query);
      } else {
        console.log(query);
        console.log(rows);
        res.send(rows);
      }
    }
  )
})
  
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
