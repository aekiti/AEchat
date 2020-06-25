import React from "react";
import './FriendRequest.css';
import Button from '../../../UI/Button/Button';
const FriendRequest=(props)=>{
    return <div className="FriendRequest">

       <img src={props.imageString} alt={props.name} />
       <p className="FRKey">{props.name}</p>
        <Button clicked={props.accept} otherClass="FRConfirm">Confirm</Button>
        <Button clicked={props.reject} otherClass="FRReject">Reject</Button>
    </div>
}

export default FriendRequest;