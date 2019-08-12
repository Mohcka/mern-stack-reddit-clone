const express = require("express");
const CommentRouter = express.Router();
const Comment = require("../../models/Comment.model");
const Post = require("../../models/Post.model");
const User = require("../../models/Users.model");

//Get comment from its id
CommentRouter.route("/:id").get((req, res) => {
  Comment.findById(req.params.id)
    .populate("posts")
    .exec((err, comment) => {
      if (err) console.error(err);

      res.json(comment);
    });
});

// TODO:
//Show all comments related to given post_id
CommentRouter.route("/:post_id/post").get(function(req, res) {
  Comment.find({ post: req.params.post_id })
    .populate("commenter", "username votes")
    .sort('-votes')
    .exec(function(err, comments) {
      if (err) {
        console.log(err);
      } else {
        res.json(comments);
      }
    });
});

//TODO: get results if logged user has voted on comment
CommentRouter.route("/:id/vote_check/:user_id").get((req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    let userVotePair = user.votes.filter(vote => {
      return vote.vote_id == req.params.id;
    });

    console.log(userVotePair);
    
    res.json(userVotePair);
  });
});

// TODO:
// Show all comments related to user

// Handle voting reqeusts
CommentRouter.route("/:id/vote").post((req, res) => {
  const { vote } = req.body;
  let user_id = req.user ? req.user._id : null;
  User.findById(user_id, (err, user) => {
    if (err) console.error(err);

    // Check if user is logged in, return if not
    if (!user) {
      return res.json({ message: "ya gotta log in" });
    } else {
      Comment.findById(req.params.id, (err, comment) => {
        if (err) console.error(err);

        let userVote = user.votes.filter(currUserVote => {
          return currUserVote.vote_id == `${comment._id}`;
        });

        let voteIndex = user.votes.indexOf(userVote[0]);

        if (userVote.length === 0) {
          console.log(`add vote`);
          comment.votes += vote;
          user.votes.push({ vote_id: comment._id, vote: vote });
        } else {
          console.log(userVote[0]);
          console.log(vote);

          if (userVote[0].vote != vote) {
            // opposite vote, change vote
            console.log(`change vote`);
            user.votes[voteIndex] = { vote_id: comment._id, vote: vote }; // replace user vote
            comment.votes += vote * 2; // offset for the vote switch is by 2
          } else {
            // cancel vote
            console.log(`remove vote`);
            comment.votes -= vote;
            // Find index of the users vote
            // Use index to splice users vote
            user.votes.splice(voteIndex, 1);
          }
        }

        comment.save();

        user
          .save()
          .then(user => {
            console.log(`Vote Success`);
            res.json({ votes: comment.votes });
          })
          .catch(err => {
            console.error(err);

            res.json({ error: err });
          });
      });
    }
  });
});

// Add comment
CommentRouter.route("/add").post((req, res) => {
  let newComment = new Comment(req.body);

  if (req.user) {
    newComment
      .save()
      .then(comment => {
        console.log(comment);

        Post.findById(comment.post[0], (err, post) => {
          post.comments.push(comment);

          post
            .save()
            .then(post => {
              // res.status(200).json({ message: "comment saved for post" });
            })
            .catch(err => {
              console.error(err);
              return res.status(500).json({ error: "Internal server err" });
            });
        });

        User.findById(comment.commenter[0], function(err, user) {
          user.comments.push(comment);
          user
            .save()
            .then(user => {
              // res.status(200).json({ message: "comment saved for user" });
            })
            .catch(err => {
              console.error(err);
              return res.status(500).json({
                error: "An internal service error has occured"
              });
            });
        });

        res.status(200).json({ success: "comment saved for user" });
      })
      .catch(err => {
        console.error(err);

        return res.json({ error: "Something went wrong :(" });
      });
  } else {
    console.error("You need to be logged in first");
    res.status(401).json({ error: "You need to be logged in first" });
  }
});

// edit comment
CommentRouter.route("/:id/edit").post((req, res) => {
  let newComment = req.body.comment;
  Comment.findById(req.params.id, (err, comment) => {
    if (err) console.error(err);

    comment.comment = newComment;

    comment.save().then(comment => {
      res.json({ message: "comment updated!" });
    });
  });
});

// delete comment
CommentRouter.route("/:id/delete").delete((req, res) => {
  Comment.findByIdAndDelete(req.params.id, (err, comment) => {
    if (err) console.error(err);
    User.find({ comments: comment._id }, (err, users) => {
      users.map(user => {
        if (user.comments.includes(comment._id))
          user.comments.splice(comment._id, 1);

        user.save().then(user => {
          res.json({ message: "Comment deleted" });
        });
      });
    });
  }).catch(err => {
    console.log(err);
  });
});

module.exports = CommentRouter;
