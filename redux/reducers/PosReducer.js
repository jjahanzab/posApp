import { 
  GET_DB_SETTINGS,
  GET_DB_USERS,
  GET_DB_MENUS,
  GET_DB_SUBMENUS,
  GET_DB_GROUPS,
  GET_DB_ADDONS,
  GET_DB_SUBMENUADDONS,
  GET_DB_MENUSUBMENUTIMINGS,
  GET_DB_MENUSUBMENUTIMINGSLOTS,
  GET_DB_GROUPADDONSTATUS,
  GET_DB_SUBMENUGROUPADDONS,

  AUTH_STATUS,
  GET_DB_SUBMENUS_ID,
  GET_DB_SUBMENUADDONS_ID
} from "../actions/PosAction";

const storeData = {
  dbSettings: [],
  dbUsers: [],
  dbMenus: [],
  dbSubmenus: [],
  dbGroups: [],
  dbAddons: [],
  dbSubmenuAddons: [],
  dbMenuSubmenuTimings: [],
  dbMenuSubmenuTimingSlots: [],
  dbGroupAddonStatus: false,
  dbSubmenuGroupAddons: [],

  authStatus: '',
  dbSubmenuAddonsIds: []
}

function PosReducer(state = storeData, action) {
  switch (action.type) {

    // get db tables data //
    case GET_DB_SETTINGS:
      return {...state, dbSettings: action.payload};
      
    case GET_DB_USERS:
      return {...state, dbUsers: action.payload};
    
    case GET_DB_MENUS:
      return {...state, dbMenus: action.payload};

    case GET_DB_SUBMENUS:
      return {...state, dbSubmenus: action.payload};
      
    case GET_DB_GROUPS:
      return {...state, dbGroups: action.payload};
      
    case GET_DB_ADDONS:
      return {...state, dbAddons: action.payload};
      
    case GET_DB_SUBMENUADDONS:
      return {...state, dbSubmenuAddons: action.payload};
    
    case GET_DB_MENUSUBMENUTIMINGS:
      return {...state, dbMenuSubmenuTimings: action.payload};
      
    case GET_DB_MENUSUBMENUTIMINGSLOTS:
      return {...state, dbMenuSubmenuTimingSlots: action.payload};

    case GET_DB_GROUPADDONSTATUS:
      return {...state, dbGroupAddonStatus: action.payload};

    case GET_DB_SUBMENUGROUPADDONS:
      return {...state, dbSubmenuGroupAddons: action.payload};
      

    case AUTH_STATUS:
      return {...state, authStatus: action.payload};

    // get conditional data //
    case GET_DB_SUBMENUS_ID:
      return {...state, dbSubmenus: action.payload};
    
    case GET_DB_SUBMENUADDONS_ID:
      return {...state, dbSubmenuAddonsIds: action.payload};
      
    default: 
      return state;
  }
}
  
  export default PosReducer;