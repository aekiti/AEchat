import React from 'react';
import './NavigationItems.css';
import {Link} from 'react-router-dom';
const NavigationItems=(props)=>{
    return(
        <div className="NavigationItems">
          <Link className="a" to="friend_requests">  <p className="Item" onClick={props.frClicked}>Friend requests</p></Link>
           <Link className="a" to="user_profile"> <p className="Item" onClick={props.mpClicked}>My Profile</p></Link>
        </div>
    )
}

export default NavigationItems;