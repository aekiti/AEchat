import React,{Component} from 'react';
import './ViewProfile.css';
import picture from '../../../dp.png';
import {connect} from 'react-redux';
import axios from 'axios';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';

class ViewProfile extends Component{

    state={
        dpHash:picture,
        name:"",
        about:"",
        loading:true
    }

   async componentDidMount(){
       //console.log("View Profile Update");
   //console.log(this.props.client)
  let profile=(await  this.props.client.methods.get_profile()).decodedResult;
  if(profile){
      axios.get(`https://ipfs.io/ipfs/${profile.image}`).then(response=>{
          //console.log(response);
          this.setState({dpHash:response.data})
          this.setState({loading:false});

      }).catch(err=>{
          console.error(err);
           this.setState({loading:false});
      })
      this.setState({name:profile.name,about:profile.about})
  }else{
      this.setState({loading:false})
  }
  //console.log(profile);

    }

    render(){
        return (<div className="ViewProfile">
                    {this.state.loading?<Spinner></Spinner>:null}
                    <img src={this.state.dpHash} alt={this.state.name} className="VPImage"/>
                    <h4>{this.state.name}</h4>
                    <h4>{this.state.about}</h4>
        <Button clicked={()=>{this.props.history.goBack()}} >Back</Button>
                </div>)
    }
}

const mapStateToProps=(state)=>{
    return{
        client:state.client
    }
}
export default connect(mapStateToProps)(ViewProfile);