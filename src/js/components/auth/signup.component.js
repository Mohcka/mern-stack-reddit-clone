import React, { Component } from "react";
import axios from "axios";

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
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <strong />
      </div>

      <script>$(".alert").alert();</script>
    </React.Fragment>
  );
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      username: "",
      password: ""
    };

    this.login = this.login.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }

  onChangeUsername(e) {
    this.setState({ username: e.target.value });
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  login(e) {
    e.preventDefault();

    const SignupInfo = {
      username: this.state.username,
      password: this.state.password
    };

    axios
      .post("/api/users/signup/", SignupInfo)
      .then(res => {
        this.props.handleLogin();
        this.props.history.goBack();
      })
      .catch(err =>
        this.setState({
          errors: [err.response.data.errors]
        })
      );
  }

  render() {
    return (
      <div className="container my-3">
        <div className="row">
          <div className="col-4 offset-4 bg-light rounded-sm p-4">
            {this.state.errors.map((error, ind) => (
              <Alert key={ind} message={error.message} />
            ))}
            <form onSubmit={this.login}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="form-control"
                  placeholder="John Doe"
                  aria-describedby="username-field"
                  onChange={this.onChangeUsername}
                />
                <small id="username-field" className="text-muted">
                  You need to do it
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  placeholder=""
                  aria-describedby="password-field"
                  onChange={this.onChangePassword}
                />
                <small id="password-field" className="text-muted">
                  It's a secret to only you
                </small>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                value="Sign Up"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
