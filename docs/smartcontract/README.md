---
description: >-
  This tutorial takes a look at a smart contract, written in Sophia ML for a
  Chatting aepp but also provides another fundamental and deeper understanding
  about general basics of the language itself.
---

# SmartContract

### Prequisites

* [Basic understanding of the Sophia programming language](https://github.com/aeternity/aesophia)

### Smart Contract

First of all lets start by creating the a record that will store the information about the users profile.

```text
contract ChatContract=
 record usersRecord={
  name:string,
  discipline:string,
  status:string,
  dpUrl:string
  }
```

Now, lets proceed by defining some of the things that we will like to keep track of through out the lifetime of our contract, such as each `users friends`, `mesages sent to the user`, the `friend requests` a user has received and a `users profile`, we will store all this things in our state, and lets also create our init function, as you might already know, the init function returns the value of the state at the point of deployment of the contract

```text
contract ChatContract=
 record state={
  usersProfile:map(address,usersRecord),
  usersFriend:map(address,list(address)),
  usersMessages:map(address,map(address,list(string))),
  friendRequests:map(address,list(address)),
  newestFriend:map(address,address)
  }

 stateful entrypoint init()={usersProfile={},usersFriend={},usersMessages={}, friendRequests={},newestFriend={}}
```

So lets create a function that will allow a user register his profile.Now, this function must be stateful because it will modify the usersProfile field in our state,it must also be defined as an entrypoint because it will be called out of our contract.

```text
 stateful entrypoint registerProfile(name':string,discipline':string,status':string,dpUrl':string)=
    let newProfile={name=name',discipline=discipline',status=status',dpUrl=dpUrl'}
    put(state{usersProfile[Call.caller]=newProfile})
```

We will also create the function that will return a particular users profile, we will use the Map.lookup\_default function which allows you to specify a default value for a map to return if it does not have a particular key

```text
 entrypoint getProfile()=
    Map.lookup_default(Call.caller,state.usersProfile,{name="",discipline="",status="",dpUrl=""})
```

Next, lets create a function that will allow a user to send a friend request to another user using his address, this function will take in the other users address, and store it in the field of the present users friend Requests Map which is in the state. This function will also reply on two helper functions, `modifyFriendsRequest` and `onlyOneFriendRequest`, `onlyOneFriendRequest` is called when the other users list of friend requests is empty and `modifyFriendsRequest` is called when the user already has a list of friend requests

```text
 stateful entrypoint sendFriendRequest(friendsAddress':address)=
     let emptyAddressList:list(address)=[Call.caller]
     switch(Map.lookup(friendsAddress',state.friendRequests))
       None =>   onlyOneFriendRequest(friendsAddress',emptyAddressList)
       Some(x)=> modifyFriendsRequest(x,emptyAddressList, friendsAddress')

 stateful function modifyFriendsRequest(oldList:list(address),newFriendList:list(address),friendsAddress':address):list(address)=
    let newList=newFriendList++oldList
    put(state{friendRequests[friendsAddress']=newList})
    newList

 stateful function onlyOneFriendRequest(friendsAddress':address,newFriendList:list(address))=
     put(state{friendRequests[friendsAddress']=newFriendList})
     newFriendList
```

Then lets also create a `getFriendRequests` function that will return the list of friends a person has presently

```text
 entrypoint getFriendRequest()=
    Map.lookup_default(Call.caller,state.friendRequests,[])
```

So lets crate a function called `acceptFriendRequest` that will take in an address, remove it from the present users list of friend requests and add it to the present users list of friends and also add it to the user who sent the friend request's list of friends.

```text
 stateful entrypoint acceptFriendRequest(newFriendsAddress:address)=
    let friendRequestList=Map.lookup_default(Call.caller,state.friendRequests,[])  
    let newFriendRequestList=List.filter((x)=>x!=newFriendsAddress,friendRequestList)

    let usersFriendList=Map.lookup_default(Call.caller,state.usersFriend,[])
    let requestSendersFriendList=Map.lookup_default(newFriendsAddress,state.usersFriend,[])
    let newRequestSendersFriendList=Call.caller::requestSendersFriendList
    let newUsersFriendList=newFriendsAddress::usersFriendList
    let newUsersFriendMap=state.usersFriend{[Call.caller]=newUsersFriendList,[newFriendsAddress]=newRequestSendersFriendList}
    put(state{usersFriend=newUsersFriendMap,friendRequests[Call.caller]=newFriendRequestList})
```

So lets also add a function that will allow a user to get the list of friends he has

```text
 entrypoint getUsersFriend()=
    Map.lookup_default(Call.caller,state.usersFriend,[])
```

