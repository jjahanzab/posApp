import axios from "axios";
import { db } from "../../Models/Database";

export const GET_DB_USERS = 'GET_DB_USERS';
export const GET_DB_MENUS = 'GET_DB_MENUS';
export const GET_DB_SUBMENUS = 'GET_DB_SUBMENUS';
export const GET_DB_GROUPS = 'GET_DB_GROUPS';
export const GET_DB_ADDONS = 'GET_DB_ADDONS';
export const GET_DB_SUBMENUADDONS = 'GET_DB_SUBMENUADDONS';
export const GET_DB_MENUSUBMENUTIMINGS = 'GET_DB_MENUSUBMENUTIMINGS';
export const GET_DB_MENUSUBMENUTIMINGSLOTS = 'GET_DB_MENUSUBMENUTIMINGSLOTS';
export const GET_DB_GROUPADDONSTATUS = 'GET_DB_GROUPADDONSTATUS';
export const GET_DB_SUBMENUGROUPADDONS = 'GET_DB_SUBMENUGROUPADDONS';

export const AUTH_STATUS = 'AUTH_STATUS';
export const GET_DB_SUBMENUS_ID = 'GET_DB_SUBMENUS_ID';
export const GET_DB_SUBMENUADDONS_ID = 'GET_DB_SUBMENUADDONS_ID';


let d = new Date();
let dayNum = d.getDay();
dayNum = dayNum + 1;
dayNum = dayNum + '.0';
// dayNum = '4.0';
let hourMin = d.getHours()+":"+d.getMinutes();
// hourMin = '10:00';

// get db tables data //
export const getDbUsers = () => {
  return dispatch => {
    try {
      // return new Promise((resolve, reject) => {
        // let countDbUsers = 0;
        db.transaction(
          tx => {
            tx.executeSql('select * from users_tbl',[],
              (_, { rows: { _array } }) => {
                if (_array.length > 0) {
                  // countDbUsers = _array.length;
                  dispatch({
                    type: GET_DB_USERS,
                    payload: _array
                  })
                }
              }
            );
          },
          (_t, _error) => { 
            console.log("db error load users");
            // reject(0);
          },
          (_t, _success) => { 
            console.log("db load users");
            // resolve("db load users resolve");
            // resolve(countDbUsers);
          }
        );
      // })
    } catch (error) {
      console.log('getDbUsers action catch error');
    }
  }
}

