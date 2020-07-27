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

router.get("/:username/:postcode", (req, res) => {
  const username = req.params.username;
  const postcode = req.params.postcode;

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
        return;
      }

      const posts =
        response.body.graphql.user.edge_owner_to_timeline_media.edges;
      let selectedPost = null;
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        if (post.node.shortcode == postcode) {
          selectedPost = post;
          break;
        }
      }
      if (selectedPost == null) {
        res.render("error", { message: "Post not found!" });
        return;
      }
      res.render("post", selectedPost);
      /*res.json({
        confirmation: "success",
        data: selectedPost,
      }); */
    });
});
module.exports = router;
