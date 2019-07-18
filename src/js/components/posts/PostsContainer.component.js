import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";

import Post from "./post.component";

let PostWithRouter = withRouter(Post);

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = { posts: [], postCount: 0 };

    this.postList = this.postList.bind(this);
    this.getPage = this.getPage.bind(this);
  }

  componentDidMount() {
    axios
      .get("/api/posts/count/")
      .then(response => {
        console.log(`There are ${response.data.count} documents`);

        this.setState({ count: response.data.count });
      })
      .catch(function(error) {
        console.log(error);
      });

    this.getPage(this.props.page);
  }

  getPage(page) {
    axios
      .get("/api/posts/page/" + page)
      .then(response => {
        console.log(response.data);

        this.setState({ posts: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // Compile post components for each post gathered from the AJAX request
  postList() {
    return this.state.posts.map((currPost, i) => {
      if (currPost.poster.length === 0) currPost.poster.push({ _id: 0 });

      return (
        <PostWithRouter
          userAccess={
            this.props.userSession
              ? currPost.poster[0]._id === this.props.userSession._id
              : false
          }
          loggedUser={this.props.userSession}
          post={currPost}
          key={i}
          handleList={this.getPage}
        />
      );
    });
  }

  render() {
    if (this.props.loading) {
      return <div className="text-center">Loading...</div>;
    }

    let pagination = [];

    for (let i = 0; i < this.state.count / 2; i++) {
      pagination.push(
        <li key={i} className="page-item">
          <Link
            className="page-link"
            to={`/posts/${i + 1}`}
            onClick={() => this.getPage(i + 1)}
          >
            {i + 1}
          </Link>
        </li>
      );
    }

    return (
      <div className="posts-container">
        <div className="posts">{this.postList()}</div>
        <div className="post-pagination">
          <nav aria-label="Page navigation example">
            <ul className="pagination d-flex justify-content-center">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              {pagination.map(pagi => pagi)}
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default Posts;
