import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  withRouter
} from "react-router-dom";
import axios from "axios";

//* Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/dropdown";

//* Auth Components
import Login from "./js/components/auth/login.component";
import SignUp from "./js/components/auth/signup.component";

//* Post Componentes
import Index from "./js/components/index.component";
import CreatePost from "./js/components/posts/create-post.component";
import EditPost from "./js/components/posts/EditPost.component";
import PostsPage from "./js/components/posts/PostsPage.component";
import PostPage from "./js/components/posts/PostPage.component";

//* Profile Component
import ProfilePage from "./js/components/users/ProfilePage.component";

//* Comment Components
import CreateComment from "./js/components/comments/CreateComment.component";
import EditComment from "./js/components/comments/EditComment.component";

//* 404
import NoMatch from "./js/components/NoMatch.component";

//* Assets
import logo from "./logo.svg";

// Component used to display login/signup navigation
function LoginSignUp(props) {
  return (
    <React.Fragment>
      <li className="navbar-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
      <li className="navbar-item">
        <Link className="nav-link" to="/signup">
          Sign Up
        </Link>
      </li>
    </React.Fragment>
  );
}

// View component for logging out and displaying user details
function Logout(props) {
  return (
    <React.Fragment>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          data-toggle="dropdown"
          href="#"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Hello, {props.user}
        </a>
        <div className="dropdown-menu">
          <Link className="dropdown-item" to="/" onClick={props.handleLogin}>
            Logout
          </Link>
        </div>
      </li>
    </React.Fragment>
  );
}

// wrap loggout component withRouter to user programatic redirecting when logging out
const LogoutWithRouter = withRouter(Logout);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userSession: null
    };

    this.updateLogin = this.updateLogin.bind(this);
    this.logout = this.logout.bind(this);
  }

  updateLogin() {
    axios
      // fetch the logged in user for the current instance if there is one
      .get("/api/users/user/")
      .then(res => {
        if (res.data.user) {
          console.log(res.data.user);

          this.setState({
            userSession: res.data.user
          });
        }
      })
      .catch(err => console.error(err));
  }

  logout() {
    axios
      .get("/api/users/logout/")
      .then(res => {
        this.setState({ userSession: null });
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    this.updateLogin();
  }

  render() {
    // User navigation elements for logging in/out
    let logNavEl = $.isEmptyObject(this.state.userSession) ? (
      <LoginSignUp />
    ) : (
      <Logout user={this.state.userSession.username} handleLogin={this.logout} />
    );

    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a href="/" className="navbar-brand">
              <img src={logo} alt="Boop" width="30" height="30" />
            </a>
            <Link to="/" className="navbar-brand">
              Mern-Stack
            </Link>

            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ml-auto">{logNavEl}</ul>
            </div>
          </nav>
          <br />
          <Switch>
            <Route
              path="/"
              exact
              render={props => (
                <PostsPage {...props} userSession={this.state.userSession} />
              )}
            />
            <Route
              path="/posts/:page"
              render={props => (
                <PostsPage {...props} userSession={this.state.userSession} />
              )}
            />
            <Route
              path="/post/show/:id"
              render={props => (
                <PostPage {...props} user={this.state.userSession} />
              )}
            />
            <Route path="/post/edit/:id" component={EditPost} />
            <Route
              path="/profile/:id"
              render={props => (
                <ProfilePage {...props} user={this.state.userSession} />
              )}
            />
            <Route
              path="/create/post"
              render={props => (
                <CreatePost {...props} user={this.state.userSession} />
              )}
            />
            <Route
              path="/create/comment/:post_id"
              render={props => (
                <CreateComment {...props} user={this.state.userSession} />
              )}
            />
            <Route
              path="/edit/comment/:comment_id"
              render={props => (
                <EditComment {...props} user={this.state.userSession} />
              )}
            />
            <Route
              path="/login"
              render={props => (
                <Login {...props} handleLogin={this.updateLogin} />
              )}
            />
            <Route
              path="/signup"
              render={props => (
                <SignUp {...props} handleLogin={this.updateLogin} />
              )}
            />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
