import React, { Component } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

class EditComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    };

    this.onChangeComment = this.onChangeComment.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    axios
      .get(`/api/comments/${this.props.match.params.comment_id}`)
      .then(res => {
        let comment = res.data;
        console.log('Comment is');
        console.log(comment);
        
        this.setState({
          title: comment.title,
          comment: comment.comment,
          votes: comment.votes,
          post: comment.post
        });
      })
      .catch(err => console.error(err));
  }

  onChangeComment(e) {
    this.setState({ comment: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(`Form submitted:`);
    console.log(`Comment: ${this.state.comment}`);

    const newComment = {
      comment: this.state.comment
    };

    axios
      .post(
        `/api/comments/${this.props.match.params.comment_id}/edit`,
        newComment
      )
      .then(res => {
        console.log(res);
        this.props.history.push(`/post/show/${this.state.post[0]}`);
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

export default EditComment;
