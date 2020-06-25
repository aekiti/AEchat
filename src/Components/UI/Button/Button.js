import React from 'react';
import "./Button.css";

const Button=(props)=>{
    let allClasses=["Button"];
    if(props.otherClass){
        allClasses.push(props.otherClass)
    }
    return(<button className={allClasses.join(" ")} onClick={props.clicked}> 
               {props.children}
            </button>)
}

export default Button;