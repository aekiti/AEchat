import React from 'react';
import './Input.css';
const Input =(props)=>{
   let  allClasses=["Input"]
   
    if(props.otherClass){
     allClasses.push(props.otherClass)
        
    }

    return(
       <input placeholder={props.placeHolder} onChange={props.onChange}  className={allClasses.join(" ")}>
       </input>
    );
}
export default Input;