import React, {Component} from "react";
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import $ from "jquery";
import UserTile from "../../components/UserTile/UserTile";
import PopulationTile from '../../components/PopulationTile/PopulationTile';
import './RecruiterDashboard.css';



class RecruiterDashboard extends Component {
  state = {
    id: undefined,
    company: undefined,
    firstname: undefined,
    lastname: undefined,
    username: undefined,
    address1: undefined,
    address2: undefined,
    city: undefined,
    state: undefined,
    zip: undefined,
    phone1: undefined,
    national: undefined,
    description: undefined,
    website: undefined,
    lastLogin: undefined,
    created: undefined,
    savedUsers: undefined,
    users: '',
    availableusers: '',
    activeusers: '',
    opentoopportunities: '',
    notsearching: '',
    newusername: undefined,
    newfirstname: undefined,
    newlastname: undefined,
    newaddress1: undefined,
    newaddress2: undefined,
    newcity: undefined,
    newstate: undefined,
    newzip: undefined,
    newpassword: undefined
  }

  searchUsers = this.searchUsers.bind(this);
  filterUsers = this.filterUsers.bind(this);
  saveProfile = this.saveProfile.bind(this);
  handleOnChange = this.handleOnChange.bind(this);


  componentDidMount(){
    this.pullUsers();
    this.pullActiveSearch();
    this.notSearching();
    this.openToOpportunities();
    this.searchUsers();
    this.loadRecruiter();
  }

  loadRecruiter() {

    this.setState({  // Resets state in preparation for the getuser to follow
      id: null,
      username: null,
      firstname: null,
      lastname: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zip: null,
      // loggedIn: false,
      created: null,
      lastLogin: null,
      jobSearchStatus: null,
      userSkills: [],
      newUserSkills: this.state.userSkills
    })

    $.ajax({   // To Do: make sure this fires after signin post has already finished, otherwise req.session.passport will not exist yet
      url: '/api/loadrecruiter',
      type: 'get',
      success: (response) => {
        if (response.err) {
          console.log("Error!");
          console.log(response.err);
          this.setState({
            errorMessage: response.err.message
          })
        } else {
          console.log("@route GET /api/loadrecruiter response:");
          console.log(response);
          this.props.updateUser(response)   // Stores current recruiter in App.js
          this.props.updateUser({loggedIn: true})   // Stores logged in status in App.js
          this.setState(response)   // Set state to current recruiter
        }
      },
      error: (err) => {
        console.log(err);
        this.setState({
          errorMessage: err.statusText
        })
      }
    });
  }

  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  editProfileButton(event){
    $('#user').find('.hider').each(function() {
      $(this).toggleClass('hidden');
    });
    $('#editprofile').text(function(i, text){   // Toggle Edit button text
      return text === "Edit Profile" ? "Cancel" : "Edit Profile";
    });
  }

  saveProfile(e) {
    e.preventDefault();
    console.log("updateProfile has been fired!");
    const data = {
      id: this.state.id,
      newusername: this.state.newusername === undefined ? this.props.username : this.state.newusername,
      newcompany: this.state.newcompany === undefined ? this.props.company : this.state.newcompany,
      newfirstname: this.state.newfirstname === undefined ? this.props.firstname : this.state.newfirstname,
      newlastname: this.state.newlastname === undefined ? this.props.lastname : this.state.newlastname,
      newaddress1: this.state.newaddress1 === undefined ? this.props.address1 : this.state.newaddress1,
      newaddress2: this.state.newaddress2 === undefined ? this.props.address2 : this.state.newaddress2,
      newcity: this.state.newcity === undefined ? this.props.city : this.state.newcity,
      newstate: this.state.newstate === undefined ? this.props.state : this.state.newstate,
      newzip: this.state.newzip === undefined ? this.props.zip : this.state.newzip,
      newpassword: this.state.newpassword
    }
    $.ajax({
      url: '/api/update-recruiter-profile',
      type: 'post',
      data: data,
      success: (response) => {
        if (response.err) {
          console.log("Error!");
          console.log(response.err);
          this.setState({
            errorMessage: response.err.message
          })
        } else {
          console.log("Success!");
          console.log(response);
          this.props.updateUser(response)   // Stores current user in App.js
          this.props.updateUser({loggedIn: true})   // Stores logged in status in App.js
          this.setState(response)   // Set state to current user
          this.setState({statusText: "Success!"})
          this.editProfileButton();
        }
      },
      error: (err) => {
        console.log(err);
        this.setState({
          errorMessage: err.statusText
        })
      }
    });

  }

