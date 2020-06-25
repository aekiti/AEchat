import React from 'react';
import './Header.css';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import dp from '../../../dp.png';

const Header=(props)=>{
  let usersDp = dp;

  if(props.generalImage !== ""){
    usersDp = props.generalImage;
  }

  return(
    <header >
      <Link to="/update_profile" > <img src={props.generalImage} alt="Profile" className="header-img" onClick={props.profToggle}/></Link>
      <Link style={{textDecoration:'none'}} to="/"> <h4 className="appname" >AEchat</h4></Link>

      <div className="nav-drawer" onClick={props.navToggle}>
          <div className="item-i"/>
          <div className="item-i"/>
          <div className="item-i"/>
      </div>
    </header>
  )
}
const mapStateToProps=(state)=>{
  return{generalImage:state.generalImage}
}

export default connect(mapStateToProps)(Header);