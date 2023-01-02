import { GET_DB_TABLES, CHANGE_INSTALL_STATUS } from "../actions/UserAction";

const allUsers = {
    user: 'john',
    users: [],
    players: [],
    playerStatus: false,
    dbTables: [],
    install: ''
}

function UserReducer(state = allUsers, action) {
  switch (action.type) {

    case CHANGE_INSTALL_STATUS:
      return {...state, install: action.payload};
      
    case GET_DB_TABLES:
      return {...state, dbTables: action.payload};
    
    default: 
      return state;
  }
}

export default UserReducer;