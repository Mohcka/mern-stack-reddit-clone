import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import Post from "./post.component";
import CommentsList from "../comments/CommentsList.component";

let PostWithRouter = withRouter(Post);

// Route /post/:id where id is the posts id
class PostPage extends Component {
  constructor(props) {
    super(props);
    this.state = { post: {}, comments: [] };
  }

  componentDidMount() {
    // Get post from id
    axios
      .get(`/api/posts/${this.props.match.params.id}`)
      .then(res => {
        console.log("Post is");
        console.log(res.data);
        // If the post wasnt found redirect to 404
        if(!res.data.post){
          this.props.history.push('/404');
        } else {
          this.setState({ post: res.data });
        }

        
      })
      .catch(err => console.error(err));
  }

  logCheck(userSession) {
    if (!userSession) {
      Swal.fire("You must be logged in first");
    }
  }

  render() {
    let post =
      Object.keys(this.state.post).length === 0 ? (
        <div className="loading">loading...</div>
      ) : (
        <PostWithRouter
          post={this.state.post}
          loggedUser={this.props.user}
        />
      );
    return (
      <div className="post-page-container">
        <div className="post-container">{post}</div>
        <div className="comment-button">
          <Link
            to={
              this.props.user
                ? `/create/comment/${this.props.match.params.id}`
                : "#"
            }
            onClick={e => this.logCheck(this.props.user)}
          >
            <button
              name=""
              id=""
              className="btn btn-primary"
              href="#"
              role="button"
            >
              Make a Comment
            </button>
          </Link>
        </div>
        <div className="comments-container">
          <CommentsList post={this.state.post} user={this.props.user} />
        </div>
      </div>
    );
  }
}

export default PostPage;
