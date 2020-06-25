const contractAddress = "ct_2UfoQwSMA4DthdbWLpKAYiEADFtvCXPVb2ziCC929Rga9Yo1Be";
const contractSource = `
include "List.aes"
contract AEchat =
  record user =
    { name: string,
      about: string,
      image: string,
      user: address }

  record message =
    { message: string,
      time: string,
      sender: address,
      seen: bool }

  record state =
    { profile: map(address, user),
      friends: map(address, list(address)),
      messages: map(address, map(address, list(message))),
      requests: map(address, list(address)),
      newest_friend: map(address, address) }

  stateful entrypoint init() =
    { profile={},
      friends={},
      messages={},
      requests={},
      newest_friend={} }

  function empty_profile() =
    let empty_profile = { name="", about="", image="", user=Call.caller }
    empty_profile

  stateful entrypoint register_profile(name': string, about': string, image': string) =
    let new_profile = {name = name', about = about', image = image', user = Call.caller}
    put(state{profile[Call.caller] = new_profile})

  entrypoint get_profile()=
    Map.lookup_default(Call.caller, state.profile, empty_profile())

  stateful entrypoint send_friend_request(friends_address: address) =
    let empty_address_list: list(address) = [Call.caller]
    switch(Map.lookup(friends_address, state.requests))
      None =>   only_one_friend_request(friends_address, empty_address_list)
      Some(x) => modify_friends_request(x, empty_address_list, friends_address)

  stateful function modify_friends_request(old_list: list(address), new_friend_list: list(address), friends_address: address) : list(address) =
    let new_list = new_friend_list ++ old_list
    put(state{requests[friends_address] = new_list})
    new_list

  stateful function only_one_friend_request(friends_address: address, new_friend_list: list(address)) =
    put(state{requests[friends_address] = new_friend_list})
    new_friend_list

  entrypoint get_friend_request() =
    let friends_request = List.map((request) => Map.lookup_default(request, state.profile, empty_profile()), Map.lookup_default(Call.caller, state.requests, []))
    friends_request

  stateful entrypoint reject_friend_request(new_friends_address: address) =
    let friend_request_list = Map.lookup_default(Call.caller, state.requests, [])
    let new_friend_request_list = List.filter((request) => request != new_friends_address, friend_request_list)
    put(state{requests[Call.caller] = new_friend_request_list})

  stateful entrypoint accept_friend_request(new_friends_address: address) =
    let friend_request_list = Map.lookup_default(Call.caller, state.requests, [])
    let new_friend_request_list = List.filter((request) => request != new_friends_address, friend_request_list)

    let friends_list = Map.lookup_default(Call.caller, state.friends, [])
    let request_senders_friend_list = Map.lookup_default(new_friends_address, state.friends, [])
    let new_request_senders_friend_list = Call.caller::request_senders_friend_list
    let new_friends_list = new_friends_address::friends_list
    let new_friendsMap = state.friends{[Call.caller] = new_friends_list, [new_friends_address] = new_request_senders_friend_list}
    put(state{friends = new_friendsMap, requests[Call.caller] = new_friend_request_list})

  entrypoint get_friends()=
    let friends = List.map((friend) => Map.lookup_default(friend, state.profile, empty_profile()), Map.lookup_default(Call.caller, state.friends, []))
    friends

  stateful entrypoint send_message(receiver: address, message': string, time': string) =
    let new_message = {message = message', time = time', sender = Call.caller, seen = false}
    let old_state_senders_messages = Map.lookup_default(Call.caller, state.messages, {})
    let old_state_receiver_messages = Map.lookup_default(receiver, state.messages, {})

    let old_single_receiver_messages = Map.lookup_default(Call.caller, old_state_receiver_messages, [])
    let old_single_sender_messages = Map.lookup_default(receiver, old_state_senders_messages, [])

    let new_single_receiver_messages = new_message::old_single_receiver_messages
    let new_single_sender_messages = new_message::old_single_sender_messages

    let new_state_senders_message = old_state_senders_messages{[receiver] = new_single_sender_messages}
    let new_state_receivers_message = old_state_receiver_messages{[Call.caller] = new_single_receiver_messages}

    let new_updated_state = state.messages{[Call.caller] = new_state_senders_message, [receiver] = new_state_receivers_message}

    put(state{messages = new_updated_state})

  entrypoint get_messages() =
    Map.lookup_default(Call.caller, state.messages, {})

  entrypoint get_friend_message(friend_address: address) =
    let all_messages = get_messages()
    let friend_message = Map.lookup_default(friend_address, all_messages, [])
    friend_message
`;

export default{
  contractAddress: contractAddress,
  contractSource: contractSource,
  url: 'https://sdk-testnet.aepps.com',
  internalUrl: 'https://sdk-testnet.aepps.com/',
  compilerUrl: 'https://compiler.aepps.com'
}
