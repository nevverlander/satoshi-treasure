import React from "react";
import firebase from "../../firebase";
import md5 from "md5";
import {Button, Form, Grid, Header, Icon, Message, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {FacebookLoginButton, GoogleLoginButton} from "react-social-login-buttons";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.firestore().collection("users")
  };

  isFormEmpty = ({username, email, password, passwordConfirmation}) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({password, passwordConfirmation}) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = {message: "Fill in all fields"};
      this.setState({errors: errors.concat(error)});
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = {message: "Password is invalid"};
      this.setState({errors: errors.concat(error)});
      return false;
    } else {
      return true;
    }
  };

  handleSubmit = event => {
    if (this.isFormValid()) {
      this.setState({errors: [], loading: true});
      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
              });
            })
            .catch(err => {
              console.log(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  saveUser = createdUser => {
    return this.state.usersRef.doc(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);
  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };
  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{maxWidth: 450}}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange"/>
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked padded raised>
              <FacebookLoginButton onClick={() => alert("Hello")}/>
              <GoogleLoginButton onClick={() => alert("Hello")} style={{marginTop: 20}}/>
              <div style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', marginTop: 10}}>
                <div style={styles.divider}/>
                <div style={{width: '20%', textAlign: 'center', fontSize: 12}}>OR</div>
                <div style={styles.divider}/>
              </div>
              <Link to="/register">
                <Button
                  color="google plus"
                  fluid
                  size="large"
                >
                  <Icon name='mail'/>Register with Email
                </Button>
              </Link>
              <div style={{marginTop: 20}}>Already a user? <Link to="/login">Login</Link></div>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
        </Grid.Column>
      </Grid>
    );
  }
}

const styles = {
  divider: {
    backgroundColor: '#e7e7e7',
    height: 1,
    width: '40%'
  }
};

export default Register;
