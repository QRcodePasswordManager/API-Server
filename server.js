"use strict";
var express = require('express');
var app = express();
var fs = require("fs");
var id = 1;
var sessions = {};
var data = {}

// Session state info
class Session {
  constructor(id, domain, client_key) {
    this.id = id;
    this.domain = domain;
    this.client_key = client_key;
  }
  
  registerCipheredCredentials(user,password) {
    this.user = user;
    this.password = password;
  }
}

app.post('/sessionCreator', function (req, res) {
   sessions[id] = {"domain": req["domain"], "client_key": req["client_key"] }; // lacks proof of id
   data = {};
   data["session_id"] = id;
   id++;
   console.log(data);
   res.end(JSON.stringify(data));
});

app.get('/session/:id', function (req, res) {
   var rcv_id = req.params.id;
   var authentication = req["identification"];

   var session = sessions[rcv_id];
   console.log("Received id: " + rcv_id);
   // lacks identity verification
   if(session !== undefined && session.hidden_user !== undefined) {
      data = {};
      data["hidden_user"] = session["hidden_user"];
      data["hidden_password"] = session["hidden_password"];
      console.log("Session " + rcv_id + " concluded");
      res.end(JSON.stringigy(data));
   } else {
      res.end();
   }
});

app.post('/session/:id', function (req, res) {
   session = sessions[req.params.id];
   if(session === undefined) {
       console.log("undefined session");
       res.end();
   }
   console.log("Post received");
   session["hidden_user"] = req["hidden_user"];
   session["hidden_password"] = req["hidden_password"];
   sessions[req.params.id] = session;
   res.end();
   console.log(sessions);
});

   

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
