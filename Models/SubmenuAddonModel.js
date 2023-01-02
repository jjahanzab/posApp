import React from 'react';
import axios from 'axios';
import { db } from './Database';

const getSubmenuAddons = (setAllSubmenuAddons) => {
  setAllSubmenuAddons([]);
  // return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('select * from submenu_addons_tbl',[],
          (_, { rows: { _array } }) => {
            setAllSubmenuAddons(_array)
          }
        );
      },
      (t, error) => { console.log("db error load submenu_addons_tbl"); },
      (_t, _success) => { console.log("db load submenu_addons_tbl") }
    );
  // })
}


export const SubmenuAddonModel = {
  getSubmenuAddons
};