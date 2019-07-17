const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoteSchema = new Schema(
  {
    vote: {
        type: String,
        enum: ['+', '-']
    },
    voted_post: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    voter: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  {
    collection: "posts"
  }
);

module.exports = mongoose.model("Votes", VoteSchema);
