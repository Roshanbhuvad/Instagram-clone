// Full Documentation - https://docs.turbo360.co
const express = require("express");
const router = express.Router();
const superagent = require("superagent");

router.get("/", (req, res) => {
  const data = {
    text: "Instagram Clone!",
    greeting: "Welcome !",
  };
  res.render("index", data);
});

router.get("/:username", (req, res) => {
  const username = req.params.username;
  const instagramAPI = "https://www.instagram.com/" + username + "/?__a=1";

  superagent
    .get(instagramAPI)
    .query(null)
    .set("Accept", "application/json")
    .end((err, response) => {
      if (err) {
        const data = {
          message: err.message || "Check you Spelling!",
        };
        res.render("error", data);
        /*res.json({
          confirmation: "fail",
          message: err.message,
        }); */
        return;
      }
      res.render("index", response.body);
      /*res.json({
        confirmation: "success",
        data: response.body,
      }); */
    });
});

router.get("/p/:post", (req, res) => {});
module.exports = router;
