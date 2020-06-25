import React,{Component} from 'react';
import './ChatList.css';
import ReceivedMessage from '../ReceivedMessage/ReceivedMessage';
import SentMessage from '../SentMessages/SentMessages';
import {connect} from 'react-redux';
class Chats extends Component{
  render(){
    return  <div className="ChatList">
      {this.props.messages.map(el=> {
        if(this.props.profile.user===el.sender){
          return  <SentMessage text={el.message} time ={el.time}></SentMessage>
        }else{
          return <ReceivedMessage text={el.message}  time ={el.time}></ReceivedMessage>
        }
      })}
   </div>
  }
}
const mapStateToProps=(state)=>{
   return{profile:state.usersProfile}
}

export default connect(mapStateToProps)(Chats);