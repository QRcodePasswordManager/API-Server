"use strict";
var express = require('express');
var fs = require("fs");
var bodyParser = require("body-parser");

//server application and data
var app = express();
app.use(express.json());
var id = 1;
var sessions = {};

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

  containsCredentials() {
    return this.user !== undefined;
  }
}

//********************* REQUEST TYPES *********************//

app.post('/sessionCreator', function (req, res) {
  // still lacks proof of authenticity
  console.log("Body: " + JSON.stringify(req.body));
  sessions[id] = new Session(id, req.body["domain"], req.body["client_key"]);
  console.log("Session created: " + id);
  res.end("{\"session\": " + id + "}\n");
  id++;
  //console.log(sessions);
});

app.post('/session/:id', function (req, res) {
  var session = sessions[req.params.id];
  if(session == undefined) {
    console.log("Undefined session info received.");
  } else {
    console.log("Post received");
    session.registerCipheredCredentials(req.body["hidden_user"], req.body["hidden_password"]);
  }
  res.end();
});

app.get('/session/:id', function (req, res) {
  var rcv_id = req.params.id;
  var session = sessions[rcv_id];

  //lacks identity verification; should only send the data if the authentication token
  //is the one of the session;
  //maybe use DH?
  //var authentication = req["identification"];

  if(session !== undefined) {
    // if the session exists
    console.log("Requested Session: " + rcv_id);
    res.end(JSON.stringify(session));
  } else {
    console.log("Undefined Session requested.");
    res.end();
  }
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})
