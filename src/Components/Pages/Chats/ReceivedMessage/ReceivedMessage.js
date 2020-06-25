import React from 'react';
import './ReceivedMessage.css';
export default (props)=>{
  return <div className="ReceivedMessage">
    <div className="receivedMessageDiv">
      <p className="receivedMessageText">{props.text}</p>
      <p className="receivedMessageTime">{props.time}</p>
    </div>
  </div>
}