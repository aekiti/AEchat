import React,{Component} from 'react';
import ChatList from './ChatList/ChatList';
import Button from '../../UI/Button/Button';
import {connect} from 'react-redux';
import axios from 'axios';
import Spinner from '../../UI/Spinner/Spinner';
import './Chats.css';
class Chats extends Component{
timeInterval=null;
    async componentDidMount(){

        this.setState({loading:true});
        axios.get(`https://ipfs.io/ipfs/${this.props.currentChat.image}`).then((result)=>{
        this.props.setPrevImage(this.props.generalImage);
        this.props.setGeneralImage(result.data);

        }).catch((error)=>{
            console.error(error);
        })
        let allMessages=  (await  this.props.contractInstance.methods.get_friend_message(this.props.currentChat.user)).decodedResult;
        this.setState({loading:false,messages:allMessages.reverse()});

      this.timeInterval= setInterval(async()=>{
            let allMessages=  (await  this.props.contractInstance.methods.get_friend_message(this.props.currentChat.user)).decodedResult;
            this.setState({messages:allMessages.reverse()});

        },5000);

    }
 componentWillUnmount(){

      clearInterval(this.timeInterval);
 }
state={
    inputValue:"",
    messages:[],
    loading:false
}

handleSendMessage=async(event)=>{

   await this.props.contractInstance.methods.send_message(this.props.currentChat.user,this.state.inputValue,this.getTime());
   this.setState({inputValue:""});
let allMessages=  (await  this.props.contractInstance.methods.get_friend_message(this.props.currentChat.user)).decodedResult;

this.setState({messages:allMessages.reverse()});
// this.setState({messages:allMessages.reverse()});
}
handleInputChange=async(event)=>{
    this.setState({inputValue:event.target.value});

}

getTime=()=>{
var d = new Date();
d.toLocaleString();       // -> "2/1/2013 7:37:08 AM"
d.toLocaleDateString();   // -> "2/1/2013"
return d.toLocaleTimeString();

}

    render(){
        return <div>
                    {this.state.loading? <Spinner/> :null}
                    <ChatList messages={this.state.messages}></ChatList>

                    <div className="ChatsMessageDiv">
                    <input className="ChatsInput" placeholder="Enter Message" value={this.state.inputValue} onChange={this.handleInputChange} ></input>
                    <Button clicked={this.handleSendMessage} otherClass="ChatsButton">Send</Button>
                    </div>
                </div>
    }
}

const mapStateToProps=(state)=>{
    return{
        contractInstance:state.client,
        currentChat:state.currentChat,
        generalImage:state.generalImage
    }
}
const mapDispatchToProps=(dispatch)=>{
    return{
      setGeneralImage:(imageData)=>dispatch({type:"SET_GENERAL_IMAGE",generalImage:imageData}),
      setPrevImage:(prevImg)=>dispatch({type:"SET_PREV_IMAGE",prevImage:prevImg})
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(Chats);
