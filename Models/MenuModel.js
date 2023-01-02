import React from 'react';
import axios from 'axios';
import { db } from './Database';


const createMenusTable = async () => {
  try {

    db.transaction(tx => {
        tx.executeSql(`drop table if exists menus`, [])
      },
      (_, error) => {  console.log("db error drop menus table") },
      (_, success) => { console.log("db drop menus table") }
    )
  
    db.transaction(tx => {
        tx.executeSql(`create table if not exists menus 
          ( id integer primary key not null, 
            name text,
            orders text
          )
        `);
      },
      (_, error) => { console.log("db error create menus table") },
      (_, success) => { console.log("db create menus table") }
    )

  } catch (error) {
    console.log(`createMenusTable api try catch error`);
  }
}


const insertMenus = async () => {
  try {

    await createMenusTable();

    await axios.get(`https://sahitepos.sahittest.co.uk/api/v1/app/get-all-menus`).then((response) => {
      if (response) {
        if (response.data.statusCode == '200') {
          let appMenus = response.data.menus;
          if (appMenus.length > 0) {
            
            db.transaction( tx => {
              appMenus.forEach(element => {
                  var singleArr = Object.values(element);
                  // console.log(singleArr);
                  tx.executeSql(`insert into menus 
                    ( id, name, orders) values (?, ?, ?)`, singleArr );
                });
              },
              (t, error) => { console.log("db error insert menus ") },
              (t, success) => { console.log("db insert menus"); }
            )

          }
        }
      }
    }).catch((error) => {
      console.log(`getAllMenus api error ${error}`);
    })

  } catch (error) {
    console.log(`insertMenus api try catch error`);
  }
}


const getMenus = (setAllMenus) => {
  setAllMenus([]);
  // return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('select * from menus_tbl',[],
          (_, { rows: { _array } }) => {
            setAllMenus(_array)
          }
        );
      },
      (t, error) => { console.log("db error load menus"); },
      (_t, _success) => { console.log("db load menus") }
    );
  // })
}

const getFirstMenuId = (setMenuId) => {
  db.transaction(
    tx => {
      tx.executeSql(`SELECT * FROM menus_tbl ORDER BY id ASC LIMIT 1`,[],
        
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            let menu_id = _array[0].id;
            setMenuId(menu_id);
          }
        }
      );
    },
    (_t, _error) => { console.log("db error first menu id"); },
    (_t, _success) => { console.log("db first menu id"); }
  )
}


export const MenuModel = {
  createMenusTable, insertMenus, getMenus, getFirstMenuId
};