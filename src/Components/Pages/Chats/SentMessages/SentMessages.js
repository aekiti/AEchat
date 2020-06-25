import React from 'react';
import './SentMessages.css';
export default (props)=>{
  return<div className="SentMessages">
    <div className="sentMessageDiv">
      <p className="sentMessageText">{props.text}</p>
      <p className="sentMessageTime">{props.time}</p>
    </div>
  </div>
}