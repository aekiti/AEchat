import React from 'react';
import  './Friend.css';
const Friend=(props)=>{
    return(
        <div className="Friend" onClick={props.clicked}>
            <img src={props.imageString} alt={props.name} />
            <h4>{props.name}</h4>
        </div>
    );
}

export default Friend;