export const getDbMenus = () => {
  try {
    return dispatch => {
      db.transaction(
        tx => {
          tx.executeSql('SELECT * FROM menus_tbl ORDER BY orders ASC',[],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                
                let menusArr = _array;

                // get menus timings values //
                const getMenusTimings = (menus) => {
                  return new Promise((resolve, reject) => {
                    try {
                        
                        let menusTimings = [];
                        let counter1 = 0;
                        menus.forEach(menu => {
                          let menu_id = menu.id+'.0';
                          db.transaction(
                            tx => {
                              counter1 = counter1 + 1;
                              tx.executeSql(`SELECT * FROM menu_submenu_timings_tbl 
                                WHERE day = ${dayNum} AND menu_id = ${menu_id} AND submenu_id IS NULL AND pos_status = "A" 
                                ORDER BY id ASC LIMIT 1`,[],

                                (_, { rows: { _array } }) => {
                                  // console.log(_array);
                                  let timing = {};
                                  if (_array.length > 0) {
                                    timing.day = _array[0].day;
                                    timing.day_status = _array[0].day_status;
                                    timing.delivery_status = _array[0].delivery_status;
                                    timing.collection_status = _array[0].collection_status;
                                  } else {
                                    timing.day = dayNum;
                                    timing.day_status = 'I';
                                    timing.delivery_status = 'I';
                                    timing.collection_status = 'I';
                                  }
                                  menu.timings = timing;
                                  menusTimings.push(menu);
                                }
                              );
                            },
                            (_t, _error) => { console.log("db error load menu_timings") },
                            (_t, _success) => { 
                              if (counter1 == menus.length) {
                                console.log("db load menu_timings");
                                resolve(menusTimings);
                              }
                            }
                          );
                        });

                    } catch (error) {
                      reject(`reject menu_timings try catch error`);
                      console.log(`menu_timings try catch error`);
                    }
                  });
                }

                // get menus timing slots values //
                const getMenusTimingSlots = (menus_timings) => {
                  return new Promise((resolve, reject) => {
                    try {
                        let menusTimingSlots = [];
                        let counter2 = 0;
                        menus_timings.forEach(menu => {
                          let menu_id = menu.id+'.0';
                          db.transaction(
                            tx => {
                              counter2 = counter2 + 1;
                              tx.executeSql(`SELECT * FROM menu_submenu_timingslots_tbl 
                                WHERE day = ${dayNum} AND menu_id = ${menu_id} AND submenu_id IS NULL AND pos_status = 'A' 
                                AND ((delivery_start <= '${hourMin}' AND delivery_end >= '${hourMin}') OR (collection_start <= '${hourMin}' AND collection_end >= '${hourMin}')) 
                                ORDER BY id ASC LIMIT 1`,[],

                                (_, { rows: { _array } }) => {
                                  // console.log(_array);
                                  let timingslots = {};
                                  if (_array.length > 0) {
                                    if ((_array[0].delivery_start <= hourMin && _array[0].delivery_end >= hourMin) && (_array[0].collection_start <= hourMin && _array[0].collection_end >= hourMin)) {
                                      timingslots.delivery_status = 'A';
                                      timingslots.collection_status = 'A';
                                    } else if (_array[0].delivery_start <= hourMin && _array[0].delivery_end >= hourMin) {
                                      timingslots.delivery_status = 'A';
                                    } else if (_array[0].collection_start <= hourMin && _array[0].collection_end >= hourMin) {
                                      timingslots.collection_status = 'A';
                                    }
                                  } else {
                                    timingslots.delivery_status = 'I';
                                    timingslots.collection_status = 'I';
                                  }
                                  menu.timingslots = timingslots;
                                  menusTimingSlots.push(menu);
                                }
                              );
                            },
                            (_t, _error) => { console.log("db error load menu_timingslots") },
                            (_t, _success) => { 
                              if (counter2 == menus_timings.length) {
                                console.log("db load menu_timingslots");
                                resolve(menusTimingSlots);
                              }
                            }
                          );
                        });

                    } catch (error) {
                      reject(`reject menu_timingslots try catch error`);
                      console.log(`menu_timingslots try catch error`);
                    }
                  });
                }

                getMenusTimings(menusArr).then((menus_timings) => {
                  // console.log(menus_timings);

                  getMenusTimingSlots(menus_timings).then((menus_timingslots) => {
                    // console.log(menus_timingslots);
                    dispatch({
                      type: GET_DB_MENUS,
                      payload: menus_timingslots
                    })
  
                  }).catch( (menus_timingslots_message) =>{
                    console.log('error'+menus_timingslots_message);
                  });

                }).catch( (menus_timings_message) =>{
                  console.log('error'+menus_timings_message);
                });

              }
            }
          );
        },
        (_t, _error) => { console.log("db error load menus") },
        (_t, _success) => { console.log("db load menus"); }
      );
    }
  } catch (error) {
    console.log('getDbMenus action catch error');
  }
}

export const getDbSubmenus = () => {
  try {
    return dispatch => {
      db.transaction(
        tx => {
          tx.executeSql(`select * from submenus_tbl`,[],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                dispatch({
                  type: GET_DB_SUBMENUS,
                  payload: _array
                })
              }
            }
          );
        },
        (_t, _error) => { console.log("db error load submenus") },
        (_t, _success) => { console.log("db load submenus"); }
      );
    }
  } catch (error) {
    console.log('getDbSubmenus action catch error');
  }
}

export const getDbGroups = () => {
  try {
    return dispatch => {
      db.transaction(
        tx => {
          tx.executeSql('select * from groups_tbl',[],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                dispatch({
                  type: GET_DB_GROUPS,
                  payload: _array
                })
              }
            }
          );
        },
        (_t, _error) => { console.log("db error load groups") },
        (_t, _success) => { console.log("db load groups"); }
      );
    }
  } catch (error) {
    console.log('getDbGroups action catch error');
  }
}

