import React, { Component } from 'react';
import Header from './Components/UI/Header/Header';
import './App.css';
import FriendList from './Components/Pages/FriendList/FriendList';
import SendRequest from './Components/Pages/SendRequest/SendRequest';
import SideDrawer from './Components/UI/Navigation/SideDrawer/SideDrawer';
import UpdateProfile from './Components/Pages/UpdateProfile/UpdateProfile';
import FriendRequests from './Components/Pages/FriendRequests/FriendRequests';
import ViewProfile from './Components/Pages/ViewProfile/ViewProfile';
import Chats from './Components/Pages/Chats/Chats';
import axios from 'axios';
import {BrowserRouter,Route} from 'react-router-dom';
import {connect} from 'react-redux';
import getClient from './HelperFiles/AeClient';
import Spinner from './Components/UI/Spinner/Spinner';

class App extends Component {
  state = {
    isOpen: "normal",
    showBackdrop: false,
    frClicked: false,
    loading: false,
    profileData: null,
    imageUrl: "",
  }

  async componentDidMount() {
    this.setState({loading: true});
    let client = await getClient();
    this.props.setClient(client);

    let decodedUsersProfile = (await this.props.client.methods.get_profile()).decodedResult;
    this.props.setUsersProfile(decodedUsersProfile);
    if(decodedUsersProfile.name !== ""){
      axios.get(`https://ipfs.io/ipfs/${decodedUsersProfile.image}`)
      .then(result => {
        this.props.setGeneralImage(result.data);
      })
      .catch(error => {
        console.error(error);
      });
      this.setState({loading: false, profileData:decodedUsersProfile});
      return;
    }
    this.setState({loading:false, profileData:decodedUsersProfile});
  }

  changeHeaderImage = (result) => {
    axios.get(`https://ipfs.io/ipfs/${result}`)
    .then(result => {
      this.setState({imageUrl:result.data,loading:false});
    })
    .catch(error=>{
      console.error(error);
    });
  }

  openNavigationDrawer = () => {
    if(this.state.isOpen === ("normal")) {
      this.setState({isOpen: "fromOpen", showBackdrop:true})
      return;
    }

    if(this.state.isOpen === ("fromOpen")){
      this.setState({isOpen: "fromClose", showBackdrop:false})
      return;
    }

    if(this.state.isOpen === ("fromClose")){
      this.setState({isOpen: "fromOpen", showBackdrop:true})
      return;
    }
  }

  goToFriendRequests = (back) => {
    this.openNavigationDrawer();
    this.setState({isOpen: "normal"});
  }
  goToViewProfile =() => {
    this.setState({isOpen: "normal", showBackdrop:false});
  }
  toggleLoader = () => {
    this.setState({loading: !this.state.loading});
  }

  url = "https://cdn-media-1.freecodecamp.org/imgr/MJAkxbh.png";
  render() {
    <div>
      <FriendList/>
    </div>

    return (
      <BrowserRouter>
        <div>
          {this.state.loading? <Spinner/> :null}
          <Header imageUrl={this.state.imageUrl} navToggle={this.openNavigationDrawer} profToggle={this.toggleRegProfile}/>
          <SideDrawer frClicked={this.goToFriendRequests} mpClicked={this.goToViewProfile} showBackdrop={this.state.showBackdrop} navToggle={this.openNavigationDrawer} isOpen= {this.state.isOpen}/>
          {this.props.client==="null"?null: <Route exact path="/" component={FriendList}/>}

          <Route exact path="/current_chat" component={Chats}/>

          <Route path="/friend_requests" component={FriendRequests}/>
          <Route path="/user_profile" component={ViewProfile}/>
          <Route path="/update_profile" component={UpdateProfile} />
          <Route path="/send_requests" component={SendRequest} />
        </div>
      </BrowserRouter>
    );
  }
}
const mapStateToProps=(state)=>{
  return {
    client: state.client
  }
}

const mapDispatchToProps=(dispatch)=>{
  return{
    setClient:(client)=>dispatch({type:"SET_CLIENT",client:client}),
    setGeneralImage:(imageData)=>dispatch({type:"SET_GENERAL_IMAGE",generalImage:imageData}),
    setUsersProfile:(profile)=>dispatch({type:"SET_USER_PROFILE",usersProfile:profile})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
