import React, { useContext, useState, useEffect } from 'react';
import BasketStyle from "../../assets/css/BasketStyle";
import { Button, TouchableOpacity, Pressable, Text, View, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { PosContext } from '../../context/PosContext';
// import { AuthContext } from  '../context/AuthContext';
// import { AppContext } from  '../context/AppContext';

import { getDbMenus, getDbSubmenusById, changeAuthStatus } from '../../redux/actions/PosAction';

function Basket(props) {

  const dispatch = useDispatch();

  // const { putLogout } = useContext(AuthContext);
  // const { basketStatus, setBasketStatus, basketPrice, clearBasket } = useContext(AppContext);
  const { posLoader, setPosLoader, basketStatus, setBasketStatus, clearBasketFun, basketPrice, 
          deliveryType, setDeliveryType, menuId, changeSpecialCharFun, payNow, setPayNow } = useContext(PosContext);
  const [ basketItems, setbasketItems ] = useState([]);
  const [ totalPrice, setTotalPrice ] = useState(0);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  useEffect(()=>{
    showBasket();
  },[basketStatus]);
  
  const showBasket = async () => {
    try {
      let storedItems = await AsyncStorage.getItem('basket');
      storedItems = JSON.parse(storedItems);
      setbasketItems(storedItems);

    } catch(e) {
      console.log(`showBasket catch error: ${e}`);
    }
  }

  const incraseItem = async (item_id) => {
    try {
      let storedItems = await AsyncStorage.getItem('basket');
      storedItems = JSON.parse(storedItems);
      
      // increate qty value //
      storedItems.forEach((item,index)=>{
        if(item.slug === item_id){
          let search_qty = storedItems[index].qty;
          storedItems[index].qty = parseInt(search_qty) + 1;
        }
      })

      let updatedStoredItems = JSON.stringify(storedItems);

      try {
        await AsyncStorage.setItem('basket', updatedStoredItems);
        setBasketStatus(+new Date());
      } catch (e) {
        console.log(e);
      }

    } catch(e) {
      console.log(`incraseItem catch error: ${e}`);
    }
  }
  
  const decraseItem = async (item_id) => {
    try {
      let storedItems = await AsyncStorage.getItem('basket');
      storedItems = JSON.parse(storedItems);

      let conditionStoredItems = storedItems;
      
      // increate qty value //
      storedItems.forEach((item,index)=>{
        if(item.slug === item_id){

          let search_qty = storedItems[index].qty;
          if (parseInt(search_qty) == 1) {
            conditionStoredItems = conditionStoredItems.filter(obj => obj.slug != item_id);

          } else if (parseInt(search_qty) > 1) {
            conditionStoredItems[index].qty = parseInt(search_qty) - 1;
          }
        }
      })

      if (conditionStoredItems.length > 0) {
        let updatedStoredItems = JSON.stringify(conditionStoredItems);
  
        try {
          await AsyncStorage.setItem('basket', updatedStoredItems);
          setBasketStatus(+new Date());
        } catch (e) {
          console.log(e);
        }
      } else {
        clearBasketFun();
      }


    } catch(e) {
      console.log(`decraseItem catch error: ${e}`);
    }
  }

  const putLogoutFun = () => {
    dispatch(changeAuthStatus(false));
    AsyncStorage.removeItem('auth');
  }

  const submenuTotalPrice = (submenu) => {
    let submenu_total_price = 0;
    submenu_total_price = submenu_total_price + (parseFloat(submenu.price) * parseFloat(submenu.qty));

    // add addons price with submenu price //
    if (submenu.groups && submenu.groups.length) {
      submenu.groups.map((group, index)=>{
        if (group.addons && group.addons.length > 0) {
          group.addons.map((addon, index)=>{
            submenu_total_price = submenu_total_price + (parseFloat(addon.price) * parseFloat(submenu.qty));
          })
        }
      })
    }

    if (parseFloat(submenu_total_price) > 0) {
      submenu_total_price = parseFloat(submenu_total_price).toFixed(2);
    }

    return submenu_total_price;
  }

  const changeInstallStatus = () => {
    // dispatch(changeAuthStatus(false));
    // AsyncStorage.removeItem('auth');

    AsyncStorage.setItem('install', 'second');
    dispatch(changeInstallStatus('second'));
    console.log('set second value');
  }

  const changeDeliveryTypeFun = async (val) => {
    // setPosLoader('true');
    
    // await sleep(1000);
    setDeliveryType(val);
    console.log('changing delivery type');
    // console.log(menuId);
    dispatch(getDbMenus());
    dispatch(getDbSubmenusById(menuId));

    // setPosLoader('false');
  }

  const saveOrderFun = () => {
    console.log('save order');
  }

  const payNowFun = () => {
    console.log('pay now');
    setPayNow(true);
  }

  const backToMenuFun = () => {
    console.log('pay now');
    setPayNow(false);
  }

  // const changeSpecialChar = (str) => {
  //   let newStr = str.includes("&#34;") ? str.replace('&#34;', '"') : str.includes("&#39;") ? str.replace('&#39;', "'") : str;
  //   return newStr;
  // }

  return (
    <>
      <View style={[BasketStyle.col_5, BasketStyle.basketSection]}>

        {/* Delivery Types */}
        <View style={BasketStyle.row}>
          <View style={BasketStyle.col_5}>
            <TouchableOpacity onPress={()=>changeDeliveryTypeFun('T')}>
              { deliveryType == 'T' ?
                  <View style={BasketStyle.deliveryBtnActive}>
                    <Text style={BasketStyle.deliveryBtnInsideActive}>{'Take Away'}</Text>
                  </View>
                :
                  <View style={BasketStyle.deliveryBtn}>
                    <Text style={BasketStyle.deliveryBtnInside}>{'Take Away'}</Text>
                  </View>
              }
            </TouchableOpacity>
          </View>
          <View style={BasketStyle.col_5}>
            <TouchableOpacity onPress={()=>changeDeliveryTypeFun('D')}>
              { deliveryType == 'D' ?
                  <View style={BasketStyle.deliveryBtnActive}>
                    <Text style={BasketStyle.deliveryBtnInsideActive}>{'Delivery'}</Text>
                  </View>
                :
                  <View style={BasketStyle.deliveryBtn}>
                    <Text style={BasketStyle.deliveryBtnInside}>{'Delivery'}</Text>
                  </View>
              }
            </TouchableOpacity>
          </View>
          <View style={BasketStyle.col_2}>
          <Text>{deliveryType}</Text>
          </View>
        </View>

        <View style={BasketStyle.basketContainer}>

          <ScrollView>

            <View style={BasketStyle.row}>
              <View style={[BasketStyle.col_3, BasketStyle.basketCell]}>
                <Text style={[BasketStyle.basketTextNo, BasketStyle.fontBold]}>{'Qty'}</Text>
              </View>
              <View style={[BasketStyle.col_7, BasketStyle.basketCell]}>
                <Text style={[BasketStyle.basketTextName, BasketStyle.fontBold]}>{'Items'}</Text>
              </View>
              <View style={[BasketStyle.col_2, BasketStyle.basketCell]}>
                <Text style={[BasketStyle.basketTextPrice, , BasketStyle.fontBold]}>{'Price'}</Text>
              </View>
            </View>

            { basketItems && basketItems.map((item, index)=>{
                return (
                  <View key={index} style={BasketStyle.row}>

                    <View style={[BasketStyle.col_3, BasketStyle.basketCell]}>

                      <View style={BasketStyle.row}>
                        <View style={BasketStyle.col_4}>
                          
                          <TouchableOpacity onPress={()=>incraseItem(item.slug)}>
                            {/* <View style={BasketStyle}> */}
                              <Text style={BasketStyle.incBtn}>{'+'}</Text>
                            {/* </View> */}
                          </TouchableOpacity>
                          {/* <Button onPress={()=>incraseItem(item.slug)} title="+" color={'#339933'} /> */}

                        </View>
                        <View style={[BasketStyle.col_4, BasketStyle.textVerticalCenter]}>
                          <Text style={[BasketStyle.basketTextNo]}>{item.qty}</Text>
                        </View>
                        <View style={BasketStyle.col_4}>

                          <TouchableOpacity onPress={()=>decraseItem(item.slug)}>
                            {/* <View style={BasketStyle}> */}
                              <Text style={BasketStyle.decBtn}>{'-'}</Text>
                            {/* </View> */}
                          </TouchableOpacity>
                          {/* <Button onPress={()=>decraseItem(item.slug)} title="-" color={'#111111'} /> */}

                        </View>
                      </View>

                    </View>
                    <View style={[BasketStyle.col_7, BasketStyle.basketCell]}>
                      <Text style={BasketStyle.basketTextName}>{changeSpecialCharFun(item.name)}-({item.price})</Text>
                      { 
                        item.groups && item.groups.length > 0 ? 
                          item.groups.map((group, index)=>{
                            return (
                              <View key={index}>
                                <Text style={BasketStyle.basketTextName}>[{changeSpecialCharFun(group.name)}]</Text>
                                { 
                                  group.addons && group.addons.length > 0 ? 
                                    group.addons.map((addon, index)=>{
                                      return (
                                        <Text key={index} style={BasketStyle.basketTextName}>(
                                          {changeSpecialCharFun(addon.name)}-{addon.price}
                                        )</Text>
                                      )
                                    })
                                  : ''
                                }
                                <Text style={BasketStyle.basketTextName}>{group.special_group_value ? group.special_group_value : ''}</Text>
                              </View>
                            )
                          })
                        : ''
                      }
                    </View>
                    <View style={[BasketStyle.col_2, BasketStyle.basketCell]}>
                      <Text style={BasketStyle.basketTextPrice}>
                        {/* {item.price * item.qty} */}
                        { submenuTotalPrice(item) }
                      </Text>
                    </View>

                  </View>
                )
            })}

          </ScrollView>

        </View>

        <View style={BasketStyle.row}>

          {/* <View style={BasketStyle.col_4}>
            <TouchableOpacity onPress={()=>saveOrderFun()}>
              <View style={BasketStyle.clearBasketBtn}>
                <Text style={BasketStyle.clearBasketBtnInside}>{'Save Order'}</Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {
            payNow == true ?
              <View style={BasketStyle.col_4}>
                <TouchableOpacity onPress={()=>backToMenuFun()}>
                  <View style={BasketStyle.clearBasketBtn}>
                    <Text style={BasketStyle.clearBasketBtnInside}>{'Back To Menu'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              :
              <View style={BasketStyle.col_4}>
                <TouchableOpacity onPress={()=>payNowFun()}>
                  <View style={BasketStyle.clearBasketBtn}>
                    <Text style={BasketStyle.clearBasketBtnInside}>{'Pay Now'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
          }

          <View style={BasketStyle.col_6}>
            <TouchableOpacity onPress={()=>clearBasketFun()}>
              <View style={BasketStyle.clearBasketBtn}>
                <Text style={BasketStyle.clearBasketBtnInside}>{'Clear Bsket'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* <View style={BasketStyle.col_5}>
            <TouchableOpacity onPress={()=>putLogoutFun()}>
              <View style={BasketStyle.clearBasketBtn}>
                <Text style={BasketStyle.clearBasketBtnInside}>{'Logout'}</Text>
              </View>
            </TouchableOpacity>
          </View> */}
          
          
          {/* <View style={BasketStyle.col_3}>
            <TouchableOpacity onPress={()=>changeInstallStatus()}>
              <View style={BasketStyle.clearBasketBtn}>
                <Text style={BasketStyle.clearBasketBtnInside}>
                  <FontAwesome name="bell-slash" size={12} color="white" />
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}

        </View>

        <View style={BasketStyle.row}>
          <View style={BasketStyle.col_12}>
            <Text style={BasketStyle.totalPrice}>{'Total Price: '}{basketPrice}</Text>
            <TextInput label="Sub Total:" value={basketPrice} mode="outlined" disabled={true} style={{height:40}} />
          </View>
        </View>

        <Text style={BasketStyle.totalPrice}>
          { props.authUser ? props.authUser.name : '' }
        </Text>

      </View>

    </>
  );
}

export default Basket;