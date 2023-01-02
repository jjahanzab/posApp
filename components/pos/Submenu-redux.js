import React, { useContext, useState, useEffect } from 'react';
import SubmenuStyle from "../../assets/css/SubmenuStyle";
import { Text, View, Button, ScrollView, Pressable, Modal, Alert, TextInput } from 'react-native';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

import { getDbSubmenusById, getDbSubmenuGroupAddons, resetActions } from '../../redux/actions/PosAction';
import { PosContext } from '../../context/PosContext';
import AddonStyle from "../../assets/css/AddonStyle";
import Loader from '../Loader';

function Submenu(props) {

  const dispatch = useDispatch();
  const { dbSubmenus, dbSubmenuAddonsIds, dbGroupAddonStatus, dbSubmenuGroupAddons } = useSelector(state => state.PosReducer);
  const { menuId, setMenuId, basketStatus, setBasketStatus } = useContext(PosContext);
  const [ selectedSubmenu, setSelectedSubmenu ] = useState([]);
  
  const [ loader, setLoader ] = useState(false);
  const [addonModal, setAddonModal] = useState(false);
  const [lists, setLists] = useState([]);
  const [activeSubmenu, setActiveSubmenu] = useState([]);
  const [helper, setHelper] = useState(0);
  const [specialGroupText, setSpecialGroupText] = useState('');

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const handleSubmenuData = async (submenu) => {
    // console.log(JSON.stringify(submenu));
    setSelectedSubmenu(submenu);
    await dispatch(getDbSubmenuGroupAddons(submenu.id));

    console.log(submenu.id);
  }

  useEffect(()=>{
    if (dbGroupAddonStatus == 'false') {
      let singleSubmenu = selectedSubmenu;
      singleSubmenu.groups = '';
      storeData(singleSubmenu);
    }
    dispatch(resetActions());
  },[dbGroupAddonStatus]);

  useEffect(() => {
    try {
      if (dbSubmenuGroupAddons && dbSubmenuGroupAddons.length > 0) {
        // console.log(JSON.stringify(dbSubmenuGroupAddons));
        setAddonModal(true);
        setLists(dbSubmenuGroupAddons);
      }
    } catch (exception) {
      console.log(exception);
    }
  }, [dbSubmenuGroupAddons]);

  const hideAddonModal = async () => {
    setAddonModal(false);
    setLists([]);
    setSelectedSubmenu([]);
    setSpecialGroupText('');
    await dispatch(resetActions());
  }

  const handleAddonActive = (item) => {
    setLoader(true);

    let alterData = lists;
    alterData.map((group) => {
      group.addons.map((addon) => {
        if (addon.group_id == item.group_id && addon.addson_id == item.addson_id) {
          if (addon["status"] && addon["status"] == "active") {
            delete addon["status"];
          } else {
            addon["status"] = "active";
          }
        }
        return addon;
      })
    })
    setLists(alterData);
    setHelper(+new Date());

    setLoader(false);
  }

  const handleSpecialGroup = (group_id) => {
    setLoader(true);

    if (specialGroupText && specialGroupText.trim().length > 0) {

      // console.log(specialGroupText);
      // console.log(JSON.stringify(lists));

      let alterData = lists;
      alterData.map((group) => {
        if (group.id == group_id) {
          group["special_group_value"] = specialGroupText;
        }
        return group;
      })

      // console.log(JSON.stringify(alterData));
      setLists(alterData);
      setHelper(+new Date());
      // setSpecialGroupText('');
    }

    setLoader(false);
  }
  
  const addSubmenuGroupAddonCart = () => {
    setLoader(true);

    // let returns = '';
    // returns = validateGroupAddons();
    
    let returns = '';
    let validationError = '';
    let filterData = [];
    filterData = lists;

    // groups loop //
    filterData.map((group) => {
      let groupName = group.name;
      let minQty = group.min_quantity;
      let maxQty = group.max_quantity;
      let activeAddons = 0;

      // addons loop //
      group.addons.map((addon) => {
        if (addon["status"] && addon["status"] == "active") {
          activeAddons = activeAddons + 1;
        }
      })

      // console.log('minQty '+minQty+' - maxQty '+maxQty+' - '+activeAddons);
      if (activeAddons >= minQty && activeAddons <= maxQty) {
        console.log('validate group addons');
      } else if (activeAddons < minQty) {
        validationError = validationError + `select minimum ${minQty} options for ${groupName}.\n`;
      } else if (activeAddons > maxQty) {
        validationError = validationError + `select maximum ${maxQty} options for ${groupName}.\n`;
      }
    })

    if (validationError && validationError != '') {
      btnAlert(validationError);
      returns = 'false';
    } else {
      returns = 'true';
    }

    if (returns == 'true') {

      let submenuVal = selectedSubmenu;
      let editLists = dbSubmenuGroupAddons;
      let updateLists = [];
      // console.log(JSON.stringify(dbSubmenuGroupAddons));

      editLists.forEach(group => {
        let addonsList = [];
        group.addons.forEach(addon => {
          if (addon["status"] && addon["status"] == "active") {
            addonsList.push(addon);
          }
        })
        if (addonsList.length > 0) {
          group.addons = addonsList;
          updateLists.push(group);
        } else {
          if (group.special_group == 'A' && group.special_group_value !== '') {
            delete group.addons;
            updateLists.push(group);
          }
        }
      });
      // console.log(JSON.stringify(updateLists));

      if (updateLists.length > 0) {
        submenuVal.groups = updateLists;
      }

      // console.log(JSON.stringify(submenuVal));
      storeData(submenuVal);
    }

    setLoader(false);
  }

  const validateGroupAddons = () => {

    let returns = '';
    let validationError = '';
    let filterData = [];
    
    filterData = lists;

    // groups loop //
    filterData.map((group) => {

      let groupName = group.name;
      let minQty = group.min_quantity;
      let maxQty = group.max_quantity;
      let activeAddons = 0;

      // addons loop //
      group.addons.map((addon) => {
        if (addon["status"] && addon["status"] == "active") {
          activeAddons = activeAddons + 1;
        }
      })

      // console.log('minQty '+minQty+' - maxQty '+maxQty+' - '+activeAddons);
      if (activeAddons >= minQty && activeAddons <= maxQty) {
        console.log('validate group addons');
      } else if (activeAddons < minQty) {
        validationError = validationError + `select minimum ${minQty} options for ${groupName}.\n`;
      } else if (activeAddons > maxQty) {
        validationError = validationError + `select maximum ${maxQty} options for ${groupName}.\n`;
      }
    })

    if (validationError && validationError != '') {
      btnAlert(validationError);
      returns = 'false';
    } else {
      returns = 'true';
    }

    return returns;
  }

  // store data in basket //
  const storeData = async (submenu) => {
    setLoader(true);

    submenu.qty = 1;
    submenu.slug = +new Date();
    
    let storeValue = [];
    storeValue.push(submenu);
    let storeFirstValue = JSON.stringify(storeValue);
    // console.log(storeFirstValue);

    try {
      const basketItems = await AsyncStorage.getItem('basket');
      if(basketItems !== null) {
        
        let prevBasketItems = JSON.parse(basketItems);
        prevBasketItems.push(submenu);
        let storeLastValue = JSON.stringify(prevBasketItems);
        try {
          await AsyncStorage.setItem('basket', storeLastValue);
          setBasketStatus(+new Date());
        } catch (e) {
          console.log(e);
        }

      } else {
        try {
          await AsyncStorage.setItem('basket', storeFirstValue);
          setBasketStatus(+new Date());
        } catch (e) {
          console.log(e);
        }
      }
    } catch(e) {
      console.log(e);
    }

    // console.log('menuId '+menuId);
    await dispatch(getDbSubmenusById(menuId));
    await dispatch(resetActions());
    hideAddonModal();

    setLoader(false);
  }

  const btnAlert = (message) => Alert.alert(
    "Warning!",
    message
  );

  const twoDecimal = (value) => {
    value = parseFloat(value).toFixed(2);
    return value;
  }

  if (loader) {
    return(
      <Loader/>
    )
  } else {
    return (
      <>
        <View style={[SubmenuStyle.col_7, SubmenuStyle.submenuSection]}>

          <ScrollView>

            { dbSubmenuGroupAddons ? 
              <Modal
                animationType="slide"
                transparent={true}
                visible={addonModal}
                onRequestClose={() => {
                }}
              >
                <View style={AddonStyle.centeredView}>
                  <View style={AddonStyle.modalView}>
                    <ScrollView>
                      {lists ? lists.map((group, index) => {
                        return (
                          <View key={index} style={AddonStyle.groupBox}>
                            <Text variant="titleMedium">{group.name}</Text>
                            <Divider />
                            <View style={AddonStyle.row}>
                              { group.addons ? group.addons.map((item, ind) => {
                                return (
                                  <View key={ind} style={AddonStyle.col_3}>
                                    { item.status && item.status == "active"  ?
                                        <Pressable style={AddonStyle.AddonBtnActive} onPress={() => { handleAddonActive(item) }}>
                                          <Text style={AddonStyle.AddonBtnTextActive}>{item.name} (£{twoDecimal(item.price)})</Text>
                                        </Pressable>
                                      :
                                        <Pressable style={AddonStyle.AddonBtn} onPress={() => { handleAddonActive(item) }}>
                                          <Text style={AddonStyle.AddonBtnText}>{item.name} (£{twoDecimal(item.price)})</Text>
                                        </Pressable>
                                    }
                                  </View>
                                )
                              })
                                : ''
                              }
                            </View>
                            {
                              group.special_group == "A" ? 
                                <>
                                  <Text variant="titleMedium">{'Special Group Value:'}</Text>
                                  <View style={AddonStyle.row}>
                                    <View style={AddonStyle.col_10}>
                                      <TextInput onChangeText={setSpecialGroupText} style={AddonStyle.SpecialGroupInput}
                                        // value={specialGroupText}
                                      />
                                    </View>
                                    <View style={AddonStyle.col_2}>
                                      {
                                        group.special_group_value ? 
                                        <Pressable style={AddonStyle.SpecialGroupBtnActive} onPress={() => { handleSpecialGroup(group.id) }}>
                                          <Text style={AddonStyle.AddonBtnTextActive}>{'Save'}</Text>
                                        </Pressable>
                                        : 
                                        <Pressable style={AddonStyle.SpecialGroupBtn} onPress={() => { handleSpecialGroup(group.id) }}>
                                          <Text style={AddonStyle.AddonBtnText}>{'Save'}</Text>
                                        </Pressable>
                                      }
                                    </View>
                                  </View>
                                </>
                              : ""
                            }
                          </View>
                        )
                      })
                        : ''
                      }
                      <Divider />
                      <View style={[AddonStyle.row, AddonStyle.addonModalFooter]}>
                        <View style={AddonStyle.col_3}>
                          <Pressable style={[AddonStyle.button, AddonStyle.buttonClose]} onPress={() => addSubmenuGroupAddonCart()}>
                            <Text style={AddonStyle.buttonCloseText}>Add to Cart</Text>
                          </Pressable>
                        </View>
                        <View style={AddonStyle.col_3}>
                          <Pressable style={[AddonStyle.button, AddonStyle.buttonClose]} onPress={() => hideAddonModal()}>
                            <Text style={AddonStyle.buttonCloseText}>Close</Text>
                          </Pressable>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            : '' }

            <View style={SubmenuStyle.row}>

              { dbSubmenus && dbSubmenus.map((submenu, index)=>{
                  return (
                    submenu.timings && submenu.timings.day_status == "A" ? "" : 
                      submenu.timingslots && submenu.timingslots.collection_status == "A" ? "" : 
                        <Pressable key={index} style={[SubmenuStyle.col_3, SubmenuStyle.submenusBox]}
                          onPress={() => handleSubmenuData(submenu)}
                        >
                          <Text style={SubmenuStyle.submenuText}>
                            { submenu.id }-{ submenu.name }
                          </Text>
                        </Pressable>
                  )
              })}

            </View>

          </ScrollView>

        </View>
      </>
    );
  }
}

export default Submenu;