import React from 'react';
import './SideDrawer.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../Backdrop/Backdrop';
import Hoc from "../../../HigherOrder/hoc";

const sideDrawer=(props)=>{
    let classNames=["SideDrawer"]
    if(props.isOpen===("fromOpen")){
        //console.log(props.isOpen);
        classNames.push("open")
    }else if(props.isOpen===("fromClose")){
        //console.log(props.isOpen)
        classNames.push("close");
    }
    return(
<Hoc>

    <div className={classNames.join(" ")}>

            <NavigationItems frClicked={props.frClicked} mpClicked={props.mpClicked}></NavigationItems>

        </div>
        <Backdrop show={props.showBackdrop} clicked={props.navToggle}></Backdrop>

       </Hoc>
    )
}

export default sideDrawer;