export const getDbAddons = () => {
  try {
    return dispatch => {
      db.transaction(
        tx => {
          tx.executeSql('select * from addons_tbl',[],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                dispatch({
                  type: GET_DB_ADDONS,
                  payload: _array
                })
              }
            }
          );
        },
        (_t, _error) => { console.log("db error load addons") },
        (_t, _success) => { console.log("db load addons"); }
      );
    }
  } catch (error) {
    console.log('getDbAddons action catch error');
  }
}

export const getDbSubmenuAddons = () => {
  try {
    return dispatch => {
      db.transaction(
        tx => {
          tx.executeSql('select * from submenu_addons_tbl',[],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                dispatch({
                  type: GET_DB_SUBMENUADDONS,
                  payload: _array
                })
              }
            }
          );
        },
        (_t, _error) => { console.log("db error load submenu addons") },
        (_t, _success) => { console.log("db load submenu addons"); }
      );
    }
  } catch (error) {
    console.log('getDbSubmenuAddons action catch error');
  }
}

export const getDbMenuSubmenuTimings = () => {
  try {
    return dispatch => {
      db.transaction(
        tx => {
          tx.executeSql('select * from menu_submenu_timings_tbl',[],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                dispatch({
                  type: GET_DB_MENUSUBMENUTIMINGS,
                  payload: _array
                })
              }
            }
          );
        },
        (_t, _error) => { console.log("db error load menu submenu timings") },
        (_t, _success) => { console.log("db load menu submenu timings"); }
      );
    }
  } catch (error) {
    console.log('getDbMenuSubmenuTimings action catch error');
  }
}

export const getDbMenuSubmenuTimingSlots = () => {
  try {
    return dispatch => {
      db.transaction(
        tx => {
          tx.executeSql('select * from menu_submenu_timingslots_tbl',[],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                dispatch({
                  type: GET_DB_MENUSUBMENUTIMINGSLOTS,
                  payload: _array
                })
              }
            }
          );
        },
        (_t, _error) => { console.log("db error load menu submenu timing slots") },
        (_t, _success) => { console.log("db load menu submenu timing slots"); }
      );
    }
  } catch (error) {
    console.log('getDbMenuSubmenuTimingSlots action catch error');
  }
}

export const changeAuthStatus = (auth_status) => {
  return dispatch => {
    dispatch({
      type: AUTH_STATUS,
      payload: auth_status
    })
  }
}

