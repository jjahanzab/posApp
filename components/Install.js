import React, { useState, useContext, useEffect } from "react";
import * as Updates from 'expo-updates';
import axios from "axios";
import { StyleSheet, Text, View, Button, ActivityIndicator, addons } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from "react-redux";
import { DbModel } from '../Models/DbModel';
import { getTables, changeInstallStatus } from '../redux/actions/UserAction';
import { db } from '../Models/Database';
import { InstallContext } from "../context/InstallContext";

export default function Install(props) {

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const [installLoader, setInstallLoader] = useState(false);
  let tableStatusStorage =  { settings:false, users:false, menus:false, submenus:false, groups: false, addons:false, submenu_addons:false, menu_submenu_timings:false, menu_submenu_timingslots:false };

  const dispatch = useDispatch();
  const { tables, user, users, players, install } = useSelector(state => state.UserReducer);

  const { baseUrl } = useContext(InstallContext);

  const netInfo = useNetInfo();


  useEffect(() => {
    const saveUploadTableStatus = async () => {
      try {
        let tablesStatus = await AsyncStorage.getItem('tables-status');

        if (tablesStatus == null || tablesStatus == '') {

          let stringValue = JSON.stringify(tableStatusStorage);
          AsyncStorage.setItem('tables-status', stringValue);
          console.log('empty storage');

        } else {
          let objectValue = JSON.parse(tablesStatus);
          tableStatusStorage = objectValue;
          // console.log(objectValue);
        }
      } catch (error) {
        console.log('saveUploadTableStatus catch error');
      }
    }
    saveUploadTableStatus();
  },[])


  const uploadSettings = () => {

    return new Promise((resolve, reject) => {
      try {

        db.transaction(tx => {
          tx.executeSql(`drop table if exists settings_tbl`, [])
        },
          (_, error) => { console.log("db error drop settings table") },
          (_, success) => { console.log("db drop settings table") }
        )
        db.transaction(tx => {
          tx.executeSql(`create table if not exists settings_tbl 
            ( 
              id integer primary key not null, 
              shop_name text, 
              contact text, 
              shop_number text, 
              return_url text, 
              street text, 
              city text, 
              postcode text, 
              latitude text, 
              longitude text, 
              radius text, 
              test_number text, 
              order_value_delivery text, 
              order_value_collection text, 
              service_charges_collection_cash text, 
              service_charges_discount_collection_cash text, 
              service_charges_collection_card text, 
              service_charges_discount_collection_card text, 
              service_charges_delivery_cash text, 
              service_charges_discount_delivery_cash text, 
              service_charges_delivery_card text, 
              service_charges_discount_delivery_card text, 
              delivery_method text, 
              delivery_charges text, 
              delivery_charges_default text, 
              shop_website text, 
              shop_description text, 
              table_unreserve_message text, 
              test_mode text, 
              card_on_collection text, 
              card_on_delivery text, 
              cash_on_collection text, 
              cash_on_delivery text, 
              preorder_status text, 
              status text, 
              website_status text, 
              deactive_message text, 
              website_deactive_message text, 
              customer_titles text, 
              delivery_discount_type text, 
              collection_discount_type text, 
              delivery_discount text, 
              collection_discount text, 
              delivery_discount_threshold text, 
              collection_discount_threshold text, 
              sale_receipt text, 
              sale_receipt_no text, 
              kitchen_receipt text, 
              kitchen_receipt_no text, 
              sale_kitchen_receipt text, 
              sale_kitchen_receipt_no text, 
              block_unverifyaddress_googleapi text, 
              auto_beep text, 
              notify text, 
              general_meta_tags text 
            )
          `);
        },
          (_, error) => { console.log("db error create settings table") },
          (_, success) => { console.log("db create settings table") }
        )

        axios.get(`${baseUrl}/get-general-settings`).then((e_response) => {
          if (e_response && e_response.data.statusCode == '200') {
            let appSettings = e_response.data.generalSettings;

            if (Object.keys(appSettings).length > 0) {
              
              var singleArr = Object.values(appSettings);

              db.transaction( tx => {
                  tx.executeSql(`insert into settings_tbl ( 
                    id, 
                    shop_name, 
                    contact, 
                    shop_number, 
                    return_url, 
                    street, 
                    city, 
                    postcode, 
                    latitude, 
                    longitude, 
                    radius, 
                    test_number, 
                    order_value_delivery, 
                    order_value_collection, 
                    service_charges_collection_cash, 
                    service_charges_discount_collection_cash, 
                    service_charges_collection_card, 
                    service_charges_discount_collection_card, 
                    service_charges_delivery_cash, 
                    service_charges_discount_delivery_cash, 
                    service_charges_delivery_card, 
                    service_charges_discount_delivery_card, 
                    delivery_method, 
                    delivery_charges, 
                    delivery_charges_default, 
                    shop_website, 
                    shop_description, 
                    table_unreserve_message, 
                    test_mode, 
                    card_on_collection, 
                    card_on_delivery, 
                    cash_on_collection, 
                    cash_on_delivery, 
                    preorder_status, 
                    status, 
                    website_status, 
                    deactive_message, 
                    website_deactive_message, 
                    customer_titles, 
                    delivery_discount_type, 
                    collection_discount_type, 
                    delivery_discount, 
                    collection_discount, 
                    delivery_discount_threshold, 
                    collection_discount_threshold, 
                    sale_receipt, 
                    sale_receipt_no, 
                    kitchen_receipt, 
                    kitchen_receipt_no, 
                    sale_kitchen_receipt, 
                    sale_kitchen_receipt_no, 
                    block_unverifyaddress_googleapi, 
                    auto_beep, 
                    notify, 
                    general_meta_tags
                  ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                  singleArr );
                },
                (t, error) => { 
                  reject(`db error insert settings table`);
                  console.log("db error insert settings table"); 
                },
                (t, success) => { 
                  console.log("db insert settings table "); 
                  resolve('resolved axios request of settings');
                }
              )
              
            }
          } else {
            reject(`uploadSettings api data not found`);
          }
        }).catch((error) => {
          reject(`insert settings api api error ${error}`);
          console.log(`insert settings api api error ${error}`);
        })

      } catch (error) {
        reject(`insert settings api try catch error`);
        console.log(`insert settings api try catch error`);
      }
    });
    
  }
  const loadSettings = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from settings_tbl',[],
          (_, { rows: { _array } }) => {
            console.log('settings length '+ _array.length);
            tableStatusStorage = { ...tableStatusStorage, settings: true};
          }
        );
      },
      (_t, _error) => { console.log("db error load settings") },
      (_t, _success) => { console.log("db load settings"); }
    );
  }

  
  const uploadUsers = () => {

    return new Promise((resolve, reject) => {
      try {

        db.transaction(tx => {
          tx.executeSql(`drop table if exists users_tbl`, [])
        },
          (_, error) => { console.log("db error drop users table") },
          (_, success) => { console.log("db drop users table") }
        )
        db.transaction(tx => {
          tx.executeSql(`create table if not exists users_tbl 
            ( id integer primary key not null, 
              name text,
              email text unique,
              password text,
              online_user text,
              role text
            )
          `);
        },
          (_, error) => { console.log("db error create users table") },
          (_, success) => { console.log("db create users table") }
        )

        axios.get(`${baseUrl}/get-all-users`).then((e_response) => {
          if (e_response && e_response.data.statusCode == '200') {
            let appUsers = e_response.data.users;

            if (appUsers.length > 0) {
              let count = 0;

              appUsers.forEach(element => {
                
                db.transaction( tx => {
                    count = count + 1;
                    var singleArr = Object.values(element);
                    // console.log(singleArr);
                    tx.executeSql(`insert into users_tbl ( id, name, email, password, online_user, role ) values (?, ?, ?, ?, ?, ?)`, singleArr );
                  },
                  (t, error) => { 
                    reject(`db error insert users table`);
                    console.log("db error insert users table"); 
                  },
                  (t, success) => { console.log("db insert users table "); 
                    if (count == appUsers.length) {
                      resolve('resolved all axios requests of users');
                    }
                  }
                )
              });
            }
          } else {
            reject(`uploadUsers api data not found`);
          }
        }).catch((error) => {
          reject(`insert users api api error ${error}`);
          console.log(`insert users api api error ${error}`);
        })

      } catch (error) {
        reject(`insert users api try catch error`);
        console.log(`insert users api try catch error`);
      }
    });
    
  }
  const loadUsers = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from users_tbl',[],
          (_, { rows: { _array } }) => {
            console.log('users length '+ _array.length);
            tableStatusStorage = { ...tableStatusStorage, users: true};
          }
        );
      },
      (_t, _error) => { console.log("db error load users") },
      (_t, _success) => { console.log("db load users"); }
    );
  }


  const uploadMenus = () => {

    return new Promise((resolve, reject) => {
      try {

        db.transaction(tx => {
          tx.executeSql(`drop table if exists menus_tbl`, [])
        },
          (_, error) => { console.log("db error drop menus table") },
          (_, success) => { console.log("db drop menus table") }
        )
        db.transaction(tx => {
          tx.executeSql(`create table if not exists menus_tbl 
            ( id integer primary key not null, 
              name text,
              orders text
            )
          `);
        },
          (_, error) => { console.log("db error create menus table") },
          (_, success) => { console.log("db create menus table") }
        )

        axios.get(`${baseUrl}/get-all-menus`).then((e_response) => {
          
          if (e_response && e_response.data.statusCode == '200') {
            let appMenus = e_response.data.menus;

            if (appMenus.length > 0) {
              let count = 0;

              appMenus.forEach(element => {
                
                db.transaction( tx => { 
                    count = count + 1;
                    var singleArr = Object.values(element);
                    // console.log(singleArr);
                    tx.executeSql( `insert into menus_tbl ( id, name, orders ) values (?, ?, ?)`, singleArr );
                  },
                  (t, error) => { 
                    reject(`db error insert menus table`);
                    console.log("db error insert menus table");
                  },
                  (t, success) => { console.log("db insert menus table "); 
                    if (count == appMenus.length) {
                      resolve('resolve all axios requests of menus');
                    }
                  }
                )
              });
            }
          } else {
            reject(`uploadMenus api data not found`);
          }
          
        }).catch((error) => {
          reject(`insert menus api try catch error`);
          console.log(`insert menus api api error ${error}`);
        })

      } catch (error) {
        reject(`insert menus api try catch error`);
        console.log(`insert menus api try catch error`);
      }
    });
    
  }
  const loadMenus = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from menus_tbl',[],
          (_, { rows: { _array } }) => {
            console.log('menus length '+ _array.length);
            tableStatusStorage = { ...tableStatusStorage, menus: true};
          }
        );
      },
      (_t, _error) => { console.log("db error load menus") },
      (_t, _success) => { console.log("db load menus"); }
    );
  }


  const uploadSubmenus = () => {

    return new Promise((resolve, reject) => {
      try {

        db.transaction(tx => {
          tx.executeSql(`drop table if exists submenus_tbl`, [])
        },
          (_, error) => { console.log("db error drop submenus table") },
          (_, success) => { console.log("db drop submenus table") }
        )
        db.transaction(tx => {
          tx.executeSql(`create table if not exists submenus_tbl 
              ( id integer primary key not null, 
                menu_id text,
                name text,
                description text,
                price text,
                orders text
              )
            `);
        },
          (_, error) => { console.log("db error create submenus table") },
          (_, success) => { console.log("db create submenus table") }
        )

        let total_pages = 0;
        let url = `${baseUrl}/get-all-submenus`;

        // parent axios call  //
        axios.get(url).then((f_response) => {
          if (f_response && f_response.data.statusCode == '200') {
            let res = f_response.data.submenus;

            if (res.total > 0) {
              total_pages = res.last_page;
            }
          }
        }).then( async () => {

          var count = 0;

          // loop for child axios calls //
          for (var k = 1; k <= total_pages; k++) {

            // child axios call //
            await axios.get(`${url}/?page=${k}`).then( async (s_response) => {
              if (s_response && s_response.data.statusCode == '200') {

                var resp = s_response.data.submenus;
                if (resp.data.length > 0) {

                  var elementsArr = resp.data;
                  count = count + 1;

                  var submenus_params = "";

                  await db.transaction(tx => {

                    elementsArr.forEach(element => {
                      submenus_params = submenus_params +'('+element.id+',"'+element.menu_id+'","'+element.name+'","'+element.description+'","'+element.price+'","'+element.order+'"),';
                    })
                    submenus_params = submenus_params.slice(0, -1);
                    // console.log(submenus_params);
                    tx.executeSql(`insert into submenus_tbl ( id, menu_id, name, description, price, orders ) values ${submenus_params};`);

                    // elementsArr.forEach(element => {
                    //   var singleArr = Object.values(element);
                    //   console.log(singleArr);
                    //   tx.executeSql(`insert into submenus_tbl ( id, menu_id, name, description, price, orders ) values (?, ?, ?, ?, ?, ?)`, singleArr);
                    // });
                    },
                    (_t, _error) => { 
                      reject(`db error insert submenus table`);
                      console.log("db error insert submenus table"); 
                    },
                    (_t, _success) => { 
                      console.log("db insert submenus table"); 
                    }
                  )

                  if (count == total_pages) {
                    resolve('resolve all axios requests of submenus');
                  }
                }
              } else {
                reject(`uploadSubmenus api data not found`);
              }
            }).catch((error) => {
              reject(`get submenus child api axios error loop ${k}`);
              console.log(`get submenus child api axios error loop ${k}`);
            })
          }

        }).catch((error) => {
          reject(`get submenus parent api axios error`);
          console.log(`get submenus parent api axios error`);
        })

      } catch (error) {
        reject(`insert submenus api try catch error`);
        console.log(`insert submenus api try catch error`);
      }
    });
    
  }
  const loadSubmenus = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from submenus_tbl',[],
          (_, { rows: { _array } }) => {
            console.log('submenus length'+ _array.length);
            tableStatusStorage = { ...tableStatusStorage, submenus: true};
          }
        );
      },
      (_t, _error) => { console.log("db error load submenus") },
      (_t, _success) => { console.log("db load submenus"); }
    );
  }


  const uploadGroups = () => {

    return new Promise((resolve, reject) => {
      try {

        db.transaction(tx => {
          tx.executeSql(`drop table if exists groups_tbl`, [])
        },
          (_, error) => { console.log("db error drop groups table") },
          (_, success) => { console.log("db drop groups table") }
        )
        db.transaction(tx => {
          tx.executeSql(`create table if not exists groups_tbl 
            ( id integer primary key not null, 
              name text,
              orders text,
              min_quantity text,
              max_quantity text,
              special_group text
            )
          `);
        },
          (_, error) => { console.log("db error create groups table") },
          (_, success) => { console.log("db create groups table") }
        )

        axios.get(`${baseUrl}/get-all-groups`).then((e_response) => {
          
          if (e_response && e_response.data.statusCode == '200') {
            let appgroups = e_response.data.groups;

            if (appgroups.length > 0) {
              let groupcount = 0;

              appgroups.forEach(element => {
                
                db.transaction( tx => { 
                    groupcount = groupcount + 1;
                    var singleArr = Object.values(element);
                    // console.log(singleArr);
                    tx.executeSql( `insert into groups_tbl ( id, name, orders, min_quantity, max_quantity, special_group ) values (?, ?, ?, ?, ?, ?)`, singleArr );
                  },
                  (t, error) => { 
                    reject(`db error insert groups table`);
                    console.log("db error insert groups table"); },
                  (t, success) => { 
                    console.log("db insert groups table "); 
                    if (groupcount == appgroups.length) {
                      resolve('resolve all axios requests of groups');
                    }
                  }
                )
              });
            }
          } else {
            reject(`uploadGroups api data not found`);
          }
          
        }).catch((error) => {
          reject(`insert groups api api error ${error}`);
          console.log(`insert groups api api error ${error}`);
        })

      } catch (error) {
        reject(`insert groups api try catch error`);
        console.log(`insert groups api try catch error`);
      }
    });
    
  }
  const loadGroups = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from groups_tbl',[],
          (_, { rows: { _array } }) => {
            console.log('groups length '+ _array.length);
            tableStatusStorage = { ...tableStatusStorage, groups: true};
          }
        );
      },
      (_t, _error) => { console.log("db error load groups") },
      (_t, _success) => { console.log("db load groups"); }
    );
  }


  const uploadAddons = () => {

    return new Promise((resolve, reject) => {
      try {

        db.transaction(tx => {
          tx.executeSql(`drop table if exists addons_tbl`, [])
        },
          (_, error) => { console.log("db error drop addons table") },
          (_, success) => { console.log("db drop addons table") }
        )
        db.transaction(tx => {
          tx.executeSql(`create table if not exists addons_tbl 
            ( id integer primary key not null, 
              group_id text,
              name text,
              price text,
              orders text
            )
          `);
        },
          (_, error) => { console.log("db error create addons table") },
          (_, success) => { console.log("db create addons table") }
        )

        let total_pages = 0;
        let url = `${baseUrl}/get-all-addons`;

        // parent axios call  //
        axios.get(url).then((f_response) => {
          if (f_response && f_response.data.statusCode == '200') {
            let res = f_response.data.addons;

            if (res.total > 0) {
              total_pages = res.last_page;
            }
          } else {
            reject(`uploadAddons api data not found`);
          }
        }).then(async () => {

          var addonscount = 0;

          // loop for child axios calls //
          for (var l = 1; l <= total_pages; l++) {

            // child axios call //
            await axios.get(`${url}/?page=${l}`).then( async (s_response) => {
              if (s_response && s_response.data.statusCode == '200') {

                var resp = s_response.data.addons;
                if (resp.data.length > 0) {

                  var elementsArr = resp.data;
                  addonscount = addonscount + 1;

                  var addons_params = "";

                  await db.transaction(tx => {

                    elementsArr.forEach(element => {
                      addons_params = addons_params +'('+element.id+',"'+element.group_id+'","'+element.name+'","'+element.price+'","'+element.order+'"),';
                    })
                    addons_params = addons_params.slice(0, -1);

                    tx.executeSql(`insert into addons_tbl ( id, group_id, name, price, orders ) values ${addons_params};`);

                    // elementsArr.forEach(element => {
                    //   var singleArr = Object.values(element);
                      // console.log(singleArr);
                    //   tx.executeSql(`insert into addons_tbl ( id, group_id, name, price, orders ) values (?, ?, ?, ?, ?)`, singleArr);
                    // });
                  },
                    (_t, _error) => { 
                      reject(`db error insert addons table`);
                      console.log("db error insert addons table"); 
                    },
                    (_t, _success) => { 
                      console.log("db insert addons table"); 
                    }
                  )

                  if (addonscount == total_pages) {
                    resolve('resolve all axios requests of addons');
                  }
                }
              }
            }).catch((error) => {
              reject(`get addons child api axios error loop ${l}`);
              console.log(`get addons child api axios error loop ${l}`);
            })
          }

        }).catch((error) => {
          reject(`get addons parent api axios error`);
          console.log(`get addons parent api axios error`);
        })

      } catch (error) {
        reject(`insert addons api try catch error`);
        console.log(`insert addons api try catch error`);
      }
    });
    
  }
  const loadAddons = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from addons_tbl',[],
          (_, { rows: { _array } }) => {
            console.log('addons length'+ _array.length);
            tableStatusStorage = { ...tableStatusStorage, addons: true};
          }
        );
      },
      (_t, _error) => { console.log("db error load addons") },
      (_t, _success) => { console.log("db load addons"); }
    );
  }


  const uploadSubmenuAddons = () => {

    return new Promise((resolve, reject) => {
      try {

        db.transaction(tx => {
          tx.executeSql(`drop table if exists submenu_addons_tbl`, [])
        },
          (_, error) => { console.log("db error drop submenu_addons table") },
          (_, success) => { console.log("db drop submenu_addons table") }
        )
        db.transaction(tx => {
          tx.executeSql(`create table if not exists submenu_addons_tbl 
            ( id integer primary key not null, 
              menu_id text,
              submenu_id text,
              group_id text,
              addson_id text,
              group_order text
            )
          `);
        },
          (_, error) => { console.log("db error create submenu_addons table") },
          (_, success) => { console.log("db create submenu_addons table") }
        )

        var total_pages_sa = 0;
        var url_sa = `${baseUrl}/get-all-submenu-addons`;

        // parent axios call  //
        axios.get(url_sa).then((f_response) => {
          if (f_response && f_response.data.statusCode == '200') {
            var res_sa = f_response.data.submenu_addons;

            if (res_sa.total > 0) {
              total_pages_sa = res_sa.last_page;
            }
          } else {
            reject(`uploadSubmenuAddons api data not found`);
          }
        }).then(async () => {

          var count_sa = 0;

          // loop for child axios calls //
          for (var m = 1; m <= total_pages_sa; m++) {

            // child axios call //
            await axios.get(`${url_sa}/?page=${m}`).then( async (s_response) => {
              if (s_response && s_response.data.statusCode == '200') {

                var resp = s_response.data.submenu_addons;
                if (resp.data.length > 0) {

                  var elementsArr = resp.data;
                  count_sa = count_sa + 1;

                  if (count_sa % 10 === 0 ) {
                    await sleep(1000);
                  }

                  await db.transaction(tx => {
                    
                    var submenu_addons_params = "";

                    elementsArr.forEach(element => {
                      submenu_addons_params = submenu_addons_params +'('+element.id+',"'+element.menu_id+'","'+element.submenu_id+'","'+element.group_id+'","'+element.addson_id+'","'+element.group_order+'"),';
                    })
                    submenu_addons_params = submenu_addons_params.slice(0, -1);
                    tx.executeSql(`insert into submenu_addons_tbl ( id, menu_id, submenu_id, group_id, addson_id, group_order ) values ${submenu_addons_params};`);

                    // elementsArr.forEach(element => {
                      // var singleArr = Object.values(element);
                      // console.log(singleArr);
                      // tx.executeSql(`insert into submenu_addons_tbl ( id, menu_id, submenu_id, group_id, addson_id, group_order ) values (?, ?, ?, ?, ?, ?)`, singleArr);
                    // });
                    },
                    (_t, _error) => { 
                      reject(`db error insert submenu_addons table`);
                      console.log("db error insert submenu_addons table"); 
                    },
                    (_t, _success) => { 
                      console.log("db insert submenu_addons table"); 
                    }
                  )

                  if (count_sa == total_pages_sa) {
                    resolve('resolve all axios requests of submenu_addons');
                  }
                }
              }
            }).catch((error) => {
              console.log(`get submenu_addons child api axios error loop ${m} `+error);
              reject(`get submenu_addons child api axios error loop ${m}`);
            })
          }

        }).catch((error) => {
          reject(`get submenu_addons parent api axios error`);
          console.log(`get submenu_addons parent api axios error`);
        })

      } catch (error) {
        reject(`insert submenu_addons api try catch error`);
        console.log(`insert submenu_addons api try catch error`);
      }
    });
    
  }
  const loadSubmenuAddons = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from submenu_addons_tbl',[],
          (_, { rows: { _array } }) => {
            console.log('submenu_addons length'+ _array.length);
            tableStatusStorage = { ...tableStatusStorage, submenu_addons: true};
          }
        );
      },
      (_t, _error) => { console.log("db error load submenu_addons") },
      (_t, _success) => { console.log("db load submenu_addons"); }
    );
  }


  const uploadMenuSubmenuTimings = () => {

    return new Promise((resolve, reject) => {
      try {

        db.transaction(tx => {
          tx.executeSql(`drop table if exists menu_submenu_timings_tbl`, [])
        },
          (_, error) => { console.log("db error drop menu_submenu_timings table") },
          (_, success) => { console.log("db drop menu_submenu_timings table") }
        )
        db.transaction(tx => {
          tx.executeSql(`create table if not exists menu_submenu_timings_tbl 
            ( id integer primary key not null,
              menu_id text,
              submenu_id text,
              day text,
              day_status text,
              day_detail text,
              delivery_status text,
              delivery_detail text,
              collection_status text,
              collection_detail text,
              pos_status text,
              schedule_detail text
            )
          `);
        },
          (_, error) => { console.log("db error create menu_submenu_timings table") },
          (_, success) => { console.log("db create menu_submenu_timings table") }
        )

        axios.get(`${baseUrl}/get-all-menusubmenu-timings`).then((e_response) => {
          if (e_response && e_response.data.statusCode == '200') {
            let appMenuSubmenuTimings = e_response.data.menu_submenu_timings;

            if (appMenuSubmenuTimings.length > 0) {
              let count = 0;

              appMenuSubmenuTimings.forEach(element => {
                
                db.transaction( tx => {
                    count = count + 1;
                    var singleArr = Object.values(element);
                    // console.log(singleArr);
                    tx.executeSql(`insert into menu_submenu_timings_tbl ( id, menu_id, submenu_id, day, day_status, day_detail, delivery_status, delivery_detail, collection_status, collection_detail, pos_status, schedule_detail ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, singleArr );
                  },
                  (t, error) => { 
                    reject(`db error insert menu_submenu_timings table`);
                    console.log("db error insert menu_submenu_timings table"); 
                  },
                  (t, success) => { console.log("db insert menu_submenu_timings table "); 
                    if (count == appMenuSubmenuTimings.length) {
                      resolve('resolved all axios requests of menu_submenu_timings');
                    }
                  }
                )
              });
            }
          } else if (e_response && e_response.data.statusCode == '404') {
            resolve(`uploadMenuSubmenuTimings api data not found`);
          } else {
            reject(`uploadMenuSubmenuTimings api unwanted status code`);
          }
        }).catch((error) => {
          reject(`insert menu_submenu_timings api api error ${error}`);
          console.log(`insert menu_submenu_timings api api error ${error}`);
        })

      } catch (error) {
        reject(`insert menu_submenu_timings api try catch error`);
        console.log(`insert menu_submenu_timings api try catch error`);
      }
    });
    
  }
  const loadMenuSubmenuTimings = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from menu_submenu_timings_tbl',[],
          (_, { rows: { _array } }) => {
            console.log('menu_submenu_timings length '+ _array.length);
            tableStatusStorage = { ...tableStatusStorage, menu_submenu_timings: true};
          }
        );
      },
      (_t, _error) => { console.log("db error load menu_submenu_timings") },
      (_t, _success) => { console.log("db load menu_submenu_timings"); }
    );
  }


  const uploadMenuSubmenuTimingSlots = () => {

    return new Promise((resolve, reject) => {
      try {

        db.transaction(tx => {
          tx.executeSql(`drop table if exists menu_submenu_timingslots_tbl`, [])
        },
          (_, error) => { console.log("db error drop menu_submenu_timingslots table") },
          (_, success) => { console.log("db drop menu_submenu_timingslots table") }
        )
        db.transaction(tx => {
          tx.executeSql(`create table if not exists menu_submenu_timingslots_tbl 
            ( id integer primary key not null,
              menu_id text,
              submenu_id text,
              day text,
              delivery_start text,
              delivery_end text,
              collection_start text,
              collection_end text,
              pos_status text
            )
          `);
        },
          (_, error) => { console.log("db error create menu_submenu_timingslots table") },
          (_, success) => { console.log("db create menu_submenu_timingslots table") }
        )

        axios.get(`${baseUrl}/get-all-menusubmenu-timingslots`).then((e_response) => {
          if (e_response && e_response.data.statusCode == '200') {
            let appMenuSubmenuTimingSlots = e_response.data.menu_submenu_timingslots;

            if (appMenuSubmenuTimingSlots.length > 0) {
              let count = 0;

              appMenuSubmenuTimingSlots.forEach(element => {
                
                db.transaction( tx => {
                    count = count + 1;
                    var singleArr = Object.values(element);
                    // console.log(singleArr);
                    tx.executeSql(`insert into menu_submenu_timingslots_tbl ( id, menu_id, submenu_id, day, delivery_start, delivery_end, collection_start, collection_end, pos_status ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`, singleArr );
                  },
                  (t, error) => { 
                    reject(`db error insert menu_submenu_timingslots table`);
                    console.log("db error insert menu_submenu_timingslots table"); 
                  },
                  (t, success) => { console.log("db insert menu_submenu_timingslots table "); 
                    if (count == appMenuSubmenuTimingSlots.length) {
                      resolve('resolved all axios requests of menu_submenu_timingslots');
                    }
                  }
                )
              });
            }
          } else if (e_response && e_response.data.statusCode == '404') {
            resolve(`uploadMenuSubmenuTimingSlots api data not found`);
          } else {
            reject(`uploadMenuSubmenuTimingSlots api unwanted status code`);
          }
        }).catch((error) => {
          reject(`insert menu_submenu_timingslots api api error ${error}`);
          console.log(`insert menu_submenu_timingslots api api error ${error}`);
        })

      } catch (error) {
        reject(`insert menu_submenu_timingslots api try catch error`);
        console.log(`insert menu_submenu_timingslots api try catch error`);
      }
    });
    
  }
  const loadMenuSubmenuTimingSlots = () => {
    db.transaction(
      tx => {
        tx.executeSql('select * from menu_submenu_timingslots_tbl',[],
          (_, { rows: { _array } }) => {
            console.log('menu_submenu_timingslots length '+ _array.length);
            tableStatusStorage = { ...tableStatusStorage, menu_submenu_timingslots: true};
          }
        );
      },
      (_t, _error) => { console.log("db error load menu_submenu_timingslots") },
      (_t, _success) => { console.log("db load menu_submenu_timingslots"); }
    );
  }


  // set values in storage & redux-state //
  const installDep = async () => {

    if (netInfo.isConnected == true) {

      console.log(tableStatusStorage);

      if (tableStatusStorage.settings == false && tableStatusStorage.users == false && tableStatusStorage.menus == false && tableStatusStorage.submenus == false && tableStatusStorage.addons == false && tableStatusStorage.submenu_addons == false) {

        setInstallLoader(true);

        uploadSettings().then( async (settings_message) => {
          
          await sleep(1000);
          console.log(`${settings_message}`);
          await loadSettings();
          await sleep(2000);
          console.log(tableStatusStorage);

          // upload users in offline database //
          uploadUsers().then( async (users_message) => {
            
            await sleep(1000);
            console.log(`${users_message}`);
            await loadUsers();
            await sleep(2000);
            console.log(tableStatusStorage);


            // upload menus in offline database //
            uploadMenus().then( async (menus_message) => {

              await sleep(1000);
              console.log(menus_message);
              await loadMenus();
              await sleep(2000);
              console.log(tableStatusStorage);


              // upload submenus in offline database //
              uploadSubmenus().then( async (submenus_message) => {

                await sleep(1000);
                console.log(submenus_message);
                await loadSubmenus();
                await sleep(2000);
                console.log(tableStatusStorage);


                // upload groups in offline database //
                uploadGroups().then( async (groups_message) => {

                  await sleep(1000);
                  console.log(groups_message);
                  await loadGroups();
                  await sleep(2000);
                  console.log(tableStatusStorage);


                  // upload addons in offline database //
                  uploadAddons().then( async (addons_message) => {

                    await sleep(1000);
                    console.log(addons_message);
                    await loadAddons();
                    await sleep(2000);
                    console.log(tableStatusStorage);


                    // upload submenu addons in offline database //
                    uploadSubmenuAddons().then( async (submenu_addons_message) => {

                      await sleep(1000);
                      console.log(submenu_addons_message);
                      await loadSubmenuAddons();
                      await sleep(2000);
                      console.log(tableStatusStorage);
                      

                        // upload menu submenu timings in offline database //
                        uploadMenuSubmenuTimings().then( async (menu_submenu_timings_message) => {

                          await sleep(1000);
                          console.log(menu_submenu_timings_message);
                          await loadMenuSubmenuTimings();
                          await sleep(2000);
                          console.log(tableStatusStorage);


                          // upload menu submenu timing slots in offline database //
                          uploadMenuSubmenuTimingSlots().then( async (menu_submenu_timingslots_message) => {

                            await sleep(1000);
                            console.log(menu_submenu_timingslots_message);
                            await loadMenuSubmenuTimingSlots();
                            await sleep(2000);
                            console.log(tableStatusStorage);


                            let stringValue = JSON.stringify(tableStatusStorage);
                            AsyncStorage.setItem('tables-status', stringValue);
                            console.log('all tables has upload');

                            AsyncStorage.setItem('install', 'second');
                            dispatch(changeInstallStatus('second'));
                            console.log('set second value');

                            setInstallLoader(false);


                          }).catch( (menu_submenu_timingslots_message) =>{
                            rejectInstallation(menu_submenu_timingslots_message);
                          });

                        }).catch( (menu_submenu_timingslots_message) =>{
                          rejectInstallation(menu_submenu_timingslots_message);
                        });


                    }).catch( (submenu_addons_message) =>{
                      rejectInstallation(submenu_addons_message);
                    });
                    
                  }).catch( (addons_message) =>{
                    rejectInstallation(addons_message);
                  });
                  
                }).catch( (groups_message) =>{
                  rejectInstallation(groups_message);
                });
                
              }).catch( (submenus_message) =>{
                rejectInstallation(submenus_message);
              });

            }).catch( (menus_message) =>{
              rejectInstallation(menus_message);
            });
            
          }).catch( (users_message) =>{
            rejectInstallation(users_message);
          });

        }).catch( (settings_message) =>{
          rejectInstallation(settings_message);
        });

      } else if (tableStatusStorage.settings == true && tableStatusStorage.users == true && tableStatusStorage.menus == true && tableStatusStorage.submenus == true && tableStatusStorage.addons == true && tableStatusStorage.submenu_addons == true) {
        
        AsyncStorage.setItem('install', 'second');
        dispatch(changeInstallStatus('second'));
        console.log('set second value');
      }
      
    }

  }

  const rejectInstallation = (message) => {
    console.log(`${message}`);
    setInstallLoader(false);
  }


  const reloadApp = async () => {
    await Updates.reloadAsync();
  }

  if (installLoader) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color="#2FA8FD" />
        <Text></Text>
        <Text>Please wait!</Text>
        <Text>Installling dependencies...</Text>
      </View>
    )

  } else {

    if (netInfo.isConnected == false) {
      return (
        <>
          <View style={styles.container}>
            <Avatar.Image size={100} source={require('../assets/wifi.png')} style={{ backgroundColor:'#ffffff' }} />
            <Text style={{ marginTop:20, marginBottom:20, fontSize:16, fontWeight:"700" }}>{'Connect to the internet'}</Text>
            <Text style={{ marginBottom:20, fontSize:16, fontWeight:"700" }}>{'You are offline. Check your connection.'}</Text>
            <Button title='Retry' onPress={() => reloadApp()} buttonColor={"#444444"} style={{ marginTop:30, marginBottom:30 }} />
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.container}>
            <Button title='Install Dependencies' onPress={() => installDep()} buttonColor={"#2196F3"} style={{ marginTop:50, marginBottom:50 }} />
            {/* <Text>Is Connected? {netInfo.isConnected?.toString()}</Text> */}
          </View>
        </>
      )
    }

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
