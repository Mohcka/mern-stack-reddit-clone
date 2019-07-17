import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

import CrudButtons from "../ui/CrudButtons.component";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = { votes: this.props.comment.votes, userVote: 0 };
    console.log(`User access is:`);
    console.log(this.props.userAccess);

    this.handleVote = this.handleVote.bind(this);
    this.userVoteCheck = this.userVoteCheck.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  componentDidMount() {
    this.userVoteCheck(); // check if logged in user has made a vote on the current comment
  }

  /**
   * Sends request to delete comment from the database, delete comment from UI 
   * once succesful.
   */
  deleteComment() {
    console.log(this.props.comment.post);

    if (this.props.userAccess) {
      axios
        .delete(`/api/comments/${this.props.comment._id}/delete`)
        .then(res => {
          console.log(res.data);

          // update comment list
          this.props.handleListUpdate(this.props.comment.post[0]);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      Swal.fire("You need to be logged in first");
    }
  }

  /**
   * Dispatches a reqeust to update comment's vote property from the given user
   * 
   * @param {Object_Id} comment_id Id selector for the comment
   * @param {Number} newVote the number to increment the vote count by
   */
  handleVote(comment_id, newVote) {
    if (this.props.loggedUser) {
      axios
        .post(`/api/comments/${comment_id}/vote`, { vote: newVote })
        .then(res => {
          console.log(`Successful vote`);
          console.log(res);

          this.setState({ votes: res.data.votes });
          this.userVoteCheck();
        })
        .catch(err => console.error(err));
    } else {
      Swal.fire("You need to be logged in first");
    }
  }

  // check if logged in user has voted on this comment
  // alter appearence of vote buttons if they have
  userVoteCheck() {
    if (this.props.loggedUser) {
      axios
        .get(
          `/api/comments/${this.props.comment._id}/vote_check/${
            this.props.loggedUser._id
          }`
        )
        .then(res => {
          console.log("Vote Check!");
          console.log(res);
          // if response gives no vote, make vote nuetral again
          this.setState({ userVote: res.data[0] ? res.data[0].vote : 0 });
        });
    }
  }

  render() {
    return (
      <div className="comment my-3">
        <h4>
          <span>
            <span
              style={{ color: this.state.votes >= 0 ? "green" : "red" }}
            >
              {this.state.votes}
            </span>
            <span className="ml-1">
              <CrudButtons
                vote_id={this.props.comment._id}
                userVote={this.state.userVote}
                handleDelete={this.deleteComment}
                handleVote={this.handleVote}
                userAccess={this.props.userAccess}
                edit_to_path={`/edit/comment/${this.props.comment._id}`}
              />
            </span>
            <span className="mx-1" />
            By&nbsp;
            <Link to={`/profile/${this.props.comment.commenter[0]._id}`}>
              u/{this.props.comment.commenter[0].email}
            </Link>
            &nbsp;{moment(this.props.comment.created_at).from(moment([]))}
          </span>
        </h4>
        <h4 />
        <p>{this.props.comment.comment}</p>
      </div>
    );
  }
}

export default Comment;
