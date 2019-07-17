import React from "react";
import { Link } from "react-router-dom";

const CrudButtons = props => {
  // show edit and delete button if props.showCrud is true
  let crudButtons = !!props.userAccess ? (
    <React.Fragment>
      <Link
        to={props.edit_to_path}
        className="btn btn-sm btn-warning edit-btn ml-1"
      >
        Edit
      </Link>
      <button
        className="btn btn-sm btn-danger delete-btn ml-1"
        onClick={e => props.handleDelete()}
      >
        Delete
      </button>
    </React.Fragment>
  ) : null;

  
  return (
    <React.Fragment>
      {crudButtons}
      <span className="ml-1">
        <button
          className={`btn btn-sm btn-${
            props.userVote > 0 ? `success` : `secondary`
          } shadow-none mr-1`}
          onClick={e => props.handleVote(props.vote_id, 1)}
        >
          Up
        </button>
        <button
          className={`btn btn-sm btn-${
            props.userVote < 0 ? `danger` : `secondary`
          } shadow-none`}
          onClick={e => props.handleVote(props.vote_id, -1)}
        >
          Down
        </button>
      </span>
    </React.Fragment>
  );
};

export default CrudButtons;

export { CrudButtons };
