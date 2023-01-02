import * as Updates from 'expo-updates';
import { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Menus from './others/Menus';
import Submenus from './others/Submenus';
import Groups from './others/Groups';
import Addons from './others/Addons';
import SubmenuAddons from './others/SubmenuAddons';
import { DbModel } from '../Models/DbModel';
import { useSelector, useDispatch } from 'react-redux';
import { changeInstallStatus } from '../redux/actions/UserAction';
import { changeAuthStatus } from '../redux/actions/PosAction';


const Main = (props) => {

  const { tables, install } = useSelector(state => state.UserReducer);
  
  const dispatch = useDispatch();

  const applyChanges = () => {
    dispatch(changeAuthStatus(false));
    AsyncStorage.setItem('auth', 'false');

    AsyncStorage.setItem('install', 'second');
    dispatch(changeInstallStatus('second'));
    console.log('set second value');
  }

  return (
    
    <ScrollView>
      <View style={styles.container}>
        <StatusBar hidden={true} />

        <Text></Text>
        <Text>
        { tables && tables.map((table, index) => {
            return (
              table.name + ' - '
            )
          })
        }
        </Text>

        <Menus />

        <Submenus />

        <Groups />

        <Addons />

        <SubmenuAddons />

        <Text></Text>
        <Button onPress={()=>{applyChanges()}} title="Redirect Start" color="#444444"/>

      </View>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Main;