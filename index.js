const PORT = process.env.PORT || 5000;
var http = require("http");

const express = require("express");
const bodyParser = require("body-parser");
var fs = require("fs");
const app = express();
//JSON File
var addedMessages = require("./guestbookdata.json");

// EJS
app.set("view engine", "ejs");
app.locals.pretty = true;

//Public static files
app.use(express.static("views/pages/"));

// Parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// EJS file routes

//Frontpage
app.get("/", function (req, res) {
  res.render("pages/index");
});

//Guestbook
app.get("/guestbook", function (req, res) {
  res.render("pages/guestbook", { messages: addedMessages });
});

//New Message, HTML form
app.get("/newmessage", function (req, res) {
  res.render("pages/newmessage");
});

//Ajax Message
app.get("/ajaxmessage", function (req, res) {
  res.render("pages/ajaxmessage");
});

// Error Message
app.get("*", function (req, res) {
  res.render("pages/error");
});

// POST normal message
app.post("/newmessage", function (req, res) {
  const data = require("./guestbookdata.json");

  data.push({
    Name: req.body.name,
    Country: req.body.country,
    Message: req.body.message,
  });

  //Convert to string
  var jsonStr = JSON.stringify(data);

  //Write in file
  fs.writeFile("./guestbookdata.json", jsonStr, (err) => {
    if (err) throw err;
    console.log("Message saved!");
  });
  res.redirect("/guestbook");
});

// POST AJAX Message
app.post("/ajaxmessage", function (req, res) {
  const ajaxdata = require("./guestbookdata.json");

  ajaxdata.push({
    Name: req.body.name,
    Country: req.body.country,
    Message: req.body.message,
  });

  //Convert to string
  var jsonStr = JSON.stringify(ajaxdata);

  //Write in file
  fs.writeFile("./guestbookdata.json", jsonStr, (err) => {
    if (err) throw err;
    console.log("Message saved!");
  });
  var message = req.body.message;
  res.send(
    "Kiitos viestistäsi: " + message + " Viestisi löytyy nyt Guestbook-sivulta."
  );
});

//Webserver
app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);
});
