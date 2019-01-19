const mongoose = require('mongoose');
const User = require('../models/userModel').User;
const saveUser = function(req, res){
  const username = req.body.username;
  User.find({"username": username}, (err, data) => {
    if(!data.length){
      User.create({"username": username}, (err, data) => {
        if(err){
          res.send(err);
        } else {
          res.json(data);
        }
      })
    } else {
      res.send("username already taken")
    }
  })
}

module.exports = { saveUser: saveUser}