import React from "react";
import firebase from "../../firebase";
import {Button, Form, Grid, Header, Icon, Message, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {FacebookLoginButton, GoogleLoginButton} from "react-social-login-buttons";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false
  };

  handleSubmit = event => {
    if (this.isFormValid(this.state)) {
      this.setState({errors: [], loading: true});
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser);
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
  isFormValid = ({email, password}) => email && password;

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
    const {email, password, errors, loading} = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{maxWidth: 400}}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet"/>
            Login to DevChat
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
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                onChange={this.handleChange}
                className={this.handleInputError(errors, "email")}
                type="email"
                style={{marginTop: 20}}
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="google plus"
                fluid
                size="large"
              >
                Submit
              </Button>
              <div style={{marginTop: 20}}>Don't have an account? <Link to="/rgOptions">Register</Link></div>
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

export default Login;
