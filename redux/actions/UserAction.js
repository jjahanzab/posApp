import axios from "axios";
import { db } from "../../Models/Database";

export const CHANGE_INSTALL_STATUS = 'CHANGE_INSTALL_STATUS';
export const GET_DB_TABLES = 'GET_DB_TABLES';

export const changeInstallStatus = install => dispatch => {
  dispatch({
    type: CHANGE_INSTALL_STATUS,
    payload: install
  })
}

export const getDbTables = () => {
  try {
    return dispatch => {
      db.transaction(
        tx => {
          tx.executeSql("SELECT name FROM sqlite_master WHERE type = 'table'",[],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                dispatch({
                  type: GET_DB_TABLES,
                  payload: _array
                })
              }
            }
          );
        },
        (_t, _error) => { console.log("db error load tables"); },
        (_t, _success) => { console.log("db load tables"); }
      );
    }
  } catch (error) {
    console.log('getDbTables action catch error');
  }
}