
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('dating.sqlite');


db.serialize(() => {
  
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT,salt TEXT, age INTEGER, image TEXT, desc TEXT, logical INTEGER DEFAULT 0, introvert INTEGER DEFAULT 0, sensitive INTEGER DEFAULT 0, organized INTEGER DEFAULT 0)");

  
  db.run("INSERT INTO users(username, password, age, image, desc) VALUES ('Sioned', 'password', 24, 'ME.jpg', 'Looking for some love')");


  console.log('success');

  db.each("SELECT * FROM users", (err, row) => {
      console.log(row.username + ": " + row.age + ' - ' + row.desc);
  });
});

db.close();
