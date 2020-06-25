import React from 'react';
import "./UpdateProfile.css";
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import BackDrop from '../../UI/Backdrop/Backdrop';
import axios from 'axios';
import {ipfs,base64ArrayBuffer} from '../../../HelperFiles/ipfs';
import {connect} from 'react-redux';

class UpdateProfile extends React.Component{

    state={
        name:'',
        about:'',
        file:null,
        showLoader:false
    }


    handleSubmit=()=>{
        let {name}=this.state;
        let {about}=this.state
        let {file}=this.state;
        //console.log(file.type);
        if(name.trim()!==""&&about.trim()!==""&&file!=null){
         this.setState({showLoader:!this.state.showLoader});
         let imageHash= this.addFileToIpfs(file);
        }
    }



    addFileToIpfs=async (file)=>{
        //console.log(ipfs,"ipfs");
        const fileType = file.type;
        //console.log(fileType);
        const prefix = `data:${fileType};base64,`;
        let reader= new window.FileReader();
        reader.readAsArrayBuffer(file);
        let myResult="";
        reader.onloadend=()=>{
          ipfs.add(prefix+base64ArrayBuffer(Buffer(reader.result)),async (err,result)=>
          {
            if(err){
              //console.log(err);
              return;
            }
            myResult=result;
            //console.log(result,"Am hashz");
            axios.get(`https://ipfs.io/ipfs/${result}`).then(async(result)=>{
                //console.log(result)
                await this.props.client.call("register_profile",[this.state.name,this.state.about,myResult]);

            this.props.setGeneralImage(result.data);
            this.setState({showLoader:!this.state.showLoader});
            this.props.history.goBack()

            }).catch((error)=>{
                console.error(error);
            });

          });
        // //console.log(reader.result)

        }

      }


nameChangedHandler=(event)=>{
    this.setState({name:event.target.value})
    }
aboutChangedHandler=(event)=>{
    this.setState({about:event.target.value})
    }

fileChangedHandler=(event)=>{
    this.setState({file:event.target.files[0]});
    //console.log(event.target.files[0])
    }

    render(){
        return(<div className={"UpdateProfile"} >

                <BackDrop show={this.state.showLoader}></BackDrop>
               {this.state.showLoader?  <Spinner></Spinner>:null}
            <input  onChange={this.fileChangedHandler} placeHolder="Choose Your Profile Picture" otherClass={"UPInput"}  type="file" style={{ display:"block",
                                            margin: "0 auto",
                                            background: "#f7296e",
                                            borderRadius:"10px",
                                            color:"white",
                                            border:"none",
                                            cursor: "pointer"}}/>
            <Input value={this.state.name} onChange={this.nameChangedHandler} placeHolder="Full Name"  otherClass={"UPInputi"}/>
            <Input value={this.state.about} onChange={this.aboutChangedHandler} placeHolder="Profile About" otherClass={"UPInputii"}/>

            <Button otherClass={"UPInputiv"} clicked={this.handleSubmit}>Submit</Button>

          <Button otherClass={"UPInputiv"} clicked={()=>{this.props.history.goBack()}}>Back</Button>

        </div>);
    }
}

const mapStateToProps=(state)=>{
    return{
        client:state.client
    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
      setGeneralImage:(imageData)=>dispatch({type:"SET_GENERAL_IMAGE",generalImage:imageData})
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(UpdateProfile);