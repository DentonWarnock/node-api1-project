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
