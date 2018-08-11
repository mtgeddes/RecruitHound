import React, {Component} from "react";
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import EventBrite from '../../components/Eventbrite';
import events from './eventbrite.json';
import $ from "jquery";
// import API from "../../utils/API";



class UserDashboard extends Component {
  state = {
    username: '',
    newfirstname: '',
    newlastname: '',
    newaddress1: '',
    newaddress2: '',
    newcity: '',
    newstate: '',
    newzip: '',
    password: '',
    events,
    recruitersearch: ''
  }

  searchRecruiters = this.searchRecruiters.bind(this);


  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  searchRecruiters(e){
    e.preventDefault();
    let city = $('#search-input').val()
    console.log(city)
    $.ajax({
      url: '/recruitersearch',
      type: 'get',
      data: {
        city: $('#search-input').val()
      },
      success: (response) => {
        // this.clearForm()
        if (response.err) {
          console.log("Error!");
          console.log(response.err);
          this.setState({
            errorMessage: response.err.message
          })
        } else {
          console.log("Success!");
          console.log(response);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  

  render () {
    return (
      <div className="UserDashboard container">
      <Nav />

      
      <div>name</div>
      <div>address</div>
      <div>phone #</div>
      <div>e-mail address</div>
      <div>name</div>
      <div>name</div>
      <div>name</div>
      <h3>Logged In? = {this.props.loggedIn.toString()}</h3>
      <h3>Username = {this.props.username}</h3>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 m-auto'>
            <h1 className='text-center display-4 my-4'>Mongo File Uplaods</h1>
            <form action='/upload' method='POST' encType='multipart/form-data'>
              <div className='custom-file mb-3'>
                <input type='file' name='file' id='file' className='custom-file-input'/>
                <label htmlFor='file' className='custom-file-label'>Choose File
                </label>
              </div>
              <input type='submit' value='Submit' className='btn btn-primary btn-block'/>
            </form>
            <hr/>
          </div>
        </div>
      </div>

      <hr />
      
      <div className="row" id='agency_info'>
        <h2 id='accordion-header'>Your Local Recruiters!</h2>

        <div className='col-xs-12 agency-locate'>
          <form className="form-row">
            <input className="form-control" type="text" id="search-input" placeholder="Enter Your City" />
            <button className="btn btn-primary" id="search-button" onClick={this.searchRecruiters}>Search</button>
          </form>
        </div>
        </div>
        <div className="col-xs-12 recruiter-return-info" display-toggle="none">
          <div className="accordion" id="recruiterAccordion"></div>	
        </div>

      <hr/>

      <div className="row" id='events'>
        <h2 id='accordion-header'>Events in Your Area!</h2>
        {this.state.events.map(event => (
          <EventBrite
          id={event.id}
          image={event.image}
          event={event.event}
          description={event.description}
          location={event.location}
          street={event.street}
          city={event.city}
          state={event.state}
          zipcode={event.zipcode}
          date={event.date}
          url={event.url}
        />
        ))}
      </div>
      <Footer />
    </div>
    )
  }
}

export default UserDashboard;