import React from 'react';
import Friend from '../../UI/Friend/Friend';
import './FriendList.css';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ActionButton from "../../UI/ActionButton/ActionButton";
class FriendList extends React.Component{

state={
    usersFriend:[]
}

async componentDidMount(){
    //console.log("friend start mount")
    if(this.props.prevImage!=null){
        this.props.setGeneralImage(this.props.prevImage);
    }
    let friendList=(await this.props.contractInstance.methods.get_friends()).decodedResult;
    let myArr=[];

    friendList.map((el,index)=>{
        //console.log("el",el);
    axios.get(`https://ipfs.io/ipfs/${el.image}`).then((result)=>{
            let imageString=result.data;
            let data={
                ...el,
                imageString
            };
            myArr.push(data);
            //console.log("the index is "+index +" and the length is "+myArr.length );
            //console.log("My Array",myArr);
            // if(index==(myArr.length-1)){
                //console.log("inside update")
                //console.log(myArr);
                this.setState({usersFriend:myArr})
                //console.log("inside update",this.state.usersFriend);
            // }
        }).catch(error=>{
            console.error(error);
        });


    });
    //console.log("friend start mount",friendList);
    // //console.log("new friend list",newFriendList);
    // this.setState({usersFriend:newFriendList});
    //console.log("friend start mount");
}
    handleusersFriendClicked=(userFriend)=>{
        this.props.setCurrentChat(userFriend);
        this.props.history.push("/current_chat");
        }
 render(){
    return(

        <div className="FriendList">
            <h4>Friends</h4>
            {this.state.usersFriend.map(el=>{
                //console.log(el);
                return (<Friend name={el.name} clicked={(event)=>{
                    this.handleusersFriendClicked(el)

                }} imageString={el.imageString}/>);
            })}
          <Link to="/send_requests">   <ActionButton /></Link>
        </div>
    );
}
}

const mapStateToProps=(state)=>{
    return{
        contractInstance:state.client,
        prevImage:state.prevImage
    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
        setGeneralImage:(imageData)=>dispatch({type:"SET_GENERAL_IMAGE",generalImage:imageData}),
        setCurrentChat:(newCurrentChat)=>dispatch({type:"SET_CURRENT_CHAT",currentChat:newCurrentChat})
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(FriendList);