const express = require("express");
const db = require("./data/db.js");
const cors = require("cors");

const server = express();

server.listen(443, () => {
  console.log("*** listening on port 443");
});

//middleware
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("hello world!");
});

// POST new user - creates new user using the info sent inside req.body
server.post("/api/users", (req, res) => {
  const userInfo = req.body;

  if (!userInfo.name || !userInfo.bio) {
    res.status(400).json({
      success: false,
      errorMessage: "Please provide name and bio for the user."
    });
  } else {
    db.insert(userInfo).then(user => {
      db.findById(user.id)
        .then(response => {
          if (response) {
            res.status(201).json({ success: true, response });
          } else {
            res.status(404).json({
              success: false,
              message: "The user with the specified ID does not exist."
            });
          }
        })
        .catch(err => {
          res.status(500).json({
            success: false,
            errorMessage:
              "There was an error while saving the user to the database"
          });
        });
    });
  }
});

// GET users - Returns an array of all the user objects contained in the database.
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json({ success: true, users });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        errorMessage: "The users information could not be retrieved."
      });
    });
});

// GET users/:id - Returns the user object with the specified id.
server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({
          success: false,
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        errorMessage: "The user information could not be retrieved."
      });
    });
});

// DELETE users/:id - Removes the user with the specified id and returns the deleted user.
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id).then(response => {
    if (response) {
      db.remove(id)
        .then(user => {
          if (user) {
            res.status(200).json({ success: true, response });
          }
        })
        .catch(err => {
          res.status(500).json({
            success: false,
            errorMessage: "The user could not be removed"
          });
        });
    } else {
      res.status(404).json({
        success: false,
        message: "The user with the specified ID does not exist."
      });
    }
  });
});

// PUT users/:id - Updates the user with the specified id using data from the request body.
// Returns the modified document, NOT the original.
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  if (!updatedUser.name || !updatedUser.bio) {
    res.status(400).json({
      success: false,
      errorMessage: "Please provide name and bio for the user."
    });
  } else {
    db.update(id, updatedUser)
      .then(user => {
        if (user) {
          res.status(200).json({ success: true, user });
        } else {
          res.status(404).json({
            success: false,
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          errorMessage: "The user information could not be modified."
        });
      });
  }
});
