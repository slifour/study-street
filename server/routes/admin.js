const express = require("express");
const router = express.Router();
const path = require("path");
const {userList, groupList, invitationList, goalList, bookList} = require("../database");

router.get("/", (req, res) => {
  // res.send({ response: "I am admin" }).status(200);
  res.sendFile(path.join(__dirname, "../public/admin/index.html"));
});

router.get("/api/userList", (req, res) => {
  res.send(userList);
});

router.get("/api/groupList", (req, res) => {
  res.send(groupList);
});

router.get("/api/invitationList", (req, res) => {
  res.send(invitationList);
});

router.get("/api/goalList", (req, res) => {
  res.send(goalList);
});

router.get("/api/bookList", (req, res) => {
  res.send(bookList);
});


module.exports = router;