import React, { Component } from "react";
import axios from "axios";

import Alert from "./Alert.component";

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
              <Alert key={ind} message={error.message} closeFlash={() => this.setState({errors: []})} />
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
