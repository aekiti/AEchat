import React from 'react';
import './ActionButton.css';
const ActionButton =(props)=>{
    return(<div className="ActionButton" onClick={props.handler}>
                <h1 className="actionplus">+</h1>
           </div>)
}

export default ActionButton;