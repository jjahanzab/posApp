import * as Updates from 'expo-updates';
import { StyleSheet, Text, View, Button, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from "react-redux";
import { DbModel } from '../Models/DbModel';
import { getDbTables, changeInstallStatus } from '../redux/actions/UserAction';
import { getDbUsers, getDbMenus, getDbSubmenus, getDbGroups, getDbAddons, getDbSubmenuAddons, getDbMenuSubmenuTimings, getDbMenuSubmenuTimingSlots } from '../redux/actions/PosAction';

import Loader from './Loader';

const Start = (props) => {

  const [ loader, setLoader ] = useState(false);
  let resetTableStatusStorage =  { users:false, menus:false, submenus:false, groups: false, addons:false, submenu_addons:false };

  const { dbTables, install } = useSelector(state => state.UserReducer);
  const { dbUsers, dbMenus, dbSubmenus, dbGroups, dbAddons, dbSubmenuAddons, dbMenuSubmenuTimings, dbMenuSubmenuTimingSlots } = useSelector(state => state.PosReducer);

  const dispatch = useDispatch();


  useEffect(()=>{
    setLoader(true);

    dispatch(getDbTables());
    dispatch(getDbUsers());
    dispatch(getDbMenus());
    dispatch(getDbSubmenus());
    dispatch(getDbGroups());
    dispatch(getDbAddons());
    dispatch(getDbSubmenuAddons());
    dispatch(getDbMenuSubmenuTimings());
    dispatch(getDbMenuSubmenuTimingSlots());

    // if (dbTables.length < 1) {
    //   dispatch(getDbTables());
    // }
    // if (dbUsers.length < 1) {
    //   dispatch(getDbUsers());
    // }
    // if (dbMenus.length < 1) {
    //   dispatch(getDbMenus());
    // }
    // if (dbSubmenus.length < 1) {
    //   dispatch(getDbSubmenus());
    // }
    // if (dbGroups.length < 1) {
    //   dispatch(getDbGroups());
    // }
    // if (dbAddons.length < 1) {
    //   dispatch(getDbAddons());
    // }
    // if (dbSubmenuAddons.length < 1) {
    //   dispatch(getDbSubmenuAddons());
    // }

    setLoader(false);
  },[]);


  const letsStart = async () => {
    setLoader(true);

    // 2 because 1 table is created by default in sqlite
    if (dbTables.length < 2 && dbUsers.length < 1 && dbMenus.length < 1 && dbSubmenus.length < 1 && dbGroups.length < 1 && dbAddons.length < 1 && dbSubmenuAddons.length < 1) {
      
      let resetStringValue = JSON.stringify(resetTableStatusStorage);
      AsyncStorage.setItem('tables-status', resetStringValue);
      console.log('set tables-status');
      AsyncStorage.setItem('install', 'first');
      dispatch(changeInstallStatus('first'));
      console.log('set first value');

    } else {
      console.log('all tables exists');

      AsyncStorage.setItem('install', 'third');
      dispatch(changeInstallStatus('third'));
      console.log('set third value');
    }

    // try {
    //   let tablesStatus = await AsyncStorage.getItem('tables-status');
    //   if (tablesStatus == null || tablesStatus == '') {
    //     console.log('tables-status storage is empty');
    //   } else {
    //     let objectValue = JSON.parse(tablesStatus);
    //     console.log(objectValue);
    //   }
    // } catch (error) {
    //   console.log('letsStart catch error');
    // }

    // AsyncStorage.setItem('install', '');
    // dispatch(changeInstallStatus(''));
    // DbModel.dropTable('players');
    // await Updates.reloadAsync();

    setLoader(false);
  }


  if (loader) {
    return(
      <Loader/>
    )
  } else {

    return (
      <>
        <View style={styles.container}>
          <Button title={`Let's Start App`} onPress={() => letsStart()} buttonColor={"#2196F3"} style={{marginTop:50, marginBottom:50}} />
          <Text></Text>
          <Text>{`dbTables: ${dbTables.length > 0 ? dbTables.length : ''}`}</Text>
          <Text></Text>
          <Text>{`dbUsers: ${dbUsers.length > 0 ? dbUsers.length : ''}`}</Text>
          <Text></Text>
          <Text>{`dbMenus: ${dbMenus.length > 0 ? dbMenus.length : ''}`}</Text>
          <Text></Text>
          <Text>{`dbSubmenus: ${dbSubmenus.length > 0 ? dbSubmenus.length : ''}`}</Text>
          <Text></Text>
          <Text>{`dbGroups: ${dbGroups.length > 0 ? dbGroups.length : ''}`}</Text>
          <Text></Text>
          <Text>{`dbAddons: ${dbAddons.length > 0 ? dbAddons.length : ''}`}</Text>
          <Text></Text>
          <Text>{`dbSubmenuAddons: ${dbSubmenuAddons.length > 0 ? dbSubmenuAddons.length : ''}`}</Text>
          <Text></Text>
          <Text>{`dbMenuSubmenuTimings: ${dbMenuSubmenuTimings.length > 0 ? dbMenuSubmenuTimings.length:''}`}</Text>
          <Text></Text>
          <Text>{`dbMenuSubmenuTimingSlots: ${dbMenuSubmenuTimingSlots.length > 0 ? dbMenuSubmenuTimingSlots.length:''}`}</Text>
        </View>
      </>
    )

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

export default Start;