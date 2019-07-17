import React, { Component } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

class CreateComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    };

    this.onChangeComment = this.onChangeComment.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeComment(e) {
    this.setState({ comment: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(`Form submitted:`);
    console.log(`Comment: ${this.state.comment}`);

    const newComment = {
      comment: this.state.comment,
      votes: 0,
      commenter: this.props.user ? this.props.user._id : 0,
      post: this.props.match.params.post_id
    };

    axios.post("/api/comments/add", newComment).then(res => {
      console.log(res);
      this.props.history.push(`/post/show/${this.props.match.params.post_id}`);
    })
    .catch(err => {
      console.error(err);
      
    });

    this.setState({
      comment: ""
    });
  }

  render() {
    return (
      <div className="create-post-container">
        <h2>Create Comment</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">
              Penny for your thoughts?
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              value={this.state.comment}
              rows="3"
              onChange={this.onChangeComment}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Post" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}

export default CreateComment;
