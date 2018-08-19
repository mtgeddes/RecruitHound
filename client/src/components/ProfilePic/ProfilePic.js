import React, {Component} from "react";


class ProfilePic extends Component {
  state = {
    default: "Hello World"
  }

  render () {
    return (
    <div style={{width: '250px', position: 'relative'}} >

      <form action="/upload" method='POST' encType='multipart/form-data'>
        <div className='custom-file mb-3'>
          <input type='hidden' name='file' value={this.props.id} />
          <input type='hidden' name='file' value='profilePic' />
          <input type='file' name='file' id='file' className='custom-file-input'/>
          <input type="hidden" name="id" value={this.props.id} />
          <label htmlFor='file' className='custom-file-label'> </label>
        </div>
        <input type='submit' value='Save' className=''/>
      </form>


      <form action={`/files/${this.props.id}/profilePic?_method=DELETE`} method='POST' > 
        <input type='submit' value='Delete' className=''/>
      </form>

      <form action={`/download/${this.props.id}/profilePic?_method=GET`} method='POST' > 
        <input type='submit' value='Download' className=''/>
      </form>

      <div style={{width: '250px', height: '250px', overflow: 'hidden'}} > 
        <img style={{width: '250px'}} src={"image/" + this.props.id + "/profilePic"} alt=''/>
      </div>



      <h3>{this.props.firstname}&nbsp;{this.props.lastname}</h3>

    </div>
    )
  }
}

export default ProfilePic;