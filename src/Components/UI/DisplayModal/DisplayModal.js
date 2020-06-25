import React from 'react'
import Button from '../Button/Button';
import './DisplayModal.css';
export default (props)=>{
    return(<div className="DisplayModal">
<div id="myModal" className="modal">
  <div className="modal-content">
    <div className="modal-header">
      <span className="close">&times;</span>
      <h2>{props.header}</h2>
    </div>
    <div className="modal-body">
      <p>{props.fi}</p>
      <p>{props.fii}</p>
    </div>
    <div className="modal-footer">
      <Button clicked={props.clicked} >Ok</Button>
    </div>
  </div>

</div>
        </div>  
    );
}

