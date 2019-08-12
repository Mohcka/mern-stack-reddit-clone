import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

import CrudButtons from "../ui/CrudButtons.component";

const UserLink = props => {
  if (props.post.poster.length && props.post.poster[0]._id !== 0)
    return <Link to={props.to}>u/{props.post.poster[0].username}</Link>;

  return <div className="anonymouse-user">u/anonymous</div>;
};

const PostCrudButtons = props => {
  if (props.userAccess) {
    return (
      <CrudButtons
        post={props.post}
        userAccess={props.userAccess}
        handleDelete={() => props.handleDelete()}
        edit_to_path={`/post/edit/${props.post._id}`}
      />
    );
  }
  return <React.Fragment />; // return blank
};

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votes: this.props.post.votes,
      userVote: 0
    };

    this.handleVote = this.handleVote.bind(this);
    this.userVoteCheck = this.userVoteCheck.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  componentDidMount() {
    // check if loggedIn user has voted on the current post
    this.userVoteCheck();
  }

  componentDidUpdate(prevProps, prevState) {
    // this is use to update the votes everytime a new page is selected
    // since for  some reason the props won't update when a Link renders a
    // new component
    if (prevProps.post.votes !== this.props.post.votes) {
      this.setState({
        votes: this.props.post.votes
      });
    }

    if(prevProps.post !== this.props.post){
      this.userVoteCheck();
    }
  }

  deletePost() {
    if (this.props.loggedUser) {
      axios
        .delete(`/api/posts/delete/${this.props.post._id}`)
        .then(res => {
          console.log(res.data);

          // return home

          // refresh list if already on home page
          this.props.handleList(1);
          this.props.history.push("/");
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      Swal.fire({
        title: "You must be logged in first"
      });
    }
  }

  // submit user's vote for post and update post's vote
  handleVote(post_id, newVote) {
    if (this.props.loggedUser) {
      axios
        .post(`/api/posts/${post_id}/vote`, { vote: newVote })
        .then(res => {
          console.log(res.data);

          this.setState({ votes: res.data.votes });
          this.userVoteCheck();
        })
        .catch(err => console.error(err));
    } else {
      Swal.fire({
        title: "You must be logged in first"
      });
    }
  }

  // check if logged in user has voted on this comment
  // alter appearence of vote buttons if they have
  userVoteCheck() {
    if (this.props.loggedUser) {
      console.log("User is logged!!");
      console.log(this.props.loggedUser);
      
      axios
        .get(
          `/api/posts/${this.props.post._id}/vote_check/${
            this.props.loggedUser._id
          }`
        )
        .then(res => {
          console.log("Vote Check!");

          // if response gives no vote, make vote nuetral again
          this.setState({ userVote: res.data[0] ? res.data[0].vote : 0 });
        });
    }
  }

  render() {
    // If the user currently logged in has access to this post, grant crud priveleges

    return (
      <div className="post">
        <h2>
          <span>
            <Link to={`/post/show/${this.props.post._id}`}>
              {this.props.post.title}
            </Link>
            {" - "}
            <span
              style={{ color: this.state.votes >= 0 ? "green" : "red" }}
            >
              {this.state.votes}
            </span>
          </span>
          <span className="ml-1">
            <CrudButtons
              vote_id={this.props.post._id}
              userVote={this.state.userVote}
              handleDelete={this.deletePost}
              handleEdit={this.editPost}
              handleVote={this.handleVote}
              userAccess={this.props.userAccess}
              edit_to_path={`/post/edit/${this.props.post._id}`}
            />
          </span>
        </h2>
        <h5>
          By <span className="mr-1" />
          <UserLink
            to={
              this.props.post.poster[0]
                ? `/profile/${this.props.post.poster[0]._id}`
                : `#`
            }
            post={this.props.post}
          />
          &nbsp;- {moment(this.props.post.created_at).from(moment([]))}
        </h5>
        <p>{this.props.post.post}</p>
      </div>
    );
  }
}

export default Post;
