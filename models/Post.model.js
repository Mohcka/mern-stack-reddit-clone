const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema(
  {
    title: String,
    post: String,
    votes: Number,
    poster: [{type: Schema.Types.ObjectId, ref: "Users"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comments"}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
  },
  {
    collection: "posts"
  }
);

module.exports = mongoose.model("Post", Post);
