import React from 'react';
import axios from 'axios';
import { db } from './Database';

const getAddons = (setAllGroups) => {
  setAllGroups([]);
  // return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('select * from addons_tbl',[],
          (_, { rows: { _array } }) => {
            setAllGroups(_array)
          }
        );
      },
      (t, error) => { console.log("db error load addons_tbl"); },
      (_t, _success) => { console.log("db load addons_tbl") }
    );
  // })
}


export const AddonModel = {
  getAddons
};