  //This is to pull the users on the page loading (Total Active Users)
  pullUsers(e) {
    $.ajax({
      url: '/allusersavailable',
      type: 'get',
      success: (response) => {
        // this.clearForm()
        if (response.err) {
          console.log("Error!");
          console.log(response.err);
          this.setState({
            errorMessage: response.err.message
          })
        } else {
          console.log("Success at pulling all users on click (no filter or parameters)!");
          console.log(response.count + " Recruits available for contact");
          this.setState({
            availableusers: response.count
          })
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  saveUser(e) {
    e.preventDefault();
    $.ajax({
      url: '/saveuser',
      type: 'post',
      data: {
        saveUser: this.val()
      },
      success: (response) => {
        if (response.err) {
          console.log("error on saving User");
          console.log(response.err);
        }
        else {
          console.log("Success at saving this user!!");
          console.log(response)
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  //This is to pull users that are actively searching for a job
  pullActiveSearch(e) {
    $.ajax({
      url: '/activesearch',
      type: 'get',
      data: {
        jobSearchStatus: "Actively Searching"
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
          console.log("Success for Active Searchers");
          console.log(response.count + " Recruits looking for a job");
          this.setState({
            activeusers: response.count
          })
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  //THis is to pull users that are OPEN TO OPPORTUNITIES
  openToOpportunities(e){
    $.ajax({
      url: '/opentoopportunities',
      type: 'get',
      data: {
        jobSearchStatus: "Open to Opportunities"
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
          console.log("Success for pulling those open to opportunities");
          console.log(response.count +" Recruits open to opportunities");
          this.setState({
            opentoopportunities: response.count
          })
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  //This is to pull users that are not currently in the job market
  notSearching(e) {
    $.ajax({
      url: '/notsearching',
      type: 'get',
      data: {
        jobSearchStatus: "Not Searching"
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
          console.log("Success for pulling those not looking for a job");
          console.log(response.count + " Recruits not searching for a job");
          this.setState({
            notsearching: response.count
          })
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  //This is to search for Users by City
  searchUsers(e){
    // e.preventDefault();
    $.ajax({
      url: '/usersearch',
      type: 'get',
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
          console.log(response.response)
          this.setState({
            users: response.response
          })
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  filterUsers(e){
    e.preventDefault();
    let filterInput = $('#user-search-input').val()
    let filter = filterInput.toLowerCase();
    let newUsers = [];
    for (let i = 0; i<this.state.users.length; i++) {
      if (this.state.users[i]['skill']) {
        let loweredEntry = this.state.users[i]['skill'];
        for (let x in loweredEntry) {
          if (loweredEntry[x].toLowerCase() === filter) {
            newUsers.push(this.state.users[i]);
          }
        }
      }
    }
    this.setState({
      users: newUsers
    }, function(){
      console.log(this.state.users)
    })
  }
  
  

  render () {
    console.log(this.state.id)

    return (

      <div className="RecruiterDashboard">
            
      <Nav
        sitepath={this.props.sitepath}
        loggedIn={this.props.loggedIn}
        updateUser={this.props.updateUser}
      />

{/* Orange Bar */}
      <div id="recOrangeBar">
        <span id="recDashboardTitle">Recruiter Dashboard</span>
        <div id="recOrangeBarDogDiv">
          <img src="./images/dog-dashboard.png" id="recOrangeBarDogImg"/>
        </div>
      </div>
      <div className="clearfix"/>

      <div className="container">
        <div className="row" id="portfolio_info">

{/* Profile Info */}
        <div className="col-xs-12 col-sm-12 col-md-3 gutterWrap text-center"> 
        <div className="paperCard" id="userProfile">

          {/* User's Name */}
          <h3>{this.props.firstname} {this.props.lastname}</h3>

          {/* User Image */}
          <img src="https://pbs.twimg.com/profile_images/1002272769352978433/9S4QWSR0_400x400.jpg" className="recruiterImage" />

          <div className="clearfix"/>

          {/* Edit button */}
          <button className="btn btn-primary" id="editProfile" onClick={this.editProfileButton}>Edit Profile</button><br />

          {/* Begin profile form */}
          <div >
          <form id="user" name="user-dashboard">

              <div className="form-row">
                  {/* E-mail */}
                  <div className="form-group col-md-12">
                      <label htmlFor="username"><strong>E-mail:</strong><br/>{this.props.username}</label>
                      <input type="email" className="form-control hidden hider" id="email" placeholder="Email" name="newusername" value={this.state.newusername} onChange={this.handleOnChange} required autoComplete="email"/>
                  </div>
                  {/* Password */}
                  <div className="form-group col-md-12">
                      <label htmlFor="password" className="formSpacer hidden hider"><strong>Password:</strong></label>
                      <input type="password" className="form-control hidden hider" id="password" placeholder="Password" name="newpassword" value={this.state.newpassword} onChange={this.handleOnChange} required autoComplete="new-password" />
                  </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-12">
                    <label htmlFor="newcompany" className="formSpacer"><strong>Company:</strong> {this.props.company}</label>
                    <input type="text" className="form-control hidden hider" id="newcompany" placeholder="Company" name="newfirstname" value={this.state.newcompany} onChange={this.handleOnChange} required />
                </div>  
              </div>

              <div className="form-row">
                  {/* First Name */}
                  <div className="form-group col-md-12">
                      <label htmlFor="newfirstname" className="formSpacer"><strong>First Name:</strong> {this.props.firstname}</label>
                      <input type="text" className="form-control hidden hider" id="newfirstname" placeholder="First name" name="newfirstname" value={this.state.newfirstname} onChange={this.handleOnChange} required autoComplete="given-name" />
                  </div>
                  {/* Last Name */}
                  <div className="form-group col-md-12">
                      <label htmlFor="newlastname" className="formSpacer"><strong>Last Name:</strong> {this.props.lastname}</label>
                      <input type="text" className="form-control hidden hider" id="newlastname" placeholder="Last name" name="newlastname" value={this.state.newlastname} onChange={this.handleOnChange} required autoComplete="family-name" />
                  </div>
              </div>

                  {/* Address */}
              <div className="form-group">  
                  <label htmlFor="newaddress1" className="formSpacer"><strong>Address:</strong> {this.props.address1}<br/>{this.props.address2}</label>
                  <input type="text" className="form-control hidden hider" id="newaddress1" placeholder="1234 Main St" name="newaddress1" value={this.state.newaddress1} onChange={this.handleOnChange} required autoComplete="address-line1" />
              </div>

              <div className="form-group">
                  {/* <label htmlFor="newaddress2" className="formSpacer hidden hider"><strong>Address 2:</strong> {this.props.address2}</label> */}
                  <input type="text" className="form-control hidden hider" id="newaddress2" placeholder="Apartment, studio, or floor" name="newaddress2" value={this.state.newaddress2} onChange={this.handleOnChange} autoComplete="address-line2" />
              </div>

              <div className="form-row">
                  {/* City */}
                  <div className="form-group col-md-7">
                      <label htmlFor="newcity" className="formSpacer"><strong>City:</strong> {this.props.city}</label>
                      <input type="text" className="form-control hidden hider" id="newcity" name="newcity" placeholder="City" value={this.state.newcity} onChange={this.handleOnChange} required autoComplete="address-level2" />
                  </div>
                  {/* State */}
                  <div className="form-group col-md-5">
                      <label htmlFor="newstate" className="formSpacer"><strong>State:</strong> {this.props.state}</label>
                      <select id="newstate" className="form-control hidden hider" name="newstate" value={this.state.newstate} onChange={this.handleOnChange} required autoComplete="address-level1">
                          <option selected disabled>Choose...</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="DC">District Of Columbia</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="HI">Hawaii</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                      </select>
                  </div>
                  {/* Zip Code */}
                  <div className="form-group col-md-12">
                      <label htmlFor="newzip" className="formSpacer"><strong>Zip Code:</strong> {this.props.zip}</label>
                      <input type="text" className="form-control hidden hider" id="newzip" name="newzip" placeholder="Zip" value={this.state.newzip} onChange={this.handleOnChange} required autoComplete="postal-code" />
                  </div>
              </div>

              {/* Submit Button */}
              <div className="form-row" id="submit-btn-container">
                  <input type="hidden" id="skill" name="skill" value=""/>
                  <button type="submit" className="btn btn-primary submitprofile hidden hider" value="Create My Profile" onClick={this.saveProfile}>Save</button>
              </div>
          </form>
          </div>
        </div>
        </div>


      {/* PUT THE POPULATION TILE BACK HERE */}
      <div className="col-md-9" id="recRightSide">
        <div className="paperCard" id="population-tiles">
          <h2 id='accordion-header'>&nbsp;Talent Pool Available</h2>

          {/* NEED HELP RENDERING */}
          <div className="populateTile">
          <PopulationTile available={this.state.availableusers} active={this.state.activeusers} open={this.state.opentoopportunities} notsearching={this.state.notsearching}/>
          </div>
        </div>

    
      
        <div className="paperCard" id='user_info'>
        {/* <h2>&nbsp;Recruits <button class="btn btn-primary" id="findAllUsers" onClick={this.searchUsers}>Find all</button></h2> */}
        <div className="row">
          <div className="col-md-12 col-lg-3 col-xl-4" id="userSearchTitle">
            <h2>&nbsp;Recruits</h2>
          </div>

          <div className='col-xs-12 col-md-12 col-lg-9 col-xl-8' id="userLocate">
            <form className="form-row">
              <input className="form-control" type="text" id="user-search-input" placeholder="Enter skill to filter" />
              <div id="userSearchButtons">
                <button className="btn btn-primary" id="user-search-button" onClick={this.filterUsers}>Filter</button>
                <button className="btn btn-primary" id="user-search-reset" onClick={this.pullUsers}>Reset</button>
              </div>
            </form>
          </div>
          </div>
        
        {this.state.users !== '' ?
          <UserTile users={this.state.users}/>
          : ""
        }
        </div>
      </div>
      </div>

      <Footer />
      </div>
    </div>
    )
  }
}

export default RecruiterDashboard;