import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import PostsList from './posts/PostsContainer.component';

function Index(props) {
  

  return (
    <div className="container">
      <div className="row">
        <div className="col-8 bg-light text-center">
          <PostsList page={1} userSession={props.userSession} history={props.history} />
        </div>
        <div className="col-3 offset-1 bg-light text-center">
          <Link to="/create/post">
            <button className="btn btn-primary">Make A Post</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Index;
