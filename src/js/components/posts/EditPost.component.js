import React, { Component } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      post: "",
      votes: 0
    };

    this.onChangePost = this.onChangePost.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    axios
      .get(`/api/posts/${this.props.match.params.id}`)
      .then(res => {
        let post = res.data;
        this.setState({
          title: post.title,
          post: post.post,
          votes: post.votes
        });
      })
      .catch(err => console.error(err));
  }

  onChangeTitle(e) {
    this.setState({ title: e.target.value });
  }

  onChangePost(e) {
    this.setState({ post: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(`Form submitted:`);
    console.log(`Post Title: ${this.state.title}`);
    console.log(`Post: ${this.state.post}`);

    const newPost = {
      title: this.state.title,
      post: this.state.post,
      votes: this.state.votes,
      poster: this.props.user ? this.props.user._id : 0
    };

    axios.post(`/api/posts/edit/${this.props.match.params.id}`, newPost).then(res => {
      console.log(res);
      this.props.history.push(`/post/show/${res.data.post._id}`);
    });

    this.setState({
      title: "",
      post: "",
      votes: 0
    });
  }

  render() {
    return (
      <div className="create-post-container">
        <h2>Create Post</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Title: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.title}
              onChange={this.onChangeTitle}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">
              Example textarea
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              value={this.state.post}
              rows="3"
              onChange={this.onChangePost}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Edit" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}

export default CreatePost;