// get conditional db data //
export const getDbSubmenusById = (menu_id) => {
  try {
    return async dispatch => {
      var submenusArr = [];
      await db.transaction(
        tx => {
          tx.executeSql(`SELECT * FROM submenus_tbl WHERE menu_id = ${menu_id} ORDER BY orders ASC`,[],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                submenusArr = _array;
                menu_id = menu_id+'.0';

                // get submenus timings values //
                const getSubmenusTimings = (submenus) => {
                  return new Promise((resolve, reject) => {
                    try {
                        
                        let submenusTimings = [];
                        let counter3 = 0;
                        
                        submenus.forEach(submenu => {
                          let submenu_id = submenu.id+'.0';
                          db.transaction(
                            tx => {
                              counter3 = counter3 + 1;
                              tx.executeSql(`SELECT * FROM menu_submenu_timings_tbl 
                                WHERE day = ${dayNum} AND menu_id = ${menu_id} AND submenu_id = ${submenu_id} AND pos_status = "A" 
                                ORDER BY id ASC LIMIT 1`,[],
                                (_, { rows: { _array } }) => {
                                  let timing = {};
                                  if (_array.length > 0) {
                                    timing.day = _array[0].day;
                                    timing.day_status = _array[0].day_status;
                                    timing.delivery_status = _array[0].delivery_status;
                                    timing.collection_status = _array[0].collection_status;
                                  } else {
                                    timing.day = dayNum;
                                    timing.day_status = 'I';
                                    timing.delivery_status = 'I';
                                    timing.collection_status = 'I';
                                  }
                                  submenu.timings = timing;
                                  submenusTimings.push(submenu);
                                }
                              );
                            },
                            (_t, _error) => { console.log("db error load submenu_timings") },
                            (_t, _success) => { 
                              if (counter3 == submenus.length) {
                                console.log("db load submenu_timings");
                                resolve(submenusTimings);
                              }
                            }
                          );
                        });

                    } catch (error) {
                      reject(`reject submenu_timings try catch error`);
                      console.log(`submenu_timings try catch error`);
                    }
                  });
                }

                // get submenus timing slots values //
                const getSubmenusTimingSlots = (submenus_timings) => {
                  return new Promise((resolve, reject) => {
                    try {

                        let submenusTimingSlots = [];
                        let counter4 = 0;
                        
                        submenus_timings.forEach(submenu => {
                          let submenu_id = submenu.id+'.0';

                          db.transaction(
                            tx => {
                              counter4 = counter4 + 1;
                              tx.executeSql(`SELECT * FROM menu_submenu_timingslots_tbl 
                                WHERE day = ${dayNum} AND menu_id = ${menu_id} AND submenu_id = ${submenu_id} AND pos_status = 'A' 
                                AND ((delivery_start <= '${hourMin}' AND delivery_end >= '${hourMin}') OR (collection_start <= '${hourMin}' AND collection_end >= '${hourMin}')) 
                                ORDER BY id ASC LIMIT 1`,[],

                                (_, { rows: { _array } }) => {
                                  // console.log(_array);
                                  let timingslots = {};
                                  if (_array.length > 0) {
                                    if ((_array[0].delivery_start <= hourMin && _array[0].delivery_end >= hourMin) && (_array[0].collection_start <= hourMin && _array[0].collection_end >= hourMin)) {
                                      timingslots.delivery_status = 'A';
                                      timingslots.collection_status = 'A';
                                    } else if (_array[0].delivery_start <= hourMin && _array[0].delivery_end >= hourMin) {
                                      timingslots.delivery_status = 'A';
                                    } else if (_array[0].collection_start <= hourMin && _array[0].collection_end >= hourMin) {
                                      timingslots.collection_status = 'A';
                                    }
                                  } else {
                                    timingslots.delivery_status = 'I';
                                    timingslots.collection_status = 'I';
                                  }
                                  timingslots.day = dayNum;
                                  submenu.timingslots = timingslots;
                                  submenusTimingSlots.push(submenu);
                                }
                              );
                            },
                            (_t, _error) => { console.log("db error load submenu_timingslots") },
                            (_t, _success) => { 
                              if (counter4 == submenus_timings.length) {
                                console.log("db load submenu_timingslots");
                                resolve(submenusTimingSlots);
                              }
                            }
                          );

                        });

                    } catch (error) {
                      reject(`reject submenu_timingslots try catch error`);
                      console.log(`submenu_timingslots try catch error`);
                    }
                  });
                }

                getSubmenusTimings(submenusArr).then( async (submenus_timings) => {
                  // console.log(submenus_timings);

                  await getSubmenusTimingSlots(submenus_timings).then((submenus_timingslots) => {
                    // console.log(submenus_timingslots);
                    dispatch({
                      type: GET_DB_SUBMENUS_ID,
                      payload: submenus_timingslots
                    })
  
                  }).catch( (submenus_timingslots_message) =>{
                    console.log('error'+submenus_timingslots_message);
                  });

                }).catch( (submenus_timings_message) =>{
                  console.log('error'+submenus_timings_message);
                });

              }
            }
          );
        },
        (_t, _error) => { console.log("db error load submenus id"); },
        (_t, _success) => { console.log("db load submenus id "+submenusArr.length); }
      );
    }
  } catch (error) {
    console.log('getDbSubmenusById action catch error');
  }
}

