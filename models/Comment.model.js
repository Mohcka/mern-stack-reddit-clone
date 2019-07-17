const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./Users.model');
const Post = require('./Post.model');

const CommentSchema = new Schema(
  {
    comment: String,
    votes: Number,
    post: [{ type: Schema.Types.ObjectId, ref: "Posts" }],
    commenter: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: "comments"
  }
);



module.exports = mongoose.model("Comments", CommentSchema);
