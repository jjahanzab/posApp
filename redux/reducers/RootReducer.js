import { combineReducers } from "redux";

import UserReducer from "./UserReducer";
import PosReducer from "./PosReducer";

export const RootReducer = combineReducers({ UserReducer, PosReducer });