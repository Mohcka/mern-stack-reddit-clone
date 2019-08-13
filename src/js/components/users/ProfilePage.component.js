import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Post from "../posts/post.component";

const ProfileInfo = props => {
  return (
    <div className="profile-container">
      <h2>{`${props.post ? props.post.poster[0].username : ""}'s posts`}</h2>
    </div>
  );
};

const UserPosts = props => {
  return (
    <div className="user-posts">
      {props.posts.map((post, ind) => {
        // post.poster = [{_id: props.user._id, username: props.user.username}];
        return (
          <Post
            key={ind}
            post={post}
            loggedUser={props.user}
            userAccess={
              props.user ? post.poster[0]._id === props.user._id : false
            }
          />
        );
      })}
    </div>
  );
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { user: {}, user_posts: [] };
  }

  componentDidMount() {
    console.log(this.props.match);
    let user_id = this.props.match.params.id; // id to fetch all posts created by this user

    // fetch all posts created by user
    axios.get(`/api/posts/user/${user_id}`).then(response => {
      console.log("PRofile:");
      console.log(response.data);
      if (response.data.length == 0) {
        this.props.history.push("/404");
      } else {
        this.setState({
          // returns object of each user post returned schema: { post, poster, title, votes }
          user_posts: response.data
        });
      }
    });
  }

  render() {
    return (
      <div className="profile-container">
        <ProfileInfo post={this.state.user_posts[0]} />
        <div className="my-2" />
        <UserPosts
          posts={this.state.user_posts}
          postUser={this.state.user}
          user={this.props.user}
        />
      </div>
    );
  }
}

export default Profile;
