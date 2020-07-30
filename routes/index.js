const turbo = require("turbo360")({ site_id: process.env.TURBO_APP_ID });
const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID });
const express = require("express");
const router = express.Router();
//const superagent = require("superagent");
const utils = require("./utils");

router.get("/", (req, res) => {
  /*const data = {
    text: "Instagram Clone!",
    greeting: "Welcome !",
  };*/
  const username = req.params.username;
  const instagramAPI = "https://www.instagram.com/" + username + "/?__a=1";
  obj = {};
  utils.HTTP.get(instagramAPI, null)
    .then((data) => {
      res.render("main", data);
    })
    .catch((err) => {
      const data = {
        message: err.message || "Check you Spelling!",
      };
      res.render("error", data);
    });
  //console.log('body: '+ JSON.stringify(req.body));
  //res.header("Content-type", "application/json");
  //res.header("Charset", "utf-8");
  //res.send(req.query.callback + "(" + JSON.stringify(obj) + ");");
  //res.render("index", data);
});

router.get("/:username", (req, res) => {
  const username = req.params.username;
  const instagramAPI = "https://www.instagram.com/" + username + "/?__a=1";

  utils.HTTP.get(instagramAPI, null)
    .then((data) => {
      res.render("index", data);
    })
    .catch((err) => {
      const data = {
        message: err.message || "Check you Spelling!",
      };
      res.render("error", data);
    });

  /*res.json({
          confirmation: "fail",
          message: err.message,
        }); 
        return;
      }
      res.render("index", response.body); */
  /*res.json({
        confirmation: "success",
        data: response.body,
      }); */
});

router.get("/:username/:postcode", (req, res) => {
  const username = req.params.username;
  const postcode = req.params.postcode;

  const instagramAPI = "https://www.instagram.com/" + username + "/?__a=1";

  utils.HTTP.get(instagramAPI, null)
    .then((data) => {
      const user = data.graphql.user;
      const posts = user.edge_owner_to_timeline_media.edges;
      let selectedPost = null;
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        if (post.node.shortcode == postcode) {
          selectedPost = post;
          break;
        }
      }
      if (selectedPost == null) {
        throw new Error("Post not found!");
        return;
      }
      selectedPost["user"] = {
        username: user.username,
        icon: user.profile_pic_url,
      };
      res.render("post", selectedPost);
      return;
    })
    .catch((err) => {
      const data = {
        message: err.message || "Check you Spelling!",
      };
      res.render("error", data);
      return;
    });
  /*superagent
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
      const user = response.body.graphql.user;
      const posts = user.edge_owner_to_timeline_media.edges;
      //const caption =user.edge_owner_to_timeline_media.edges.node.edge_media_to_caption.edges.node;
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
      selectedPost["user"] = {
        username: user.username,
        icon: user.profile_pic_url,
        //caption: caption.text,
      };
      res.render("post", selectedPost);
      res.json({
        confirmation: "success",
        data: selectedPost,
      }); 
    }); */
});
module.exports = router;
