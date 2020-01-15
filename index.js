const express = require("express");
const db = require("./data/db.js");

const server = express();

server.listen(443, () => {
  console.log("*** listening on port 443");
});

//middleware
server.use(express.json());

server.get("/", (req, res) => {
  res.send("hello world!");
});

// creates new user using info sent inside req.body
server.post("/api/users", (req, res) => {
  const userInfo = req.body;

  db.insert(userInfo)
    .then(user => {
      res.status(201).json({ success: true, user });
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});