export const getDbSubmenuGroupAddons = (submenu_id) => {
  try {
    return dispatch => {

      const getSubmenuGroupsFun = (submenu_id) => {
        return new Promise((resolve, reject) => {
          try {
            let submenuGroupArr = [];
            db.transaction(
              tx => {
                tx.executeSql(`SELECT groups_tbl.id, groups_tbl.name, groups_tbl.orders, groups_tbl.min_quantity, groups_tbl.max_quantity, groups_tbl.special_group, 
                submenu_addons_tbl.submenu_id, submenu_addons_tbl.group_id, submenu_addons_tbl.group_order FROM groups_tbl INNER JOIN submenu_addons_tbl 
                ON groups_tbl.id = submenu_addons_tbl.group_id WHERE submenu_addons_tbl.submenu_id = ${submenu_id} GROUP BY submenu_addons_tbl.group_id`,[],
                  (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                      submenuGroupArr = _array;
                      let groupAddonArr = [];
                    }
                  }
                );
              },
              (_t, _error) => { 
                console.log("db error load submenu groups join");
                reject('db error load submenu groups join');
              },
              (_t, _success) => { 
                console.log("db load submenu groups join "+submenuGroupArr.length); 
                resolve(submenuGroupArr);
              }
            );
          } catch (error) {
            console.log('getSubmenuGroupsFun action catch error');
          }
        });
      }

      const getGroupAddonsFun = (submenuGroupArr, submenu_id) => {
        return new Promise((resolve, reject) => {
          try {
            let groupAddonArr = [];
            let count = 0;
            submenuGroupArr.forEach(group => {
              db.transaction(
                tx => {
                  count = count + 1;
                  tx.executeSql(`SELECT addons_tbl.id, addons_tbl.group_id, addons_tbl.name, addons_tbl.price, addons_tbl.orders, 
                  submenu_addons_tbl.group_id, submenu_addons_tbl.addson_id FROM addons_tbl INNER JOIN submenu_addons_tbl 
                  ON addons_tbl.id = submenu_addons_tbl.addson_id WHERE submenu_addons_tbl.submenu_id = ${submenu_id} AND submenu_addons_tbl.group_id = ${group.id}
                  GROUP BY submenu_addons_tbl.addson_id`,[],
                    
                    (_, { rows: { _array } }) => {
                      if (_array.length > 0) {
                        group.addons = _array;
                        groupAddonArr.push(group);
                      }
                    }
                  );
                },
                (_t, _error) => { console.log("db error load group addons join"); },
                (_t, _success) => { 
                  if (count == submenuGroupArr.length) {
                    console.log("db load group addons join");
                    resolve(groupAddonArr);
                  }
                }
              )
            })

          } catch (error) {
            reject(`reject getGroupAddonsFun join try catch error`);
            console.log(`getGroupAddonsFun join try catch error`);
          }
        });
      }


      getSubmenuGroupsFun(submenu_id).then( async (submenu_groups_arr) => {
        // console.log('submenu_groups_arr'+ submenu_groups_arr);
        if (submenu_groups_arr.length > 0) {

          await getGroupAddonsFun(submenu_groups_arr, submenu_id).then( (groupaddons_arr) => {
            // console.log(JSON.stringify(groupaddons_arr));
            if (groupaddons_arr.length > 0) {
              dispatch({
                type: GET_DB_SUBMENUGROUPADDONS,
                payload: groupaddons_arr
              })
            } else {
              console.log('selected submenu group addons not found');
            }
            
          }).catch( (groupaddons_message) =>{
            console.log('error '+groupaddons_message);
          });

        } else {
          dispatch({
            type: GET_DB_GROUPADDONSTATUS,
            payload: 'false'
          })
        }

      }).catch( (submenuaddons_message) =>{
        console.log(submenuaddons_message);
      });

    }
  } catch (error) {
    console.log('getDbSubmenuGroupAddons action catch error');
  }
}

// change status if group addons not exists //
export const resetActions = () => {
  return dispatch => {
    dispatch({
      type: GET_DB_GROUPADDONSTATUS,
      payload: ''
    })
    dispatch({
      type: GET_DB_SUBMENUGROUPADDONS,
      payload: []
    })
  }
}

// export const resetActions = status => dispatch => {
//   dispatch({
//     type: GET_DB_GROUPADDONSTATUS,
//     payload: status
//   })
// }
