import React from 'react';
import axios from 'axios';
import { db } from './Database';

const getGroups = (setAllGroups) => {
  setAllGroups([]);
  // return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('select * from groups_tbl',[],
          (_, { rows: { _array } }) => {
            setAllGroups(_array)
          }
        );
      },
      (t, error) => { console.log("db error load groups_tbl"); },
      (_t, _success) => { console.log("db load groups_tbl") }
    );
  // })
}


export const GroupModel = {
  getGroups
};