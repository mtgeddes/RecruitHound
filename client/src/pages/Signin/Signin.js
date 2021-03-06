import React, {Component, Fragment} from "react";
import { Redirect } from 'react-router-dom';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import styles from './Signin.css';
import $ from 'jquery';

class Signin extends Component {
  state = {
    username: '',
    password: '',
    redirectTo: null,
    error: null
  }

  handleChange = this.handleChange.bind(this);
  onHandleSubmit = this.onHandleSubmit.bind(this);

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onHandleSubmit(event) {
    event.preventDefault()
    console.log('Signin submit has fired!')
    console.log(this.state.username)
    console.log(this.state.password)
    $.ajax({
      url: '/api/signin',
      type: 'post',
      data: { 
        username: this.state.username, 
        password: this.state.password,
      },
      success: (response) => {
        console.log("Success!");
        console.log(response);
        this.props.updateUser({
          loggedIn: true,
          id: response.id,
          username: response.username,
          recruiting_agency: response.recruiting_agency,
          firstname: response.firstname,
          lastname: response.lastname,
          address1: response.address1,
          address2: response.address2,
          city: response.city,
          state: response.state,
          zip: response.zip,
          linkedin: response.linkedin,
          git: response.git,
          created: response.created,
          lastLogin: response.lastLogin
        })
        this.setState({
          redirectTo: response.redirectTo,
          error: response.responseText
        })
      },
      error: (err) => {
        console.log(err)
        this.setState({
          error: err.responseText
        })
      }
    });
  }

  render () {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {
        return (
        <Fragment>
          <Nav
            sitepath={this.props.sitepath}
            loggedIn={this.props.loggedIn}
            updateUser={this.props.updateUser}
          />

          <div className={styles.signinContainer}>
            <div className={styles.signinContent}>
              <img className={styles.logoSignin} src="/images/Logo-top-left.gif" alt="Logo-top-left.gif" />
                <div className={styles.loginBox}>
                  <h3>SIGN IN</h3>
                  <p className="error-text">{this.state.error ? `Error: ${this.state.error}` : ""}</p>
                  <form id="signin" name="signin" method="post" action="signin">
                    <input className="form-control" type="text" name="username" placeholder="EMAIL" required value={this.state.username} onChange={this.handleChange} autoComplete="email" />
                    <input className="form-control" type="password" name="password" placeholder="Password" required value={this.state.password} onChange={this.handleChange} autoComplete="current-password" />
                    <button className="btn" type="submit" id="btn-signin" value="Sign In" onClick={this.onHandleSubmit}>Submit</button>
                    <a href="/">
                      <p>Forget Password?</p>
                    </a> 
                    <a href="/signup">
                      <p>New User? Create A Profile.</p>
                    </a>
                  </form>
                </div>
            </div>
          </div>
          <div className={styles.footerRow}>
            <Footer/>
          </div>
        </Fragment>
      )
    }
  }
}

export default Signin
