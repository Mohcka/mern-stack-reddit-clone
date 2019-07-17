import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import PostsContainer from "./PostsContainer.component";

// checks and alerts the user if they need to be logged in
// in order to compelete an action
const logCheck = userSession => {
  if (!userSession) {
    Swal.fire("You must be logged in first");
  }
};

function Index(props) {
  console.log(props.userSession);

  return (
    <div className="container">
      <div className="row">
        <div className="col-8 bg-light text-center">
          <PostsContainer
            userSession={props.userSession}
            page={props.match.params.page ? props.match.params.page : 1}
          />
        </div>
        <div className="col-3 offset-1">
          <div className="bg-light text-center py-3 px-2">
            <Link
              to={props.userSession ? `/create/post` : `#`}
              onClick={e => logCheck(props.userSession)}
            >
              <button className="btn btn-primary btn-block">Make A Post</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
