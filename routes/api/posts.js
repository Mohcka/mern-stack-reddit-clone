const express = require("express");
const app = express();
const PostRouter = express.Router();
const mongoose = require("mongoose");
const Post = require("../../models/Post.model");
const User = require("../../models/Users.model");
const Comment = require("../../models/Comment.model");

const PAGE_LIMIT = 2;

// Show all posts
PostRouter.route("/").get(function(req, res) {
  Post.find()
    .sort("-created_at")
    .populate("poster", "_id username")
    .limit(2)
    .exec(function(err, posts) {
      if (err) {
        console.log(err);
      } else {
        res.json(posts);
      }
    });
});

// Grab limited number of posts to be presented for each page
PostRouter.route("/page/:page").get(function(req, res) {
  Post.find()
    .sort("-created_at")
    .populate("poster", "_id username created_at updated_at")
    .limit(PAGE_LIMIT)
    .skip(PAGE_LIMIT * (req.params.page - 1))
    .exec(function(err, posts) {
      if (err) {
        console.log(err);
      } else {
        res.json(posts);
      }
    });
});

// Get count of all posts in DB
PostRouter.route("/count").get(function(req, res) {
  Post.find().count((err, count) => {
    res.json({ count: count });
  });
});

// TODO: Router for grabbing user and their posts
PostRouter.route("/user/:id/posts/:page?").get((req, res) => {
  let pageNmbr = req.params.page;

  User.findById(req.params.id, "_id username")
    .populate("posts", "poster")
    .limit(PAGE_LIMIT)
    .skip(PAGE_LIMIT * (pageNmbr ? pageNmbr - 1 : 0))
    .exec(function(err, posts) {
      if (err) {
        console.log(err);
      } else {
        console.log(`sent`);
        res.json(posts);
      }
    });
});

//TODO get posts relative to user
PostRouter.route("/user/:user_id").get((req, res) => {
  Post.find({ poster: req.params.user_id})
  .select("-comments")
    .populate("poster", "username")
    .exec((err, posts) => {
      res.json(posts);
    });
});

// Get post by id
PostRouter.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Post.findById(id)
  .populate("poster", "username")
  .exec( function(err, post) {

    res.json(post);
  });
});

// Get post by id with their comments
PostRouter.route("/:id/comments").get(function(req, res) {
  let id = req.params.id;

  Post.findById(id)
    .populate("comments poster")
    .exec(function(err, post) {
      res.json(post);
    });
});

// Add a post
PostRouter.route("/add").post(function(req, res) {
  let post = new Post(req.body);

  post
    .save()
    .then(post => {
      // Push post to users posts
      User.findById(post.poster[0], function(err, user) {
        user.posts.push(post);
        user
          .save()
          .then(err => {
            console.log("Post saved");
          })
          .catch(err => {
            console.error(err);
          });
      });

      res.status(200).json({ post: "post added successfully" });
    })
    .catch(err => {
      console.error(err);

      res.status(400).send("adding new post failed");
    });
});

// Update a post
PostRouter.route("/edit/:id").post(function(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: "Must be logged in" });
  }

  Post.findById(req.params.id, function(err, post) {
    if (!post) return res.status(404).send("data is not found");

    post.post = req.body.post;
    post.title = req.body.title;
    post.updated_at = Date.now();

    if (req.user._id == post.poster[0]._id) {
      post
        .save()
        .then(post => {
          res.json({ message: "Post updated!", post: post });
        })
        .catch(err => {
          res.status(500).json({
            error:
              "An internal server error has occured, please try again later"
          });
        });
    } else {
      res
        .status(401)
        .json({ error: "You do not have the credentails to change this post" });
    }
  });
});

// Delete post and any comments related to them
PostRouter.route("/delete/:id").delete((req, res) => {
  console.log(req.params.id);
  Post.findById(req.params.id, (err, post) => {
    console.log(`aaa`);

    if (err) console.error(err);
    if (!post) {
      console.log(`user invalid`);

      return;
    }

    // find all comments associated with this post
    Comment.find({ post: req.params.id }, (err, comments) => {
      if (err) {
        console.log("ERR");

        console.error(err);
        return res.status(500).json({ error: "500 Err" });
      }

      // comments.map(comment => {
      //   comment_ids.push(mongoose.Types.ObjectId(comment._id));
      // });
      let comment_ids = comments.map(c => c._id);

      // Find users associated to the comments found in post to be deleted
      // then remove the comments from user's comments array
      User.find({ comments: { $in: comment_ids } }, (err, users) => {
        if (err) console.error(err);

        // loop through and remove any comment from the user.comments list
        users.map((user, i) => {
          comment_ids.map(comment_id => {
            if (user.comments.includes(comment_id))
              user.comments.splice(comment_id, 1);
          });

          user.save().then(user => {
            console.log(`Comments deleted for user`);
            Comment.deleteMany({ post: req.params.id }, err => {
              if (err) console.error(err);
              else console.log(`comments deleted from db`);
            });
            console.log("no");
          });
        });
      });
    }).then(response => {
      // whether or not anny comments were found
      // then -> delete post
      console.log("wat");
      console.log(post);

      Post.findByIdAndRemove(post._id, err => {
        if (err) console.error(err);
      });
    });
  })
    .then(post => {
      res.json({ message: "Post deleted" });
    })
    .catch(err => {
      console.error(err);
      res.json({ error: "Internal server error" });
    });
});

// Handle voting reqeusts
PostRouter.route("/:id/vote").post((req, res) => {
  const { vote } = req.body;
  let user_id = req.user ? req.user._id : null;
  User.findById(user_id, (err, user) => {
    if (err) console.error(err);

    if (!user) {
      return res.json({ message: "ya gotta log in" });
    } else {
      Post.findById(req.params.id, (err, post) => {
        if (err) console.error(err);

        let userVote = user.votes.filter(currUserVote => {
          return currUserVote.vote_id == `${post._id}`;
        });

        let voteIndex = user.votes.indexOf(userVote[0]);

        if (userVote.length === 0) {
          console.log(`add vote`);
          post.votes += vote;
          user.votes.push({ vote_id: post._id, vote: vote });
        } else {
          console.log(userVote[0]);
          console.log(vote);

          if (userVote[0].vote != vote) {
            // opposite vote, change vote
            console.log(`change vote`);
            user.votes[voteIndex] = { vote_id: post._id, vote: vote }; // replace user vote
            post.votes += vote * 2; // offset for the vote switch is by 2
          } else {
            // cancel vote
            console.log(`remove vote`);
            post.votes -= vote;
            // Find index of the users vote
            // Use index to splice users vote
            user.votes.splice(voteIndex, 1);
          }
        }

        post.save();

        user
          .save()
          .then(user => {
            console.log(`Vote Success`);
            res.json({ votes: post.votes });
          })
          .catch(err => {
            console.error(err);

            res.json({ error: err });
          });
      });
    }
  });
});

PostRouter.route("/:id/vote_check/:user_id").get((req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    
    let userVotePair = user.votes.filter(vote => {
      return vote.vote_id == req.params.id;
    });

    console.log(userVotePair);

    res.json(userVotePair);
  });
});

module.exports = PostRouter;
