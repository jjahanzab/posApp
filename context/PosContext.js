import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from "react-redux";

import { getDbSubmenusById } from '../redux/actions/PosAction';
import { db } from '../Models/Database';


const PosContext = React.createContext();

const PosProvider = ({children}) => {

  const { user, install } = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  const { dbMenus } = useSelector(state => state.PosReducer);

  const [ posLoader, setPosLoader ] = useState('false');
  const [ submenuGroupAddons, setsubmenuGroupAddons ] = useState([]);
  const [ submenuGroupAddonsStatus, setsubmenuGroupAddonsStatus ] = useState('');
  const [ basketStatus, setBasketStatus ] = useState(0);
  const [ basketPrice, setBasketPrice ] = useState(0);
  const [ menuId, setMenuId ] = useState(0);
  const [ deliveryType, setDeliveryType ] = useState('T');
  const [ payNow, setPayNow ] = useState(false);
  const [ paymentType, setPaymentType ] = useState('');
  

  // get first available menu id from menus // 
  useEffect(()=>{
    if (dbMenus.length > 0) {
      if (menuId == 0) {
        let firstObj = '';
        dbMenus.forEach(element => {
          if (firstObj == '') {
            if (element.timings && element.timings.day_status == "I") {
              if (element.timingslots && element.timingslots.collection_status == "I") {
                firstObj = element;
              }
            }
          }
        });
        if (Object.keys(firstObj).length !== 0) {
          let firstMenuId = firstObj.id;
          // console.log(firstMenuId);
          dispatch(getDbSubmenusById(firstMenuId));
          setMenuId(firstMenuId);
        }
      } else if (menuId > 0) {
        dispatch(getDbSubmenusById(menuId));
      }
    }
  },[dbMenus]);


  const getSubmenuGroupAddonsFun = (submenu_id) => {
    try {
  
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
              setsubmenuGroupAddons(groupaddons_arr);
            } else {
              console.log('selected submenu group addons not found');
            }
            
          }).catch( (groupaddons_message) =>{
            console.log('error '+groupaddons_message);
          });

        } else {
          setsubmenuGroupAddonsStatus('false');
        }

      }).catch( (submenuaddons_message) =>{
        console.log(submenuaddons_message);
      });
  
    } catch (error) {
      console.log('getSubmenuGroupAddonsFun catch error');
    }
  }


  // basket total price //
  const getBasketTotalPrice = async () => {

    try {
      const bkitems = await AsyncStorage.getItem('basket');
      if(bkitems !== null) {
        
        let prevBasketItems = JSON.parse(bkitems);
        let totalPrice = 0;

        prevBasketItems && prevBasketItems.map((submenu, index)=>{
          totalPrice = totalPrice + (parseFloat(submenu.price) * parseFloat(submenu.qty));
            
          if (submenu.groups && submenu.groups.length) {
            submenu.groups.map((group, index)=>{
              
              if (group.addons && group.addons.length > 0) {
                group.addons.map((addon, index)=>{

                  totalPrice = totalPrice + (parseFloat(addon.price) * parseFloat(submenu.qty));

                })
              }
                
            })
          }
            
        })

        if (parseFloat(totalPrice) > 0) {
          setBasketPrice(parseFloat(totalPrice).toFixed(2));
        }

      } else {
        setBasketPrice(0);
      }

    } catch(error) {
      console.log(error);
    }
    
  }
  useEffect(()=>{
    // if (userToken && userToken !== null) {
      getBasketTotalPrice();
    // }
  },[basketStatus]);


  // clear basket items //
  const clearBasketFun = async () => {
    console.log('clearBasketFun');
    try {
      await AsyncStorage.removeItem('basket');
      setBasketStatus(+new Date());
      setBasketPrice(0);
    } catch(e) {
      console.log(`clearBasketFun catch error: ${e}`);
    }
  }


  const changeSpecialCharFun = (str) => {
    let newStr = str.includes("&#34;") ? str.replace('&#34;', '"') : str.includes("&#39;") ? str.replace('&#39;', "'") : str;
    return newStr;
  }


  return (
    <>
      <PosContext.Provider value={
        {
          posLoader, setPosLoader,
          getSubmenuGroupAddonsFun,
          submenuGroupAddons, setsubmenuGroupAddons,
          submenuGroupAddonsStatus, setsubmenuGroupAddonsStatus,
          basketStatus, setBasketStatus,
          basketPrice, setBasketPrice,
          menuId, setMenuId,
          deliveryType, setDeliveryType,
          clearBasketFun,
          changeSpecialCharFun,
          payNow, setPayNow,
          paymentType, setPaymentType
        }
      }>
        {children}
      </PosContext.Provider>
    </>
  );
}

export {PosContext, PosProvider};