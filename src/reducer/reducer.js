import dp from '../dp.png';

let initialState = {
  client: "null",
  currentChat: null,
  generalImage: dp,
  usersProfile: {},
  prevImage: null
}

const reducer = (state = initialState, action) =>{
  if(action.type === "SET_CLIENT") {
    return {...state, client: action.client}
  }
  if(action.type === "SET_CURRENT_CHAT") {
    return {...state, currentChat: action.currentChat};
  }
  if(action.type === "SET_GENERAL_IMAGE") {
    return{...state, generalImage: action.generalImage}
  }
  if(action.type==="SET_USER_PROFILE"){
    return{...state, usersProfile: action.usersProfile}
  }
  if(action.type==="SET_PREV_IMAGE"){
    return{...state, prevImage: action.prevImage};
  }
  return{...state}
}

export default reducer;