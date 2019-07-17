import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flash: [],
      email: "",
      password: ""
    };

    this.login = this.login.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  login(e) {
    e.preventDefault();

    const loginInfo = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("/api/users/login/", loginInfo)
      .then(res => {
        this.props.handleLogin();
        this.props.history.goBack();
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="container my-3">
        <div className="row">
          <div className="col-4 offset-4 bg-light rounded-sm p-4">
            <form onSubmit={this.login}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="example@email.com"
                  aria-describedby="email-field"
                  onChange={this.onChangeEmail}
                />
                <small id="email-field" className="text-muted">
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
              <button type="submit" className="btn btn-primary" value="Sign Up">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
