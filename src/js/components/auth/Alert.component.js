import React from 'react';

function Alert(props) {
  console.log(props);

  return (
    <React.Fragment>
      <div
        className="alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        {props.message}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={props.closeFlash}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <strong />
      </div>

      <script>$(".alert").alert();</script>
    </React.Fragment>
  );
}


export default Alert;