import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Comment from "./Comment.component";

class CommentsList extends Component {
  constructor(props) {
    super(props);
    this.state = { comments: [], commentCount: 0 };

    this.getComments = this.getComments.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // When the ajax request for the post data from component PostPage
    // fill the comment list with the posts comments
    if (prevProps.post !== this.props.post) {
      console.log(this.props.post);
      this.getComments(this.props.post._id);
    }
  }

  // Fetch comments related to current post
  getComments(post_id) {
    axios
      .get(`/api/comments/${post_id}/post`)
      .then(response => {
        console.log("comments");
        console.log(response.data);
        // set comments to retreived comment data
        this.setState({
          comments: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    if (this.props.loading) {
      return <div className="text-center">Loading...</div>;
    }

    return (
      <div className="posts-container">
        <div className="posts">
          {this.state.comments.map((comment, i) => (
            <Comment
              comment={comment}
              userAccess={
                this.props.user
                  ? this.props.user._id == comment.commenter[0]._id
                  : false
              }
              loggedUser={this.props.user}
              key={i}
              handleListUpdate={this.getComments}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default CommentsList;
